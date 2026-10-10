import { getResourceFeeds } from "@/lib/interdata-blog";
import { ResourceTabs } from "./resource-tabs";
import { Icon } from "@/components/ui/icon";
import { links } from "@/data/content";
import styles from "./resource-tabs.module.css";

export async function KnowledgeResources() {
  const feeds = await getResourceFeeds();
  return (
    <section
      id="tai-nguyen"
      className={`${styles.section} section`}
      aria-labelledby="resources-title"
    >
      <div className="container">
        <div className={styles.heading}>
          <div>
            <span className="eyebrow">CẬP NHẬT TỪ INTERDATA</span>
            <h2 id="resources-title">Kiến thức &amp; Tin tức</h2>
          </div>
          <a href={links.blog} className="text-link">
            Khám phá blog <Icon name="arrow" />
          </a>
        </div>
        <ResourceTabs feeds={feeds} />
      </div>
    </section>
  );
}
