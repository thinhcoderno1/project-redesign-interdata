"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { links, solutions } from "@/data/content";
import { Icon } from "./icon";

export function Navigation() {
  const header = useRef<HTMLElement>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const solutionTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const root = document.documentElement;
    const previous = root.style.getPropertyValue("--site-header-height");
    const update = () => {
      root.style.setProperty(
        "--site-header-height",
        `${Math.ceil(element.getBoundingClientRect().height)}px`,
      );
    };
    const observer = new ResizeObserver(update);
    update();
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (previous) root.style.setProperty("--site-header-height", previous);
      else root.style.removeProperty("--site-header-height");
    };
  }, []);
  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!menu.current?.contains(e.target as Node)) setSolutionsOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && solutionsOpen) {
        setSolutionsOpen(false);
        solutionTrigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [solutionsOpen]);
  const openDrawer = () => {
    dialog.current?.showModal();
    setMobileOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeDrawer = () => {
    dialog.current?.close();
  };
  const restoreFocus = () => {
    setMobileOpen(false);
    document.body.style.overflow = "";
    trigger.current?.focus({ preventScroll: true });
  };
  const mainLinks = [
    { name: "Thuê VPS", href: links.vps },
    { name: "Cloud Server", href: links.cloud },
    { name: "Thuê Máy Chủ", href: links.dedicated },
    { name: "Chỗ Đặt Máy Chủ", href: links.colocation },
  ];
  return (
    <header className="site-header" ref={header}>
      <a className="skip-link" href="#noi-dung">
        Bỏ qua điều hướng
      </a>
      <div className="utility">
        <div className="container utility-inner">
          <span>Hạ tầng máy chủ cho doanh nghiệp Việt</span>
          <div>
            <a href={links.ticket}>
              <Icon name="ticket" />
              Gửi ticket
            </a>
            <a href={links.register}>Đăng ký</a>
            <a href={links.login}>
              Đăng nhập <Icon name="external" />
            </a>
          </div>
        </div>
      </div>
      <div className="container nav-row">
        <Link href="/" className="logo" aria-label="InterData — Trang chủ">
          <Image
            src="/images/logo.webp"
            width={500}
            height={174}
            alt="InterData"
            priority
            sizes="180px"
          />
        </Link>
        <nav className="desktop-nav" aria-label="Điều hướng chính">
          <Link
            href="/"
            aria-label="Trang chủ"
            className="home-link"
            aria-current="page"
          >
            <Icon name="home" />
          </Link>
          {mainLinks.slice(0, 2).map((l) => (
            <a href={l.href} key={l.name}>
              {l.name}
            </a>
          ))}
          <div
            className="solution-menu"
            ref={menu}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setSolutionsOpen(false);
            }}
          >
            <button
              ref={solutionTrigger}
              aria-expanded={solutionsOpen}
              aria-controls="solution-navigation"
              onClick={() => setSolutionsOpen(!solutionsOpen)}
            >
              Giải Pháp <Icon name="down" />
            </button>
            <div
              id="solution-navigation"
              className="dropdown"
              hidden={!solutionsOpen}
            >
              <p>Triển khai theo bài toán</p>
              {solutions.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={() => setSolutionsOpen(false)}
                >
                  <Icon name={s.icon} />
                  <span>{s.name}</span>
                  <Icon name="arrow" />
                </a>
              ))}
            </div>
          </div>
          {mainLinks.slice(2).map((l) => (
            <a href={l.href} key={l.name}>
              {l.name}
            </a>
          ))}
        </nav>
        <button
          ref={trigger}
          className="mobile-trigger"
          aria-label="Mở điều hướng"
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          aria-expanded={mobileOpen}
          onClick={openDrawer}
        >
          <Icon name="menu" />
        </button>
      </div>
      <dialog
        id="mobile-navigation"
        ref={dialog}
        className="drawer"
        aria-labelledby="drawer-title"
        onClose={restoreFocus}
        onKeyDown={(e) => {
          if (e.key !== "Tab") return;
          const targets = [
            ...e.currentTarget.querySelectorAll<HTMLElement>(
              "a[href],button,summary",
            ),
          ].filter((el) => el.getBoundingClientRect().height > 0);
          const first = targets[0],
            last = targets[targets.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeDrawer();
        }}
      >
        <div className="drawer-content">
          <div className="drawer-head">
            <span id="drawer-title">Điều hướng InterData</span>
            <button
              aria-label="Đóng điều hướng"
              onClick={closeDrawer}
              autoFocus
            >
              <Icon name="close" />
            </button>
          </div>
          <nav aria-label="Điều hướng trên điện thoại">
            <Link href="/">Trang chủ</Link>
            {mainLinks.slice(0, 2).map((l) => (
              <a key={l.name} href={l.href}>
                {l.name}
              </a>
            ))}
            <details>
              <summary>
                Giải Pháp <Icon name="down" />
              </summary>
              {solutions.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={closeDrawer}>
                  {s.name}
                </a>
              ))}
            </details>
            {mainLinks.slice(2).map((l) => (
              <a key={l.name} href={l.href}>
                {l.name}
              </a>
            ))}
          </nav>
          <a className="button primary" href={links.contact}>
            Liên hệ tư vấn <Icon name="arrow" />
          </a>
          <p>
            Đã có dịch vụ? <a href={links.ticket}>Gửi ticket hỗ trợ</a>
          </p>
        </div>
      </dialog>
    </header>
  );
}
