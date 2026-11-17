export const cronFields = [
  { label: "Phút", min: 0, max: 59, hint: "0–59" },
  { label: "Giờ", min: 0, max: 23, hint: "0–23" },
  { label: "Ngày trong tháng", min: 1, max: 31, hint: "1–31" },
  { label: "Tháng", min: 1, max: 12, hint: "1–12" },
  { label: "Ngày trong tuần", min: 0, max: 7, hint: "0–7 · CN = 0 hoặc 7" },
] as const;

export const cronPresets = [
  { label: "Mỗi phút", expression: "* * * * *", description: "Chạy mỗi phút." },
  {
    label: "Mỗi 5 phút",
    expression: "*/5 * * * *",
    description: "Chạy mỗi 5 phút, bắt đầu từ phút 0.",
  },
  {
    label: "Mỗi giờ",
    expression: "0 * * * *",
    description: "Chạy vào phút 0 của mỗi giờ.",
  },
  {
    label: "Mỗi ngày",
    expression: "0 0 * * *",
    description: "Chạy lúc 00:00 mỗi ngày.",
  },
  {
    label: "Mỗi tuần",
    expression: "0 0 * * 0",
    description: "Chạy lúc 00:00 mỗi Chủ nhật.",
  },
  {
    label: "Mỗi tháng",
    expression: "0 0 1 * *",
    description: "Chạy lúc 00:00 ngày 1 mỗi tháng.",
  },
  {
    label: "Giờ hành chính",
    expression: "0 9 * * 1-5",
    description: "Chạy lúc 09:00 từ thứ Hai đến thứ Sáu.",
  },
] as const;

export function parseCron(expression: string) {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5)
    throw new Error("Biểu thức cron cần đúng 5 trường, không bao gồm giây.");
  const values = parts.map((part, index) => {
    const { label, min, max } = cronFields[index];
    const result = new Set<number>();
    if (part.length > 120) throw new Error(`${label}: trường quá dài.`);
    for (const item of part.split(",")) {
      const match = /^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/.exec(item);
      if (!match)
        throw new Error(
          `${label}: dùng số, *, dấu phẩy, khoảng (1-5) hoặc bước (*/5).`,
        );
      const step = match[2] ? Number(match[2]) : 1;
      const range = match[1].split("-").map(Number);
      const start = match[1] === "*" ? min : range[0];
      const end =
        match[1] === "*" ? max : (range[1] ?? (match[2] ? max : start));
      if (
        start < min ||
        end > max ||
        start > end ||
        step < 1 ||
        step > max - min + 1
      )
        throw new Error(
          `${label}: giá trị trong khoảng ${min}–${max}, bước phải từ 1 đến ${max - min + 1}.`,
        );
      for (let value = start; value <= end; value += step)
        result.add(index === 4 && value === 7 ? 0 : value);
    }
    return [...result].sort((a, b) => a - b);
  });
  return { parts, values };
}

/** Fixed-offset zones only: UTC and Asia/Ho_Chi_Minh have no DST. */
export function nextCronRuns(
  expression: string,
  after: Date,
  offsetMinutes = 420,
  count = 5,
) {
  const { parts, values } = parseCron(expression);
  const [minutes, hours, days, months, weekdays] = values;
  const offset = offsetMinutes * 60_000;
  const local = new Date(after.getTime() + offset);
  const firstDay = Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
  );
  const results: Date[] = [];
  for (
    let dayIndex = 0;
    dayIndex < 366 * 32 && results.length < count;
    dayIndex++
  ) {
    const day = new Date(firstDay + dayIndex * 86_400_000);
    if (!months.includes(day.getUTCMonth() + 1)) continue;
    const dom = days.includes(day.getUTCDate());
    const dow = weekdays.includes(day.getUTCDay());
    // Cron uses OR when both day fields are restricted. A leading * also
    // makes stepped wildcard fields follow cron's wildcard-day behavior.
    const matches =
      parts[2].startsWith("*") || parts[4].startsWith("*")
        ? dom && dow
        : dom || dow;
    if (!matches) continue;
    for (const hour of hours) {
      for (const minute of minutes) {
        const time = day.getTime() + (hour * 60 + minute) * 60_000 - offset;
        if (time > after.getTime()) results.push(new Date(time));
        if (results.length === count) return results;
      }
    }
  }
  return results;
}

export function cronCommandError(command: string) {
  if (/[\r\n\0]/.test(command)) return "Lệnh cron phải nằm trên một dòng.";
  if (/(^|[^\\])(?:\\\\)*%/.test(command))
    return "Đặt dấu \\ trước ký tự % trong lệnh cron (ví dụ: date +\\%F).";
  return "";
}

export type NginxOptions = {
  mode: "proxy" | "static";
  domain: string;
  www: boolean;
  upstream: string;
  port: string;
  root: string;
  spa: boolean;
  ssl: boolean;
  certificate: string;
  certificateKey: string;
  gzip: boolean;
  websocket: boolean;
};

export const defaultNginxOptions: NginxOptions = {
  mode: "proxy",
  domain: "example.com",
  www: false,
  upstream: "127.0.0.1",
  port: "3000",
  root: "/var/www/example.com/public",
  spa: false,
  ssl: false,
  certificate: "/etc/letsencrypt/live/example.com/fullchain.pem",
  certificateKey: "/etc/letsencrypt/live/example.com/privkey.pem",
  gzip: true,
  websocket: false,
};

function validHost(host: string) {
  if (/^\d+(\.\d+){3}$/.test(host))
    return host.split(".").every((part) => Number(part) <= 255);
  return (
    host.length <= 253 &&
    host
      .split(".")
      .every((label) => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label))
  );
}

export function nginxErrors(
  options: NginxOptions,
): Partial<Record<keyof NginxOptions, string>> {
  const errors: Partial<Record<keyof NginxOptions, string>> = {};
  if (
    !validHost(options.domain) ||
    (!options.domain.includes(".") && options.domain !== "localhost")
  )
    errors.domain =
      "Nhập tên miền, ví dụ example.com; không kèm giao thức hoặc đường dẫn.";
  if (
    options.www &&
    (options.domain === "localhost" ||
      /^[\d.]+$/.test(options.domain) ||
      options.domain.startsWith("www."))
  )
    errors.domain = "Tùy chọn www cần tên miền gốc, ví dụ example.com.";
  if (options.mode === "proxy") {
    if (!validHost(options.upstream))
      errors.upstream =
        "Nhập IPv4 hoặc hostname, ví dụ 127.0.0.1 hoặc localhost.";
    if (
      !/^\d+$/.test(options.port) ||
      Number(options.port) < 1 ||
      Number(options.port) > 65535
    )
      errors.port = "Cổng phải là số nguyên từ 1 đến 65535.";
  }
  const paths: (keyof NginxOptions)[] =
    options.mode === "static" ? ["root"] : [];
  if (options.ssl) paths.push("certificate", "certificateKey");
  for (const field of paths) {
    const value = String(options[field]);
    if (!/^\/[a-z\d_./-]+$/i.test(value) || value.split("/").includes(".."))
      errors[field] =
        "Dùng đường dẫn tuyệt đối, không có khoảng trắng, ký tự đặc biệt hoặc ..";
  }
  return errors;
}

export function generateNginx(options: NginxOptions) {
  if (Object.keys(nginxErrors(options)).length) return "";
  const o = options;
  const names = `${o.domain}${o.www ? ` www.${o.domain}` : ""}`;
  const lines = [
    "# Generated by InterData Tools",
    "# Place in an included file inside the http {} context.",
    "# Test with: sudo nginx -t",
    "",
  ];
  if (o.mode === "proxy" && o.websocket)
    lines.push(
      "map $http_upgrade $interdata_connection_upgrade {",
      "    default upgrade;",
      "    ''      close;",
      "}",
      "",
    );
  if (o.ssl)
    lines.push(
      "server {",
      "    listen 80;",
      `    server_name ${names};`,
      `    return 301 https://${o.domain}$request_uri;`,
      "}",
      "",
    );
  lines.push(
    "server {",
    `    listen ${o.ssl ? "443 ssl" : "80"};`,
    `    server_name ${names};`,
    "",
    "    server_tokens off;",
    "    client_max_body_size 20m;",
  );
  if (o.ssl)
    lines.push(
      "",
      `    ssl_certificate ${o.certificate};`,
      `    ssl_certificate_key ${o.certificateKey};`,
      "    ssl_protocols TLSv1.2 TLSv1.3;",
      "    ssl_session_cache shared:InterDataSSL:10m;",
      "    ssl_session_timeout 1d;",
    );
  if (o.gzip)
    lines.push(
      "",
      "    gzip on;",
      "    gzip_vary on;",
      "    gzip_min_length 1024;",
      "    gzip_types text/plain text/css application/json application/javascript application/xml image/svg+xml;",
    );
  if (o.mode === "static")
    lines.push(
      "",
      `    root ${o.root};`,
      "    index index.html;",
      "",
      "    location / {",
      `        try_files $uri $uri/ ${o.spa ? "/index.html" : "=404"};`,
      "    }",
    );
  else {
    lines.push(
      "",
      "    location / {",
      `        proxy_pass http://${o.upstream}:${Number(o.port)};`,
      "        proxy_http_version 1.1;",
      "        proxy_set_header Host $host;",
      "        proxy_set_header X-Real-IP $remote_addr;",
      "        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;",
      "        proxy_set_header X-Forwarded-Proto $scheme;",
    );
    if (o.websocket)
      lines.push(
        "        proxy_set_header Upgrade $http_upgrade;",
        "        proxy_set_header Connection $interdata_connection_upgrade;",
      );
    else lines.push('        proxy_set_header Connection "";');
    lines.push("    }");
  }
  lines.push(
    "",
    "    location ~ /\\. {",
    "        deny all;",
    "    }",
    "}",
    "",
  );
  return lines.join("\n");
}
