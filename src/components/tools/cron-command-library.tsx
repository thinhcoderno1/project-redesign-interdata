"use client";

import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Copy,
  FileCode2,
  Info,
  Plus,
} from "lucide-react";
import {
  cronCommandCategories,
  cronCommandTemplates,
  type CronCommandTemplate,
} from "@/data/cron-command-templates";
import styles from "./tools.module.css";

function CommandCard({
  template,
  selected,
  onUse,
}: {
  template: CronCommandTemplate;
  selected: boolean;
  onUse: (command: string) => void;
}) {
  const code = useRef<HTMLElement>(null);
  const [status, setStatus] = useState("");
  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(template.command);
      setStatus("Đã sao chép lệnh, chưa kèm biểu thức cron.");
    } catch {
      const selection = window.getSelection();
      if (selection && code.current) {
        const range = document.createRange();
        range.selectNodeContents(code.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setStatus("Đã chọn lệnh. Nhấn Ctrl+C hoặc ⌘C để sao chép.");
      } else
        setStatus(
          "Không thể sao chép tự động. Hãy chọn và sao chép lệnh mẫu bên trên.",
        );
    }
  }
  return (
    <li className={styles.commandCard} data-selected={selected || undefined}>
      <div className={styles.commandCardHeading}>
        <h4>{template.title}</h4>
        {selected && (
          <span>
            <Check size={13} aria-hidden="true" /> Đang dùng
          </span>
        )}
      </div>
      <p className={styles.commandDescription}>{template.description}</p>
      <div className={styles.commandCode}>
        <code ref={code}>{template.command}</code>
      </div>
      <p className={styles.commandSchedule}>
        Lịch gợi ý: <strong>{template.schedule.label}</strong>{" "}
        <code>{template.schedule.expression}</code>
      </p>
      {template.category === "backup" && (
        <p className={styles.commandCaution}>
          <Info size={15} aria-hidden="true" /> Ghi tệp sao lưu. Chuẩn bị thư
          mục, quyền ghi và đủ dung lượng trước khi dùng.
        </p>
      )}
      <details className={styles.commandInstructions}>
        <summary>
          Hướng dẫn và phần cần thay{" "}
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <dl>
          {template.replacements.map((replacement) => (
            <div key={replacement.value}>
              <dt>
                <code>{replacement.value}</code>
              </dt>
              <dd>{replacement.description}</dd>
            </div>
          ))}
        </dl>
        <p>{template.instructions}</p>
        {template.note && (
          <p className={styles.commandDetailNote}>{template.note}</p>
        )}
        <a href={template.source} target="_blank" rel="noreferrer">
          Tài liệu chính thức <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </details>
      <div className={styles.commandActions}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => onUse(template.command)}
        >
          <Plus size={15} aria-hidden="true" /> Dùng lệnh này
        </button>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={copyCommand}
        >
          <Copy size={15} aria-hidden="true" /> Sao chép lệnh
        </button>
      </div>
      <p className={styles.commandStatus} role="status">
        {status}
      </p>
    </li>
  );
}

export function CronCommandLibrary({
  command,
  onUse,
}: {
  command: string;
  onUse: (command: string) => void;
}) {
  const [category, setCategory] =
    useState<(typeof cronCommandCategories)[number]["id"]>("all");
  const templates = cronCommandTemplates.filter(
    (template) => category === "all" || template.category === category,
  );
  return (
    <section
      id="cron-command-library"
      className={styles.commandLibrary}
      aria-labelledby="cron-command-library-title"
      tabIndex={-1}
    >
      <div className={styles.guideHeading}>
        <span className={styles.guideIcon}>
          <FileCode2 size={21} aria-hidden="true" />
        </span>
        <div>
          <h3 id="cron-command-library-title">Lệnh thực thi phổ biến</h3>
          <p>
            Chọn tác vụ bạn cần, xem hướng dẫn rồi thay đường dẫn cho phù hợp
            với máy chủ.
          </p>
        </div>
      </div>
      <div className={styles.commandIntro}>
        <Info size={17} aria-hidden="true" />
        <p>
          <strong>Đây là lệnh mẫu, chưa bao gồm lịch cron.</strong> “Dùng lệnh
          này” điền vào ô Lệnh cần chạy và giữ lịch hiện tại. “Sao chép lệnh”
          chỉ sao chép phần lệnh. Công cụ không thực thi lệnh trên thiết bị hay
          máy chủ của bạn.
        </p>
      </div>
      <div
        className={styles.commandFilters}
        role="group"
        aria-label="Lọc lệnh theo nhóm"
      >
        {cronCommandCategories.map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
            <span aria-hidden="true">
              {item.id === "all"
                ? cronCommandTemplates.length
                : cronCommandTemplates.filter(
                    (template) => template.category === item.id,
                  ).length}
            </span>
          </button>
        ))}
      </div>
      <ul className={styles.commandGrid}>
        {templates.map((template) => (
          <CommandCard
            key={template.id}
            template={template}
            selected={command === template.command}
            onUse={onUse}
          />
        ))}
      </ul>
      <p className={styles.commandFooter}>
        Các đường dẫn chương trình có thể khác trên máy chủ của bạn. Xem “Hướng
        dẫn và phần cần thay”, chỉnh lệnh rồi kiểm tra thủ công trước khi thêm
        vào crontab.
      </p>
    </section>
  );
}
