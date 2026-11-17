"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Calculator,
  Copy,
  Cpu,
  HardDrive,
  Info,
  MemoryStick,
  RotateCcw,
} from "lucide-react";
import {
  defaultVpsSizingInput,
  estimateVpsSizing,
  summarizeVpsSizing,
  validateVpsSizing,
  vpsSizingAssumptions,
  vpsSizingFields,
  vpsSizingProfiles,
  type VpsNumericKey,
  type VpsProfileId,
  type VpsSizingInput,
} from "@/lib/vps-sizing";
import { VpsUsageGuide } from "./tool-usage-guides";
import shared from "./tools.module.css";
import styles from "./vps-calculator.module.css";

type FormValues = Record<VpsNumericKey, string> & {
  app: VpsProfileId;
  localDatabase: boolean;
};
const numericKeys = Object.keys(vpsSizingFields) as VpsNumericKey[];
function toForm(input: VpsSizingInput): FormValues {
  return {
    app: input.app,
    localDatabase: input.localDatabase,
    ...(Object.fromEntries(
      numericKeys.map((key) => [key, String(input[key])]),
    ) as Record<VpsNumericKey, string>),
  };
}
const number = (value: number, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits }).format(value);

export function VpsCalculator() {
  const [form, setForm] = useState(() => toForm(defaultVpsSizingInput));
  const [status, setStatus] = useState({ value: "", message: "" });
  const summaryDetails = useRef<HTMLDetailsElement>(null);
  const summaryText = useRef<HTMLTextAreaElement>(null);
  const input = {
    app: form.app,
    localDatabase: form.localDatabase,
    ...(Object.fromEntries(
      numericKeys.map((key) => [
        key,
        form[key].trim() === "" ? NaN : Number(form[key]),
      ]),
    ) as Record<VpsNumericKey, number>),
  };
  const errors = validateVpsSizing(input);
  const result = Object.keys(errors).length ? null : estimateVpsSizing(input);
  const summary = result ? summarizeVpsSizing(input) : "";
  function changeProfile(id: VpsProfileId) {
    const profile = vpsSizingProfiles.find((item) => item.id === id)!;
    setForm((previous) => ({
      ...previous,
      app: id,
      cpuMs: String(profile.cpuMs),
      responseMs: String(profile.responseMs),
      requestMemoryMb: String(profile.requestMemoryMb),
      appRamGb: String(profile.appRamGb),
      localDatabase: profile.localDatabase,
    }));
  }
  function field(key: VpsNumericKey) {
    const spec = vpsSizingFields[key];
    return (
      <div className={shared.field} key={key}>
        <label htmlFor={`vps-${key}`}>{spec.label}</label>
        <input
          id={`vps-${key}`}
          type="number"
          inputMode={"integer" in spec ? "numeric" : "decimal"}
          min={spec.min}
          max={spec.max}
          step={"integer" in spec ? spec.step : "any"}
          value={form[key]}
          onChange={(event) =>
            setForm((previous) => ({ ...previous, [key]: event.target.value }))
          }
          aria-invalid={!!errors[key]}
          aria-describedby={`vps-${key}-help`}
        />
        <span
          id={`vps-${key}-help`}
          className={errors[key] ? shared.fieldError : shared.hint}
        >
          {errors[key] || spec.hint}
        </span>
      </div>
    );
  }
  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus({
        value: summary,
        message: "Đã sao chép cấu hình và các giả định tính toán.",
      });
    } catch {
      if (summaryDetails.current) summaryDetails.current.open = true;
      summaryText.current?.focus();
      summaryText.current?.select();
      setStatus({
        value: summary,
        message: "Đã chọn bản tóm tắt. Nhấn Ctrl+C hoặc ⌘C để sao chép.",
      });
    }
  }
  function downloadSummary() {
    const url = URL.createObjectURL(
      new Blob([`${summary}\n`], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "interdata-vps-estimate.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus({ value: summary, message: "Đã tải bản ước tính cấu hình VPS." });
  }
  return (
    <>
      <div className={shared.workspaceHeading}>
        <div>
          <span className={shared.toolEyebrow}>LẬP KẾ HOẠCH TÀI NGUYÊN</span>
          <h2>Tính toán cấu hình VPS</h2>
          <p>Ước tính vCPU, RAM và SSD theo ứng dụng và tải dự kiến.</p>
        </div>
        <div className={shared.headingActions}>
          <button
            type="button"
            className={shared.guideLink}
            aria-controls="vps-guide"
            onClick={() => {
              const guide = document.getElementById("vps-guide");
              guide?.scrollIntoView({ block: "start" });
              guide?.focus({ preventScroll: true });
            }}
          >
            <BookOpen size={16} aria-hidden="true" /> Hướng dẫn
          </button>
          <button
            type="button"
            className={shared.reset}
            onClick={() => {
              setForm(toForm(defaultVpsSizingInput));
              setStatus({ value: "", message: "" });
            }}
          >
            <RotateCcw size={15} aria-hidden="true" /> Đặt lại
          </button>
        </div>
      </div>
      <div className={shared.workspaceGrid}>
        <div className={shared.formPanel}>
          <div className={shared.stepHeading}>
            <span>01</span>
            <h3>Ứng dụng và lượng sử dụng</h3>
          </div>
          <div className={shared.field}>
            <label htmlFor="vps-app">Loại ứng dụng</label>
            <select
              id="vps-app"
              className={styles.select}
              value={form.app}
              onChange={(event) =>
                changeProfile(event.target.value as VpsProfileId)
              }
              aria-describedby="vps-app-help"
            >
              {vpsSizingProfiles.map((profile) => (
                <option value={profile.id} key={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
            <span id="vps-app-help" className={shared.hint}>
              Đổi ứng dụng sẽ nạp lại các giả định mẫu bên dưới. Các giả định
              này chưa phải số liệu đo thực tế.
            </span>
          </div>
          <div className={styles.fieldGrid}>
            {field("users")}
            {field("requestsPerMinute")}
          </div>
          <label className={styles.databaseToggle}>
            <input
              type="checkbox"
              checked={form.localDatabase}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  localDatabase: event.target.checked,
                }))
              }
            />
            <span>
              <strong>Cơ sở dữ liệu chạy cùng VPS</strong>
              <small>
                Bật để cộng RAM dành cho MySQL, PostgreSQL hoặc CSDL tương tự.
              </small>
            </span>
          </label>
          <div className={shared.formDivider} />
          <div className={shared.stepHeading}>
            <span>02</span>
            <h3>Dung lượng và dự phòng</h3>
          </div>
          <div className={styles.fieldGrid}>
            {field("dataGb")}
            {field("growthGb")}
            {field("months")}
            {field("headroom")}
          </div>
          <details className={styles.assumptions}>
            <summary>Giả định tính toán · có thể điều chỉnh</summary>
            <p>
              Thay bằng số liệu đo trên ứng dụng của bạn để kết quả sát hơn.
              Thời gian CPU cần bao gồm cả phần CSDL nếu chạy trên cùng VPS.
            </p>
            <div className={styles.fieldGrid}>
              {field("cpuMs")}
              {field("responseMs")}
              {field("requestMemoryMb")}
              {field("appRamGb")}
              {form.localDatabase && field("databaseRamGb")}
            </div>
          </details>
          <div className={shared.note}>
            <Info size={17} aria-hidden="true" />
            <p>
              Mô hình dành cho ứng dụng web/API trên Linux. Các mặc định là giả
              định lập kế hoạch, không phải benchmark hay cam kết số người dùng
              VPS có thể phục vụ.
            </p>
          </div>
        </div>
        <div className={shared.output}>
          <div className={shared.outputHeading}>
            <span>
              <Calculator size={17} aria-hidden="true" />{" "}
              {result?.largeWorkload
                ? "Nhu cầu tài nguyên tổng"
                : "Cấu hình tham khảo"}
            </span>
            <span className={styles.estimateBadge}>Ước tính</span>
          </div>
          {result ? (
            <>
              <div className={styles.metrics}>
                {[
                  {
                    label: "vCPU",
                    value: result.vCpu,
                    unit: "vCPU",
                    icon: Cpu,
                  },
                  {
                    label: "RAM",
                    value: result.ramGb,
                    unit: "GB",
                    icon: MemoryStick,
                  },
                  {
                    label: "SSD",
                    value: result.diskGb,
                    unit: "GB",
                    icon: HardDrive,
                  },
                ].map((metric) => (
                  <div className={styles.metric} key={metric.label}>
                    <metric.icon size={21} aria-hidden="true" />
                    <span>{metric.label}</span>
                    <strong data-vps-resource={metric.label}>
                      {number(metric.value, 0)} <small>{metric.unit}</small>
                    </strong>
                  </div>
                ))}
              </div>
              <div className={styles.loadSummary}>
                <span>Tải máy chủ dự kiến</span>
                <strong>{number(result.requestsPerSecond)} yêu cầu/giây</strong>
                <p>
                  Khoảng {number(result.activeRequests)} yêu cầu đang xử lý tại
                  một thời điểm. Người dùng đồng thời không đồng nghĩa với số
                  yêu cầu đang xử lý.
                </p>
              </div>
              <p className={styles.reserveNote}>
                Đã cộng {number(input.headroom)}% dự phòng và dung lượng tăng
                trưởng trong {input.months} tháng.
              </p>
              {result.largeWorkload && (
                <p className={styles.largeWorkload} role="status">
                  Nhu cầu này vượt phạm vi cấu hình nhỏ và vừa của mô hình. Các
                  con số là tài nguyên tổng; cần đánh giá tách CSDL, nhiều máy
                  chủ hoặc kiến trúc riêng thay vì mặc định dùng một VPS.
                </p>
              )}
              <div className={styles.breakdown}>
                <h3>Vì sao có cấu hình này?</h3>
                <dl>
                  <div>
                    <dt>CPU tính trước làm tròn</dt>
                    <dd>{number(result.raw.cpu)} vCPU</dd>
                  </div>
                  <div>
                    <dt>RAM tính trước làm tròn</dt>
                    <dd>{number(result.raw.ramGb)} GB</dd>
                  </div>
                  <div>
                    <dt>Dữ liệu sau {input.months} tháng</dt>
                    <dd>{number(result.futureDataGb)} GB</dd>
                  </div>
                  <div>
                    <dt>SSD tính trước làm tròn</dt>
                    <dd>{number(result.raw.diskGb)} GB</dd>
                  </div>
                </dl>
                <p>
                  CPU tối thiểu 1 vCPU, sau đó làm tròn lên bội 2; RAM tối thiểu
                  2 GB, làm tròn lên bội 2; SSD tối thiểu 20 GB, làm tròn lên
                  bội 10. Đây không phải danh sách gói bán.
                </p>
              </div>
            </>
          ) : (
            <div className={styles.invalidResult} role="status">
              <Info size={24} aria-hidden="true" />
              <h3>Kiểm tra lại thông tin đầu vào</h3>
              <p>
                Điền các trường hợp lệ để xem cấu hình. Trường chưa hợp lệ được
                ghi chú ngay dưới ô nhập, kể cả trong phần giả định tính toán.
              </p>
            </div>
          )}
          <div className={shared.outputActions}>
            <button
              type="button"
              className={shared.primaryButton}
              onClick={copySummary}
              disabled={!summary}
            >
              <Copy size={16} aria-hidden="true" /> Sao chép kết quả
            </button>
            <button
              type="button"
              className={shared.secondaryButton}
              onClick={downloadSummary}
              disabled={!summary}
            >
              <ArrowDownToLine size={16} aria-hidden="true" /> Tải xuống
            </button>
          </div>
          <p className={shared.actionStatus} role="status">
            {status.value === summary ? status.message : ""}
          </p>
          {result && (
            <details className={styles.summaryDetails} ref={summaryDetails}>
              <summary>Xem bản tóm tắt cấu hình</summary>
              <textarea
                ref={summaryText}
                aria-label="Bản tóm tắt cấu hình VPS"
                readOnly
                value={summary}
                rows={10}
              />
            </details>
          )}
          <div className={shared.note}>
            <Info size={17} aria-hidden="true" />
            <p>
              Chưa tính băng thông, IOPS, bản sao lưu cục bộ, tác vụ nền nặng và
              yêu cầu dự phòng nhiều máy chủ. Kiểm thử tải, theo dõi CPU/RAM rồi
              điều chỉnh trước khi chốt cấu hình.
            </p>
          </div>
          <Link
            href={result?.largeWorkload ? "/lien-he/" : "/thue-vps/"}
            className={styles.resultLink}
          >
            {result?.largeWorkload
              ? "Trao đổi phương án hạ tầng"
              : "Xem các dòng VPS InterData"}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className={shared.reference}>
        <h3>Công thức và giả định đang sử dụng</h3>
        <div className={styles.formulas}>
          <p>
            <strong>Tải:</strong> người dùng × yêu cầu/người/phút ÷ 60. Số yêu
            cầu đang xử lý = tải × thời gian xử lý (giây).
          </p>
          <p>
            <strong>CPU:</strong> ({number(vpsSizingAssumptions.baseCpu)} vCPU
            nền + tải × thời gian CPU tính bằng giây) × hệ số dự phòng ÷ 0,7.
          </p>
          <p>
            <strong>RAM:</strong> (0,75 GB hệ điều hành + RAM nền ứng dụng + RAM
            CSDL nếu dùng chung + số yêu cầu đang xử lý × RAM/yêu cầu ÷ 1024) ×
            hệ số dự phòng.
          </p>
          <p>
            <strong>SSD:</strong> (12 GB hệ điều hành + dữ liệu hiện tại + tăng
            trưởng/tháng × số tháng) × hệ số dự phòng. Hệ số dự phòng = 1 + phần
            trăm dự phòng ÷ 100.
          </p>
        </div>
        <p className={shared.referenceNote}>
          Mục tiêu CPU 70% và các hệ số mặc định là lựa chọn của mô hình này,
          không phải tiêu chuẩn chung cho mọi ứng dụng.{" "}
          <a
            href="https://sre.google/sre-book/service-best-practices/"
            target="_blank"
            rel="noreferrer"
          >
            Tham khảo phương pháp kiểm thử tải và lập kế hoạch tài nguyên ↗
          </a>
        </p>
      </div>
      <VpsUsageGuide />
    </>
  );
}
