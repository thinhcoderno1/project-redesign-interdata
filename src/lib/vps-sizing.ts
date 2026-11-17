/** Planning assumptions, not benchmarks or InterData product specifications. */
export const vpsSizingProfiles = [
  {
    id: "wordpress",
    name: "Website WordPress",
    cpuMs: 120,
    responseMs: 500,
    requestMemoryMb: 64,
    appRamGb: 0.75,
    localDatabase: true,
  },
  {
    id: "commerce",
    name: "Website thương mại điện tử",
    cpuMs: 180,
    responseMs: 600,
    requestMemoryMb: 96,
    appRamGb: 1.25,
    localDatabase: true,
  },
  {
    id: "api",
    name: "API / ứng dụng Node.js",
    cpuMs: 30,
    responseMs: 150,
    requestMemoryMb: 32,
    appRamGb: 0.5,
    localDatabase: true,
  },
  {
    id: "static",
    name: "Website tĩnh",
    cpuMs: 5,
    responseMs: 50,
    requestMemoryMb: 4,
    appRamGb: 0.15,
    localDatabase: false,
  },
] as const;

export const vpsSizingFields = {
  users: {
    label: "Người dùng hoạt động đồng thời",
    min: 1,
    max: 100000,
    step: 1,
    integer: true,
    hint: "Số người đang sử dụng tại giờ cao điểm, không phải lượt truy cập/ngày.",
  },
  requestsPerMinute: {
    label: "Yêu cầu / người / phút",
    min: 0.1,
    max: 120,
    step: 0.1,
    hint: "Số yêu cầu thực sự tới VPS; bỏ qua tài nguyên do CDN hoặc cache bên ngoài phục vụ.",
  },
  dataGb: {
    label: "Dữ liệu hiện tại (GB)",
    min: 0,
    max: 100000,
    step: 1,
    hint: "Tổng mã nguồn, cơ sở dữ liệu và tệp tải lên; chưa gồm hệ điều hành.",
  },
  growthGb: {
    label: "Dữ liệu tăng thêm / tháng (GB)",
    min: 0,
    max: 10000,
    step: 1,
    hint: "Ước tính dung lượng tăng đều mỗi tháng.",
  },
  months: {
    label: "Thời gian dự trù (tháng)",
    min: 1,
    max: 36,
    step: 1,
    integer: true,
    hint: "Tính dung lượng cho 1–36 tháng tới.",
  },
  headroom: {
    label: "Dự phòng tài nguyên (%)",
    min: 0,
    max: 100,
    step: 1,
    hint: "Phần tăng thêm cho CPU, RAM và dung lượng; mặc định 30%.",
  },
  cpuMs: {
    label: "Thời gian CPU / yêu cầu (ms)",
    min: 0.1,
    max: 10000,
    step: 0.1,
    hint: "Thời gian CPU thực dùng, khác với tổng thời gian phản hồi.",
  },
  responseMs: {
    label: "Thời gian xử lý / yêu cầu (ms)",
    min: 1,
    max: 60000,
    step: 1,
    hint: "Thời gian trung bình một yêu cầu ở trên máy chủ, gồm thời gian chờ I/O.",
  },
  requestMemoryMb: {
    label: "RAM tăng thêm / yêu cầu (MB)",
    min: 1,
    max: 2048,
    step: 1,
    hint: "RAM cho mỗi yêu cầu đang xử lý, ngoài RAM nền ứng dụng.",
  },
  appRamGb: {
    label: "RAM nền ứng dụng (GB)",
    min: 0.1,
    max: 256,
    step: 0.1,
    hint: "RAM nền cho ứng dụng, worker và cache trong bộ nhớ.",
  },
  databaseRamGb: {
    label: "RAM dành cho CSDL (GB)",
    min: 0.1,
    max: 512,
    step: 0.1,
    hint: "Chỉ cộng khi cơ sở dữ liệu chạy cùng VPS.",
  },
} as const;

export type VpsProfileId = (typeof vpsSizingProfiles)[number]["id"];
export type VpsNumericKey = keyof typeof vpsSizingFields;
export type VpsSizingInput = Record<VpsNumericKey, number> & {
  app: VpsProfileId;
  localDatabase: boolean;
};

export const vpsSizingAssumptions = {
  osRamGb: 0.75,
  osDiskGb: 12,
  baseCpu: 0.25,
  targetCpuUtilization: 0.7,
} as const;
export const defaultVpsSizingInput: VpsSizingInput = {
  app: "wordpress",
  users: 100,
  requestsPerMinute: 3,
  dataGb: 20,
  growthGb: 2,
  months: 6,
  headroom: 30,
  cpuMs: 120,
  responseMs: 500,
  requestMemoryMb: 64,
  appRamGb: 0.75,
  databaseRamGb: 1,
  localDatabase: true,
};

export function validateVpsSizing(
  input: VpsSizingInput,
): Partial<Record<keyof VpsSizingInput, string>> {
  const errors: Partial<Record<keyof VpsSizingInput, string>> = {};
  if (!vpsSizingProfiles.some((profile) => profile.id === input.app))
    errors.app = "Chọn loại ứng dụng trong danh sách.";
  for (const key of Object.keys(vpsSizingFields) as VpsNumericKey[]) {
    if (key === "databaseRamGb" && !input.localDatabase) continue;
    const field = vpsSizingFields[key];
    const value = input[key];
    if (
      !Number.isFinite(value) ||
      value < field.min ||
      value > field.max ||
      ("integer" in field && field.integer && !Number.isInteger(value))
    )
      errors[key] =
        `Nhập ${"integer" in field ? "số nguyên" : "số"} từ ${field.min} đến ${field.max}.`;
  }
  return errors;
}

export function estimateVpsSizing(input: VpsSizingInput) {
  if (Object.keys(validateVpsSizing(input)).length)
    throw new Error("Thông tin tính cấu hình VPS chưa hợp lệ.");
  const a = vpsSizingAssumptions;
  const requestsPerSecond = (input.users * input.requestsPerMinute) / 60;
  const activeRequests = (requestsPerSecond * input.responseMs) / 1000;
  const reserve = 1 + input.headroom / 100;
  const databaseRamGb = input.localDatabase ? input.databaseRamGb : 0;
  const cpu =
    ((a.baseCpu + (requestsPerSecond * input.cpuMs) / 1000) * reserve) /
    a.targetCpuUtilization;
  const ramGb =
    (a.osRamGb +
      input.appRamGb +
      databaseRamGb +
      (activeRequests * input.requestMemoryMb) / 1024) *
    reserve;
  const futureDataGb = input.dataGb + input.growthGb * input.months;
  const diskGb = (a.osDiskGb + futureDataGb) * reserve;
  const resources = {
    vCpu: cpu <= 1 ? 1 : Math.ceil(cpu / 2) * 2,
    ramGb: Math.max(2, Math.ceil(ramGb / 2) * 2),
    diskGb: Math.max(20, Math.ceil(diskGb / 10) * 10),
  };
  return {
    ...resources,
    requestsPerSecond,
    activeRequests,
    futureDataGb,
    raw: { cpu, ramGb, diskGb },
    largeWorkload:
      resources.vCpu > 32 || resources.ramGb > 128 || resources.diskGb > 2000,
  };
}

export function summarizeVpsSizing(input: VpsSizingInput) {
  const result = estimateVpsSizing(input);
  const profile = vpsSizingProfiles.find((item) => item.id === input.app)!;
  const number = (value: number) =>
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 3 }).format(value);
  return [
    "INTERDATA — ƯỚC TÍNH CẤU HÌNH VPS",
    `Ứng dụng: ${profile.name}`,
    `Nhu cầu${result.largeWorkload ? " tài nguyên tổng" : " đề xuất"}: ${result.vCpu} vCPU | ${result.ramGb} GB RAM | ${result.diskGb} GB SSD`,
    `Người dùng đồng thời: ${input.users}; yêu cầu/người/phút: ${input.requestsPerMinute}`,
    `Tải ước tính: ${number(result.requestsPerSecond)} yêu cầu/giây; ${number(result.activeRequests)} yêu cầu đang xử lý`,
    `Dữ liệu: ${input.dataGb} GB; tăng ${input.growthGb} GB/tháng trong ${input.months} tháng`,
    `Dự phòng: ${input.headroom}%; mục tiêu CPU: 70%`,
    `Giả định/yêu cầu: CPU ${input.cpuMs} ms; xử lý ${input.responseMs} ms; RAM tăng ${input.requestMemoryMb} MB`,
    `RAM nền: hệ điều hành 0,75 GB; ứng dụng ${input.appRamGb} GB; CSDL ${input.localDatabase ? input.databaseRamGb : 0} GB`,
    "Ổ đĩa: cộng 12 GB hệ điều hành; chưa tính bản sao lưu cục bộ, IOPS hoặc băng thông.",
    "Mô hình lập kế hoạch, không phải benchmark hoặc cam kết sức tải. Kiểm thử tải và đo CPU/RAM thực tế trước khi chốt cấu hình.",
    ...(result.largeWorkload
      ? [
          "Nhu cầu lớn: cần đánh giá nhiều máy chủ hoặc kiến trúc riêng, không mặc định triển khai trên một VPS.",
        ]
      : []),
  ].join("\n");
}
