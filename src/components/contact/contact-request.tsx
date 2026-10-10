"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { contactDetails, contactServices } from "@/data/contact";
import { links } from "@/data/content";
import styles from "./contact.module.css";

const subscribe = () => () => {};

export function ContactRequest() {
  const enhanced = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [draft, setDraft] = useState<{ body: string; href: string } | null>(
    null,
  );
  const [copyStatus, setCopyStatus] = useState("");

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const field = (key: string) => String(values.get(key) ?? "").trim();
    for (const name of ["name", "message"]) {
      const input = event.currentTarget.elements.namedItem(name) as
        HTMLInputElement | HTMLTextAreaElement;
      if (!field(name)) {
        input.setCustomValidity(
          "Vui lòng nhập nội dung, không chỉ khoảng trắng.",
        );
        input.reportValidity();
        return;
      }
    }
    const service = field("service");
    const body = [
      "Xin chào InterData,",
      "",
      "Tôi muốn trao đổi về nhu cầu sau:",
      `Họ tên: ${field("name")}`,
      `Email: ${field("email")}`,
      `Điện thoại: ${field("phone") || "Chưa cung cấp"}`,
      `Doanh nghiệp: ${field("company") || "Chưa cung cấp"}`,
      `Dịch vụ quan tâm: ${service}`,
      "",
      field("message"),
      "",
      "Cảm ơn InterData.",
    ].join("\n");
    const subject = `Yêu cầu tư vấn ${service} — ${field("name")}`;
    setDraft({
      body,
      href: `mailto:${contactDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    });
    setCopyStatus("");
  }

  async function copyEmail() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopyStatus("Đã sao chép nội dung email.");
    } catch {
      setCopyStatus(
        "Chưa sao chép được. Bạn có thể chọn và sao chép nội dung bên dưới.",
      );
    }
  }

  return (
    <div className={styles.requestCard}>
      <div className={styles.formHeading}>
        <span className={styles.channelIcon}>
          <Mail size={24} aria-hidden="true" />
        </span>
        <div>
          <h3>Soạn yêu cầu tư vấn</h3>
          <p>Gửi đến {contactDetails.email}</p>
        </div>
      </div>
      <p className={styles.formNote}>
        Điền thông tin để soạn email. Bạn sẽ xem lại nội dung và gửi trong ứng
        dụng email của mình.
      </p>
      <noscript>
        <p className={styles.noScript}>
          Để soạn nội dung tự động, hãy bật JavaScript hoặc{" "}
          <a href={`mailto:${contactDetails.email}`}>
            gửi email trực tiếp đến InterData
          </a>
          .
        </p>
      </noscript>
      <form
        onSubmit={prepareEmail}
        onInput={(event) => {
          const input = event.target;
          if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLTextAreaElement
          )
            input.setCustomValidity("");
        }}
        onChange={() => {
          setDraft(null);
          setCopyStatus("");
        }}
        aria-label="Soạn yêu cầu tư vấn InterData"
      >
        <div className={styles.formGrid}>
          <label>
            Họ và tên <span aria-hidden="true">*</span>
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Nguyễn Văn An"
            />
          </label>
          <label>
            Email <span aria-hidden="true">*</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={150}
              placeholder="ban@example.com"
            />
          </label>
          <label>
            Số điện thoại
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              placeholder="Số liên hệ của bạn"
            />
          </label>
          <label>
            Doanh nghiệp
            <input
              name="company"
              autoComplete="organization"
              maxLength={120}
              placeholder="Tên doanh nghiệp (nếu có)"
            />
          </label>
          <label className={styles.fullField}>
            Dịch vụ quan tâm <span aria-hidden="true">*</span>
            <select name="service" required defaultValue="">
              <option value="" disabled>
                Chọn dịch vụ hoặc nhu cầu
              </option>
              {contactServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.fullField}>
            Nội dung trao đổi <span aria-hidden="true">*</span>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={1000}
              placeholder="Bạn cần triển khai gì? Cấu hình, thời điểm hoặc vấn đề cần trao đổi..."
            />
          </label>
        </div>
        <p className={styles.requiredNote}>
          * Thông tin cần điền. Xem{" "}
          <a href={links.privacy}>Chính sách bảo mật</a>.
        </p>
        <button
          type="submit"
          className={styles.composeButton}
          disabled={!enhanced}
        >
          <Mail size={19} aria-hidden="true" /> Soạn email yêu cầu
        </button>
      </form>
      {draft && (
        <div className={styles.emailDraft}>
          <p role="status">
            <Check size={19} aria-hidden="true" /> Nội dung email đã sẵn sàng.
          </p>
          <label>
            Nội dung để xem lại
            <textarea value={draft.body} readOnly rows={7} />
          </label>
          <div className={styles.draftActions}>
            <a href={draft.href} className={styles.composeButton}>
              Mở ứng dụng email <Mail size={18} aria-hidden="true" />
            </a>
            <button type="button" onClick={copyEmail}>
              <Copy size={17} aria-hidden="true" /> Sao chép nội dung
            </button>
          </div>
          <p className={styles.formNote}>
            Yêu cầu chưa được gửi. Hãy bấm gửi trong ứng dụng email; nếu ứng
            dụng không mở, sao chép nội dung và gửi đến{" "}
            <a href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
            </a>
            .
          </p>
          <span className={styles.copyStatus} role="status">
            {copyStatus}
          </span>
        </div>
      )}
    </div>
  );
}
