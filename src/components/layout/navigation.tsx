"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { links, solutions } from "@/data/content";
import {
  cloudCatalog,
  vpsCatalog,
  type CatalogService,
} from "@/data/service-catalog";
import { Icon } from "@/components/ui/icon";
import { TopbarMenu } from "./topbar-menu";

const serviceMenus = [
  {
    id: "vps",
    name: "Thuê VPS",
    tag: "Đề xuất",
    href: links.vps,
    items: vpsCatalog,
  },
  {
    id: "cloud",
    name: "Cloud Server",
    tag: "Nổi bật",
    href: links.cloud,
    items: cloudCatalog,
  },
];

function NavigationLabel({ name, tag }: { name: string; tag: string }) {
  return (
    <span className="nav-item-label">
      <span className="nav-item-tag" aria-hidden="true">
        {tag}
      </span>
      {name}
    </span>
  );
}

function ServiceSubmenu({
  id,
  name,
  tag,
  href,
  items,
}: {
  id: string;
  name: string;
  tag: string;
  href: string;
  items: CatalogService[];
}) {
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div
      className="service-menu"
      ref={container}
      data-open={open || undefined}
      onPointerEnter={(event) => {
        if (
          event.pointerType !== "mouse" ||
          !window.matchMedia("(hover: hover) and (pointer: fine)").matches
        )
          return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
          // Keep keyboard focus visible when the pointer leaves the submenu.
          if (!container.current?.contains(document.activeElement))
            setOpen(false);
        }, 150);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <a href={href} className="service-parent">
        <NavigationLabel name={name} tag={tag} />
      </a>
      <button
        type="button"
        ref={toggle}
        aria-label={`Mở submenu ${name}`}
        aria-expanded={open}
        aria-controls={`${id}-service-navigation`}
        onClick={() => setOpen(!open)}
      >
        <Icon name="down" />
      </button>
      <div
        id={`${id}-service-navigation`}
        className="dropdown service-dropdown"
        hidden={!open}
      >
        {items.map((service) => (
          <a
            key={service.id}
            href={service.href}
            onClick={() => setOpen(false)}
          >
            <Icon name={service.icon} />
            <span>{service.name}</span>
            <Icon name="arrow" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const homeSectionHref = (section: string) =>
    `${pathname === "/" ? "" : "/"}#${section}`;
  const header = useRef<HTMLElement>(null);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const solutionTrigger = useRef<HTMLButtonElement>(null);
  const solutionCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (solutionCloseTimer.current) clearTimeout(solutionCloseTimer.current);
    },
    [],
  );
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
          <nav className="utility-links" aria-label="Thông tin InterData">
            <TopbarMenu
              id="about-topbar-navigation"
              label="Về chúng tôi"
              items={[
                { name: "Giới thiệu", href: links.about },
                { name: "Liên hệ", href: links.contact },
              ]}
            />
            <a href={links.careers}>Tuyển Dụng</a>
            <a href={links.contact}>Hợp tác</a>
          </nav>
          <nav className="utility-links" aria-label="Tài khoản và hỗ trợ">
            <TopbarMenu
              id="account-topbar-navigation"
              label="Tài khoản"
              items={[
                { name: "Đăng ký", href: links.register },
                { name: "Đăng nhập", href: links.login },
              ]}
            />
            <a href={links.ticket}>
              <Icon name="ticket" />
              Gửi yêu cầu hỗ trợ
            </a>
          </nav>
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
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <Icon name="home" />
          </Link>
          {serviceMenus.map((service) => (
            <ServiceSubmenu key={service.id} {...service} />
          ))}
          <div
            className="solution-menu"
            ref={menu}
            data-open={solutionsOpen || undefined}
            onPointerEnter={(event) => {
              if (
                event.pointerType !== "mouse" ||
                !window.matchMedia("(hover: hover) and (pointer: fine)").matches
              )
                return;
              if (solutionCloseTimer.current)
                clearTimeout(solutionCloseTimer.current);
              setSolutionsOpen(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              if (solutionCloseTimer.current)
                clearTimeout(solutionCloseTimer.current);
              solutionCloseTimer.current = setTimeout(() => {
                if (!menu.current?.contains(document.activeElement))
                  setSolutionsOpen(false);
              }, 150);
            }}
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
              <NavigationLabel name="Giải Pháp" tag="Mới" />
              <Icon name="down" />
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
                  href={homeSectionHref(s.id)}
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
        <div className="nav-actions">
          <a className="nav-promotion" href={links.promotion}>
            <Icon name="gift" />
            <span>Ưu đãi</span>
          </a>
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
            {serviceMenus.map((service) => (
              <details key={service.id} className="mobile-service-menu">
                <summary>
                  <NavigationLabel name={service.name} tag={service.tag} />
                  <Icon name="down" />
                </summary>
                <a href={service.href} onClick={closeDrawer}>
                  {service.id === "vps" ? "Xem tất cả VPS" : "Xem Cloud Server"}
                </a>
                {service.items.map((item) => (
                  <a key={item.id} href={item.href} onClick={closeDrawer}>
                    {item.name}
                  </a>
                ))}
              </details>
            ))}
            <details>
              <summary>
                <NavigationLabel name="Giải Pháp" tag="Mới" />
                <Icon name="down" />
              </summary>
              {solutions.map((s) => (
                <a
                  key={s.id}
                  href={homeSectionHref(s.id)}
                  onClick={closeDrawer}
                >
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
