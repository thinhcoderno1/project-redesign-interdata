"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  Calculator,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Globe,
  Info,
  LockKeyhole,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import {
  cronCommandError,
  cronFields,
  cronPresets,
  defaultNginxOptions,
  generateNginx,
  nextCronRuns,
  nginxErrors,
  parseCron,
  type NginxOptions,
} from "@/lib/tool-generators";
import styles from "./tools.module.css";
import { CronUsageGuide, NginxUsageGuide } from "./tool-usage-guides";
import { CronCommandLibrary } from "./cron-command-library";
import { cronCommandTemplates } from "@/data/cron-command-templates";
import { VpsCalculator } from "./vps-calculator";

function openGuide(id: string) {
  const guide = document.getElementById(id);
  guide?.scrollIntoView({ block: "start" });
  guide?.focus({ preventScroll: true });
}

function Output({
  title,
  filename,
  value,
  children,
  compact = false,
}: {
  title: string;
  filename: string;
  value: string;
  children?: ReactNode;
  compact?: boolean;
}) {
  const [status, setStatus] = useState({ value: "", message: "" });
  const code = useRef<HTMLElement>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus({ value, message: "Đã sao chép!" });
    } catch {
      const selection = window.getSelection();
      if (selection && code.current) {
        const range = document.createRange();
        range.selectNodeContents(code.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus({
        value,
        message: "Đã chọn kết quả. Nhấn Ctrl+C hoặc ⌘C để sao chép.",
      });
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([`${value}\n`], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus({ value, message: "Đã tải xuống." });
  }
  return (
    <div className={styles.output}>
      <div className={styles.outputHeading}>
        <span>
          <Terminal size={16} aria-hidden="true" /> {title}
        </span>
        <span className={styles.live}>
          <span /> Trực tiếp
        </span>
      </div>
      <div
        className={`${styles.codeWindow} ${compact ? styles.compactCode : ""}`}
      >
        <div className={styles.fileBar}>
          <span className={styles.windowDots}>
            <i />
            <i />
            <i />
          </span>
          <span>{filename}</span>
        </div>
        <pre tabIndex={0} aria-label={title}>
          <code ref={code}>
            {value || "# Hoàn thiện các trường hợp lệ để xem kết quả."}
          </code>
        </pre>
      </div>
      <div className={styles.outputActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={copy}
          disabled={!value}
        >
          <Copy size={16} aria-hidden="true" /> Sao chép
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={download}
          disabled={!value}
        >
          <ArrowDownToLine size={16} aria-hidden="true" /> Tải xuống
        </button>
      </div>
      <p role="status" className={styles.actionStatus}>
        {status.value === value ? status.message : ""}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  hint,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${id}-help` : undefined}
      />
      {(error || hint) && (
        <span
          id={`${id}-help`}
          className={error ? styles.fieldError : styles.hint}
        >
          {error || hint}
        </span>
      )}
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className={styles.toggleRow}>
      <span>
        <strong>{label}</strong>
        <small>{hint}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.switch} aria-hidden="true" />
    </label>
  );
}

function CronGenerator() {
  const [expression, setExpression] = useState<string>(
    cronPresets[1].expression,
  );
  const [command, setCommand] = useState("");
  const [zone, setZone] = useState("Asia/Ho_Chi_Minh");
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 60_000);
    return () => clearInterval(timer);
  }, []);
  const parsed = useMemo(() => {
    try {
      return { cron: parseCron(expression), error: "" };
    } catch (error) {
      return { cron: null, error: (error as Error).message };
    }
  }, [expression]);
  const runs = useMemo(
    () =>
      parsed.cron && now
        ? nextCronRuns(expression, new Date(now), zone === "UTC" ? 0 : 420)
        : [],
    [parsed, expression, now, zone],
  );
  const commandError = cronCommandError(command);
  const selectedCommandTemplate = cronCommandTemplates.find(
    (template) => template.command === command,
  );
  const normalized = parsed.cron?.parts.join(" ") || "";
  const output =
    parsed.cron && !commandError
      ? `${normalized}${command.trim() ? ` ${command.trim()}` : ""}`
      : "";
  const description = cronPresets.find(
    (preset) => preset.expression === normalized,
  )?.description;
  const parts = expression.trim().split(/\s+/);
  function updateField(index: number, value: string) {
    const next = Array.from(
      { length: 5 },
      (_, position) => parts[position] || "*",
    );
    next[index] = value || "*";
    setExpression(next.join(" "));
  }
  return (
    <>
      <div className={styles.workspaceHeading}>
        <div>
          <span className={styles.toolEyebrow}>LÊN LỊCH TỰ ĐỘNG</span>
          <h2>Cron Job Generator</h2>
          <p>Tạo lịch chạy tác vụ, từ đơn giản đến tùy chỉnh.</p>
        </div>
        <div className={styles.headingActions}>
          <button
            type="button"
            className={styles.guideLink}
            aria-controls="cron-guide"
            onClick={() => openGuide("cron-guide")}
          >
            <BookOpen size={16} aria-hidden="true" /> Hướng dẫn
          </button>
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setExpression("*/5 * * * *");
              setCommand("");
              setZone("Asia/Ho_Chi_Minh");
            }}
          >
            <RotateCcw size={15} aria-hidden="true" /> Đặt lại
          </button>
        </div>
      </div>
      <div className={styles.workspaceGrid}>
        <div className={styles.formPanel}>
          <div className={styles.stepHeading}>
            <span>01</span>
            <h3>Thiết lập lịch chạy</h3>
          </div>
          <p className={styles.smallLabel}>Bắt đầu với lịch có sẵn</p>
          <div className={styles.presets}>
            {cronPresets.map((preset) => (
              <button
                key={preset.expression}
                type="button"
                aria-pressed={normalized === preset.expression}
                onClick={() => setExpression(preset.expression)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className={styles.cronFields}>
            {cronFields.map((field, index) => (
              <Field
                key={field.label}
                id={`cron-field-${index}`}
                label={field.label}
                value={parts.length === 5 ? parts[index] : ""}
                onChange={(value) => updateField(index, value)}
                hint={field.hint}
              />
            ))}
          </div>
          <Field
            id="cron-expression"
            label="Biểu thức cron"
            value={expression}
            onChange={setExpression}
            error={parsed.error}
            hint="5 trường: phút · giờ · ngày · tháng · thứ. Hỗ trợ *, số, dấu phẩy, khoảng và bước."
          />
          <div className={styles.formDivider} />
          <div className={styles.stepHeading}>
            <span>02</span>
            <h3>Thêm lệnh thực thi</h3>
            <span className={styles.optional}>Tùy chọn</span>
          </div>
          <Field
            id="cron-command"
            label="Lệnh cần chạy"
            value={command}
            onChange={setCommand}
            placeholder="/usr/bin/php /var/www/html/artisan schedule:run"
            hint="Dùng đường dẫn tuyệt đối cho chương trình và tệp của bạn."
            error={commandError}
          />
          <button
            type="button"
            className={styles.commandPicker}
            aria-controls="cron-command-library"
            onClick={() => openGuide("cron-command-library")}
          >
            <BookOpen size={15} aria-hidden="true" /> Chọn từ{" "}
            {cronCommandTemplates.length} lệnh mẫu phổ biến
          </button>
          {selectedCommandTemplate && (
            <p className={styles.commandSelectedHint} role="status">
              Đã điền mẫu <strong>{selectedCommandTemplate.title}</strong>. Thay
              đường dẫn theo máy chủ của bạn. Lịch hiện tại được giữ nguyên;
              lịch gợi ý:{" "}
              <code>{selectedCommandTemplate.schedule.expression}</code> (
              {selectedCommandTemplate.schedule.label}).
            </p>
          )}
          <div className={styles.note}>
            <Info size={17} aria-hidden="true" />
            <p>
              {command.trim() ? (
                <>
                  Dán dòng đầy đủ vào <code>crontab -e</code> của người dùng.
                </>
              ) : (
                <>
                  Thêm lệnh thực thi để tạo dòng crontab đầy đủ. Hiện tại, kết
                  quả chỉ là biểu thức lịch.
                </>
              )}{" "}
              Công cụ không thực thi tác vụ.
            </p>
          </div>
        </div>
        <Output
          title="Kết quả cron"
          filename="crontab.txt"
          value={output}
          compact
        >
          <div className={styles.description}>
            <Check size={18} aria-hidden="true" />
            <p>
              {parsed.error
                ? "Kiểm tra lại biểu thức cron."
                : description || "Lịch tùy chỉnh theo 5 trường bạn đã chọn."}
            </p>
          </div>
          <div className={styles.schedule}>
            <div className={styles.scheduleHeading}>
              <h3>
                <Clock3 size={17} aria-hidden="true" /> 5 lần chạy tiếp theo
              </h3>
              <label className={styles.srOnly} htmlFor="cron-zone">
                Múi giờ xem trước
              </label>
              <select
                id="cron-zone"
                value={zone}
                onChange={(event) => setZone(event.target.value)}
              >
                <option value="Asia/Ho_Chi_Minh">Việt Nam (UTC+7)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            <ol>
              {runs.map((date, index) => (
                <li key={date.toISOString()}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={date.toISOString()}>
                    {new Intl.DateTimeFormat("vi-VN", {
                      timeZone: zone,
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23",
                    }).format(date)}
                  </time>
                </li>
              ))}
            </ol>
            {now && parsed.cron && !runs.length && (
              <p role="status" className={styles.fieldError}>
                Không có lần chạy trong 32 năm tới. Kiểm tra ngày/tháng, ví dụ
                tháng 2 không có ngày 30.
              </p>
            )}
            <p className={styles.hint}>
              Múi giờ này chỉ dùng để xem trước. Cron thực tế dùng múi giờ của
              máy chủ.
            </p>
          </div>
        </Output>
      </div>
      <CronCommandLibrary
        command={command}
        onUse={(value) => {
          setCommand(value);
          requestAnimationFrame(() => {
            const input = document.getElementById(
              "cron-command",
            ) as HTMLInputElement | null;
            input?.focus();
            input?.setSelectionRange(0, 0);
          });
        }}
      />
      <div className={styles.reference}>
        <div>
          <h3>Đọc nhanh cú pháp cron</h3>
          <p>5 trường, vô số cách tự động hóa.</p>
        </div>
        <div className={styles.syntax}>
          {[
            ["*", "Mọi giá trị"],
            [",", "Danh sách: 1,3,5"],
            ["-", "Khoảng: 1-5"],
            ["/", "Bước: */10"],
          ].map(([symbol, text]) => (
            <div key={symbol}>
              <code>{symbol}</code>
              <span>{text}</span>
            </div>
          ))}
        </div>
        <p className={styles.referenceNote}>
          Nếu cả ngày trong tháng và thứ đều giới hạn, cron chạy khi một trong
          hai khớp. Công cụ dùng cron Linux 5 trường, với giá trị số.{" "}
          <a
            href="https://man7.org/linux/man-pages/man5/crontab.5.html"
            target="_blank"
            rel="noreferrer"
          >
            Tài liệu crontab ↗
          </a>
        </p>
      </div>
      <CronUsageGuide />
    </>
  );
}

function NginxGenerator() {
  const [options, setOptions] = useState<NginxOptions>({
    ...defaultNginxOptions,
  });
  const errors = nginxErrors(options);
  const output = generateNginx(options);
  function update<K extends keyof NginxOptions>(
    key: K,
    value: NginxOptions[K],
  ) {
    setOptions((previous) => ({ ...previous, [key]: value }));
  }
  const field = (
    key:
      | "domain"
      | "upstream"
      | "port"
      | "root"
      | "certificate"
      | "certificateKey",
    label: string,
    hint?: string,
  ) => (
    <Field
      id={`nginx-${key}`}
      label={label}
      value={options[key]}
      onChange={(value) => update(key, value)}
      error={errors[key]}
      hint={hint}
    />
  );
  return (
    <>
      <div className={styles.workspaceHeading}>
        <div>
          <span className={styles.toolEyebrow}>CẤU HÌNH WEB SERVER</span>
          <h2>Nginx Config Generator</h2>
          <p>Tạo cấu hình khởi đầu cho website và ứng dụng của bạn.</p>
        </div>
        <div className={styles.headingActions}>
          <button
            type="button"
            className={styles.guideLink}
            aria-controls="nginx-guide"
            onClick={() => openGuide("nginx-guide")}
          >
            <BookOpen size={16} aria-hidden="true" /> Hướng dẫn
          </button>
          <button
            type="button"
            className={styles.reset}
            onClick={() => setOptions({ ...defaultNginxOptions })}
          >
            <RotateCcw size={15} aria-hidden="true" /> Đặt lại
          </button>
        </div>
      </div>
      <div className={styles.workspaceGrid}>
        <div className={styles.formPanel}>
          <div className={styles.stepHeading}>
            <span>01</span>
            <h3>Chọn kiểu cấu hình</h3>
          </div>
          <div className={styles.modeCards}>
            {(
              [
                {
                  id: "proxy",
                  title: "Reverse Proxy",
                  detail: "Node.js, Next.js, API",
                  icon: Server,
                },
                {
                  id: "static",
                  title: "Website tĩnh",
                  detail: "HTML, CSS, SPA",
                  icon: Globe,
                },
              ] as const
            ).map((mode) => (
              <button
                type="button"
                key={mode.id}
                aria-pressed={options.mode === mode.id}
                onClick={() => update("mode", mode.id)}
              >
                <mode.icon size={20} aria-hidden="true" />
                <strong>{mode.title}</strong>
                <small>{mode.detail}</small>
              </button>
            ))}
          </div>
          {field(
            "domain",
            "Tên miền",
            "Tên miền hoặc IPv4; không nhập https://.",
          )}
          <Toggle
            label="Thêm tên miền www"
            hint="Phục vụ cả tên miền gốc và www."
            checked={options.www}
            onChange={(value) => update("www", value)}
          />
          {options.mode === "proxy" ? (
            <div className={styles.twoFields}>
              {field(
                "upstream",
                "Địa chỉ ứng dụng",
                "IPv4 hoặc hostname nội bộ.",
              )}
              {field("port", "Cổng ứng dụng", "Ví dụ: 3000, 8000, 8080.")}
            </div>
          ) : (
            <>
              {field(
                "root",
                "Thư mục website",
                "Đường dẫn tuyệt đối đến thư mục chứa index.html.",
              )}
              <Toggle
                label="Ứng dụng SPA"
                hint="Chuyển route không tìm thấy về /index.html."
                checked={options.spa}
                onChange={(value) => update("spa", value)}
              />
            </>
          )}
          <div className={styles.formDivider} />
          <div className={styles.stepHeading}>
            <span>02</span>
            <h3>Tùy chọn bổ sung</h3>
          </div>
          <Toggle
            label="Bật HTTPS (SSL/TLS)"
            hint="Dùng chứng chỉ có sẵn, chuyển HTTP sang HTTPS."
            checked={options.ssl}
            onChange={(value) => update("ssl", value)}
          />
          {options.ssl && (
            <div className={styles.sslFields}>
              {field("certificate", "Đường dẫn chứng chỉ SSL")}
              {field("certificateKey", "Đường dẫn khóa riêng SSL")}
              <p className={styles.hint}>
                Nhập đường dẫn tệp trên máy chủ. Công cụ không cấp chứng chỉ;
                chứng chỉ cần bao phủ mọi tên miền đã chọn.
              </p>
            </div>
          )}
          <Toggle
            label="Nén Gzip"
            hint="Nén các tài nguyên văn bản để giảm dung lượng tải."
            checked={options.gzip}
            onChange={(value) => update("gzip", value)}
          />
          {options.mode === "proxy" && (
            <Toggle
              label="Hỗ trợ WebSocket"
              hint="Cho ứng dụng chat, realtime và kết nối nâng cấp."
              checked={options.websocket}
              onChange={(value) => update("websocket", value)}
            />
          )}
        </div>
        <Output
          title="Cấu hình Nginx"
          filename="interdata-site.conf"
          value={output}
        >
          <div className={styles.note}>
            <Info size={17} aria-hidden="true" />
            <p>
              Lưu vào tệp được include trong khối <code>http</code> của Nginx,
              ví dụ <code>/etc/nginx/conf.d/interdata-site.conf</code>.{" "}
              {options.ssl
                ? "Các tệp chứng chỉ phải tồn tại trước khi nạp cấu hình."
                : "Mẫu hiện dùng HTTP. Bật HTTPS khi bạn đã có chứng chỉ."}
            </p>
          </div>
          <div className={styles.deploy}>
            <h3>Kiểm tra trước khi áp dụng</h3>
            <p>Sau khi lưu cấu hình, kiểm tra cú pháp rồi mới tải lại Nginx.</p>
            <code>sudo nginx -t &amp;&amp; sudo systemctl reload nginx</code>
          </div>
        </Output>
      </div>
      <div className={styles.reference}>
        <div>
          <h3>Cấu hình phù hợp với ứng dụng</h3>
          <p>
            Reverse Proxy chuyển tiếp đến ứng dụng HTTP. Website tĩnh phục vụ
            tệp trực tiếp.
          </p>
        </div>
        <p className={styles.referenceNote}>
          Mẫu giới hạn upload 20 MB và chặn truy cập tệp ẩn. Điều chỉnh theo môi
          trường trước khi áp dụng.{" "}
          <a
            href="https://nginx.org/en/docs/http/ngx_http_proxy_module.html"
            target="_blank"
            rel="noreferrer"
          >
            Tài liệu Proxy ↗
          </a>{" "}
          ·{" "}
          <a
            href="https://nginx.org/en/docs/http/configuring_https_servers.html"
            target="_blank"
            rel="noreferrer"
          >
            Tài liệu HTTPS ↗
          </a>
        </p>
      </div>
      <NginxUsageGuide />
    </>
  );
}

export function ToolsWorkspace() {
  const [activeTab, setActiveTab] = useState("cron");
  useEffect(() => {
    const syncTab = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "cron" || hash === "nginx" || hash === "vps")
        setActiveTab(hash);
      else if (!hash) setActiveTab("cron");
    };
    syncTab();
    window.addEventListener("hashchange", syncTab);
    return () => window.removeEventListener("hashchange", syncTab);
  }, []);
  const tabs = [
    { id: "cron", title: "Cron Job Generator", icon: Clock3 },
    { id: "nginx", title: "Nginx Config Generator", icon: Server },
    { id: "vps", title: "Tính toán cấu hình VPS", icon: Calculator },
  ];
  return (
    <main id="noi-dung" className={styles.page}>
      <div className={styles.hero}>
        <div className="container">
          <nav className={styles.breadcrumb} aria-label="Đường dẫn">
            <Link href="/">Trang chủ</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">Công cụ online</span>
          </nav>
          <div className={styles.heroContent}>
            <span className={styles.badge}>
              <Terminal size={14} aria-hidden="true" /> INTERDATA TOOLS
            </span>
            <h1>
              Bớt thao tác.
              <br className={styles.mobileBreak} /> <span>Thêm hiệu quả.</span>
            </h1>
            <p>
              Bộ công cụ nhỏ, giúp bạn làm việc lớn.
              <br />
              Tạo lịch cron, cấu hình Nginx và tính tài nguyên VPS ngay trong
              trình duyệt.
            </p>
            <div className={styles.heroFeatures}>
              <span>
                <Check size={15} aria-hidden="true" /> Miễn phí sử dụng
              </span>
              <span>
                <LockKeyhole size={14} aria-hidden="true" /> Không cần đăng nhập
              </span>
              <span>
                <ShieldCheck size={15} aria-hidden="true" /> Xử lý ngay trên
                thiết bị
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className={`container ${styles.workspaceContainer}`}>
        <div className={styles.tabBar}>
          <div role="tablist" aria-label="Chọn công cụ" className={styles.tabs}>
            {tabs.map((tab, index) => (
              <button
                type="button"
                role="tab"
                key={tab.id}
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => {
                  window.location.hash = tab.id;
                }}
                onKeyDown={(event) => {
                  const direction =
                    event.key === "ArrowRight"
                      ? 1
                      : event.key === "ArrowLeft"
                        ? -1
                        : 0;
                  if (
                    direction ||
                    event.key === "Home" ||
                    event.key === "End"
                  ) {
                    event.preventDefault();
                    const target =
                      tabs[
                        event.key === "Home"
                          ? 0
                          : event.key === "End"
                            ? tabs.length - 1
                            : (index + direction + tabs.length) % tabs.length
                      ];
                    window.location.hash = target.id;
                    document.getElementById(`tab-${target.id}`)?.focus();
                  }
                }}
              >
                <tab.icon size={19} aria-hidden="true" />
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
          <span className={styles.toolCount}>
            {String(tabs.length).padStart(2, "0")} công cụ
          </span>
        </div>
        <div className={styles.workspace}>
          <section
            id="panel-cron"
            role="tabpanel"
            aria-labelledby="tab-cron"
            hidden={activeTab !== "cron"}
            tabIndex={0}
          >
            <CronGenerator />
          </section>
          <section
            id="panel-nginx"
            role="tabpanel"
            aria-labelledby="tab-nginx"
            hidden={activeTab !== "nginx"}
            tabIndex={0}
          >
            <NginxGenerator />
          </section>
          <section
            id="panel-vps"
            role="tabpanel"
            aria-labelledby="tab-vps"
            hidden={activeTab !== "vps"}
            tabIndex={0}
          >
            <VpsCalculator />
          </section>
        </div>
        <div className={styles.bottomNote}>
          <span>
            <ShieldCheck size={17} aria-hidden="true" /> Dữ liệu nhập được xử lý
            trong trình duyệt, không gửi lên máy chủ.
          </span>
          <span>
            Được xây dựng bởi <strong>InterData</strong>
          </span>
        </div>
        <aside className={styles.cta}>
          <div className={styles.ctaIcon}>
            <Sparkles size={25} aria-hidden="true" />
          </div>
          <div>
            <h2>Công cụ đã sẵn sàng. Hạ tầng của bạn thì sao?</h2>
            <p>
              Khám phá VPS InterData để triển khai website và tự động hóa công
              việc.
            </p>
          </div>
          <Link href="/thue-vps/">
            Khám phá VPS <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
