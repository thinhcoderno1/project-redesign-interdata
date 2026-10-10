"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Gift,
  Newspaper,
} from "lucide-react";
import type { ResourceArticle, ResourceFeed } from "@/data/resource-topics";
import styles from "./resource-tabs.module.css";

const topicIcons = {
  news: Newspaper,
  blog: BookOpen,
  promotion: Gift,
  careers: BriefcaseBusiness,
};

function ArticleCard({
  article,
  topicId,
  count,
}: {
  article: ResourceArticle;
  topicId: string;
  count: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const titleId = `resource-title-${topicId}-${article.id}`;
  return (
    <article className={styles.card} data-post-id={article.id}>
      <a
        href={article.href}
        className={styles.cardLink}
        aria-labelledby={titleId}
      >
        <div className={styles.media} data-topic={topicId} aria-hidden="true">
          {article.image && !imageFailed ? (
            <Image
              src={article.image}
              alt=""
              fill
              sizes={
                count <= 2
                  ? "(max-width: 639px) calc(100vw - 40px), (max-width: 1279px) 45vw, 610px"
                  : "(max-width: 639px) calc(100vw - 40px), (max-width: 1199px) 45vw, 300px"
              }
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className={styles.imageFallback}>
              <BookOpen size={38} strokeWidth={1.3} />
              <span>InterData</span>
            </div>
          )}
        </div>
        <div className={styles.cardBody}>
          <div className={styles.meta}>
            <span>{article.category}</span>
            <time dateTime={article.publishedAt}>{article.dateLabel}</time>
          </div>
          <h4 id={titleId} className={styles.cardTitle}>
            {article.title}
          </h4>
          {article.excerpt && (
            <p className={styles.summary}>{article.excerpt}</p>
          )}
          <span className={styles.readMore}>
            Đọc bài viết <ArrowRight size={18} aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}

export function ResourceTabs({ feeds }: { feeds: ResourceFeed[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <>
      <div
        role="tablist"
        aria-label="Chuyên mục kiến thức và tin tức"
        className={styles.tabs}
      >
        {feeds.map(({ topic }, index) => {
          const TopicIcon = topicIcons[topic.id];
          return (
            <button
              key={topic.id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              role="tab"
              id={`resource-tab-${topic.id}`}
              aria-controls={`resource-panel-${topic.id}`}
              aria-selected={active === index}
              tabIndex={active === index ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                let next = index;
                if (event.key === "ArrowRight")
                  next = (index + 1) % feeds.length;
                else if (event.key === "ArrowLeft")
                  next = (index + feeds.length - 1) % feeds.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = feeds.length - 1;
                else return;
                event.preventDefault();
                setActive(next);
                tabs.current[next]?.focus();
              }}
            >
              <TopicIcon size={20} aria-hidden="true" />
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>
      <div className={styles.panels}>
        {feeds.map(({ topic, articles, status }, index) => (
          <div
            key={topic.id}
            id={`resource-panel-${topic.id}`}
            role="tabpanel"
            aria-labelledby={`resource-tab-${topic.id}`}
            hidden={active !== index}
            tabIndex={0}
            className={styles.panel}
          >
            <div className={styles.panelHeading}>
              <h3>{topic.label}</h3>
              <a href={topic.href} className="text-link">
                {topic.linkLabel} <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
            {articles.length > 0 ? (
              <div className={styles.grid} data-count={articles.length}>
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    topicId={topic.id}
                    count={articles.length}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.empty}>
                <BookOpen size={36} strokeWidth={1.3} aria-hidden="true" />
                <p>
                  {status === "unavailable"
                    ? "Chưa tải được bài viết. Bạn có thể xem trực tiếp tại chuyên mục."
                    : "Chuyên mục chưa có bài viết mới để hiển thị."}
                </p>
                <a href={topic.href} className="text-link">
                  {topic.linkLabel} <ArrowRight size={18} aria-hidden="true" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      <noscript>
        <style>{`.${styles.tabs}{display:none!important}.${styles.panel}[hidden]{display:block!important}.${styles.panel}{margin-top:32px}`}</style>
      </noscript>
    </>
  );
}
