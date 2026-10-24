import type { Metadata } from "next";
import type { BlogPost } from "../data/blog";
import { siteIdentity, socialProfiles } from "../data/site-identity";
import { contactDetails, contactOffices } from "../data/contact";
import { htmlToText } from "./interdata-blog";
import { blogListingHref } from "./blog-links";

export type SchemaNode = {
  "@type": string | string[];
  "@id"?: string;
  [key: string]: unknown;
};
export type SchemaGraph = {
  "@context": "https://schema.org";
  "@graph": SchemaNode[];
};
export type Breadcrumb = { name: string; path: string };
export type FaqItem = { question: string; answer: string };
export type PageProfile = {
  name?: string;
  type?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "SearchResultsPage";
  service?: {
    name: string;
    description: string;
    serviceType?: string;
    parent?: string;
  };
  faqs?: readonly FaqItem[];
};

export const absoluteUrl = (path: string) =>
  new URL(path, `${siteIdentity.origin}/`).href;
export const schemaIds = {
  organization: `${siteIdentity.origin}/#organization`,
  website: `${siteIdentity.origin}/#website`,
  logo: `${siteIdentity.origin}/#logo`,
  blog: `${siteIdentity.origin}/blog/#blog`,
};
const ref = (id: string) => ({ "@id": id });
const graph = (nodes: SchemaNode[]): SchemaGraph => ({
  "@context": "https://schema.org",
  "@graph": nodes,
});

// Escape script terminators, including values originating in the CMS.
export function serializeSchema(data: unknown) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildSiteSchema(): SchemaGraph {
  return graph([
    {
      "@type": "Organization",
      "@id": schemaIds.organization,
      name: siteIdentity.name,
      legalName: siteIdentity.legalName,
      url: absoluteUrl("/"),
      taxID: siteIdentity.taxID,
      logo: ref(schemaIds.logo),
      email: contactDetails.email,
      telephone: contactDetails.hotlineHref.replace("tel:", ""),
      address: { "@type": "PostalAddress", ...siteIdentity.address },
      sameAs: socialProfiles.map((profile) => profile.href),
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: contactDetails.hotlineHref.replace("tel:", ""),
          email: contactDetails.email,
          availableLanguage: "vi",
          url: absoluteUrl("/lien-he/"),
        },
      ],
    },
    {
      "@type": "ImageObject",
      "@id": schemaIds.logo,
      url: absoluteUrl(siteIdentity.logo),
      contentUrl: absoluteUrl(siteIdentity.logo),
      width: siteIdentity.logoWidth,
      height: siteIdentity.logoHeight,
      caption: siteIdentity.name,
    },
    {
      "@type": "WebSite",
      "@id": schemaIds.website,
      url: absoluteUrl("/"),
      name: siteIdentity.name,
      inLanguage: "vi-VN",
      publisher: ref(schemaIds.organization),
    },
  ]);
}

export function breadcrumbSchema(
  path: string,
  items: Breadcrumb[],
): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function metadataTitle(metadata: Metadata) {
  const title = metadata.title;
  if (typeof title === "string") return title;
  if (title && "absolute" in title) return title.absolute;
  if (title && "default" in title) return title.default;
  return siteIdentity.name;
}

function metadataImage(metadata: Metadata): string | undefined {
  const images = metadata.openGraph?.images;
  const image = Array.isArray(images) ? images[0] : images;
  if (!image) return;
  return absoluteUrl(
    String(typeof image === "object" && "url" in image ? image.url : image),
  );
}

export function buildPageSchema({
  path,
  metadata,
  profile = {},
  breadcrumbs,
}: {
  path: string;
  metadata: Metadata;
  profile?: PageProfile;
  breadcrumbs?: Breadcrumb[];
}): SchemaGraph {
  const url = absoluteUrl(path);
  const title = metadataTitle(metadata);
  const image = metadataImage(metadata);
  const trail =
    breadcrumbs ||
    (path === "/"
      ? []
      : [
          { name: "Trang chủ", path: "/" },
          ...(profile.service?.parent
            ? [
                {
                  name:
                    profile.service.parent === "/thue-vps/"
                      ? "Thuê VPS"
                      : "Cloud Server",
                  path: profile.service.parent,
                },
              ]
            : []),
          {
            name:
              profile.name ||
              profile.service?.name ||
              title.replace(/\s*[|—]\s*InterData.*$/i, ""),
            path,
          },
        ]);
  const faqs =
    profile.faqs?.filter(
      (item) => htmlToText(item.question) && htmlToText(item.answer),
    ) || [];
  const page: SchemaNode = {
    "@type": profile.type || "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    ...(metadata.description ? { description: metadata.description } : {}),
    inLanguage: "vi-VN",
    isPartOf: ref(schemaIds.website),
    about: ref(schemaIds.organization),
    ...(trail.length > 1 ? { breadcrumb: ref(`${url}#breadcrumb`) } : {}),
    ...(image ? { primaryImageOfPage: ref(`${url}#primaryimage`) } : {}),
    ...(profile.service
      ? { mainEntity: ref(`${url}#service`), about: ref(`${url}#service`) }
      : {}),
    ...(profile.type === "AboutPage" ||
    profile.type === "ContactPage" ||
    path === "/"
      ? { mainEntity: ref(schemaIds.organization) }
      : {}),
    ...(faqs.length ? { hasPart: ref(`${url}#faq`) } : {}),
  };
  const nodes = [page];
  if (trail.length > 1) nodes.push(breadcrumbSchema(path, trail));
  if (image)
    nodes.push({
      "@type": "ImageObject",
      "@id": `${url}#primaryimage`,
      url: image,
      contentUrl: image,
    });
  if (profile.service)
    nodes.push({
      "@type": "Service",
      "@id": `${url}#service`,
      url,
      name: profile.service.name,
      description: profile.service.description,
      serviceType: profile.service.serviceType || profile.service.name,
      provider: ref(schemaIds.organization),
      mainEntityOfPage: ref(`${url}#webpage`),
    });
  if (faqs.length)
    nodes.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      url,
      inLanguage: "vi-VN",
      isPartOf: ref(`${url}#webpage`),
      mainEntity: faqs.map((item, index) => ({
        "@type": "Question",
        "@id": `${url}#question-${index + 1}`,
        name: htmlToText(item.question),
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  if (profile.type === "ContactPage") {
    const offices = contactOffices.map((office) => ({
      "@type": "Place",
      "@id": `${url}#${office.id}`,
      name: office.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address,
        addressCountry: "VN",
      },
      hasMap: office.mapUrl,
    }));
    page.mentions = offices.map((office) => ref(office["@id"]));
    nodes.push(...offices);
  }
  return graph(nodes);
}

export function buildBlogPostSchema(
  post: BlogPost,
  readingMinutes: number,
): SchemaGraph {
  const url = absoluteUrl(post.href);
  const crumbs: Breadcrumb[] = [
    { name: "Trang chủ", path: "/" },
    { name: "Blog", path: "/blog/" },
  ];
  if (post.categories[0])
    crumbs.push({
      name: post.categories[0].name,
      path: blogListingHref({ category: post.categories[0].slug }),
    });
  crumbs.push({ name: post.title, path: post.href });
  const result = buildPageSchema({
    path: post.href,
    metadata: {
      title: post.title,
      description: post.excerpt,
      ...(post.image ? { openGraph: { images: [post.image] } } : {}),
    },
    breadcrumbs: crumbs,
  });
  const page = result["@graph"][0];
  page.mainEntity = ref(`${url}#article`);
  if (post.categories.length)
    page.about = post.categories.map((category) => ({
      "@type": "Thing",
      name: category.name,
    }));
  const primaryImage = result["@graph"].find(
    (node) => node["@id"] === `${url}#primaryimage`,
  );
  if (primaryImage && post.imageAlt) primaryImage.caption = post.imageAlt;
  const article: SchemaNode = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    inLanguage: "vi-VN",
    mainEntityOfPage: ref(`${url}#webpage`),
    isPartOf: ref(schemaIds.blog),
    publisher: ref(schemaIds.organization),
    ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
    ...(post.categories.length
      ? { articleSection: post.categories.map((category) => category.name) }
      : {}),
    ...(Number.isFinite(Date.parse(post.publishedAt))
      ? { datePublished: post.publishedAt }
      : {}),
    ...(Number.isFinite(Date.parse(post.modifiedAt))
      ? { dateModified: post.modifiedAt }
      : {}),
    ...(readingMinutes > 0
      ? { timeRequired: `PT${Math.ceil(readingMinutes)}M` }
      : {}),
  };
  if (post.author)
    article.author = /^interdata$/i.test(post.author.trim())
      ? ref(schemaIds.organization)
      : {
          "@type": "Person",
          name: post.author,
          ...(post.authorUrl
            ? { url: post.authorUrl, "@id": `${post.authorUrl}#person` }
            : {}),
        };
  result["@graph"].push(article, {
    "@type": "Blog",
    "@id": schemaIds.blog,
    url: absoluteUrl("/blog/"),
    name: "InterData Blog",
    inLanguage: "vi-VN",
    publisher: ref(schemaIds.organization),
    isPartOf: ref(schemaIds.website),
  });
  return result;
}

export function buildBlogListingSchema({
  path,
  title,
  description,
  posts,
  search = false,
}: {
  path: string;
  title: string;
  description: string;
  posts: BlogPost[];
  search?: boolean;
}): SchemaGraph {
  const result = buildPageSchema({
    path,
    metadata: { title, description },
    profile: {
      type: search ? "SearchResultsPage" : "CollectionPage",
      name: title,
    },
  });
  const url = absoluteUrl(path);
  result["@graph"][0].mainEntity = ref(`${url}#posts`);
  result["@graph"].push(
    {
      "@type": "Blog",
      "@id": schemaIds.blog,
      url: absoluteUrl("/blog/"),
      name: "InterData Blog",
      inLanguage: "vi-VN",
      publisher: ref(schemaIds.organization),
      isPartOf: ref(schemaIds.website),
    },
    {
      "@type": "ItemList",
      "@id": `${url}#posts`,
      name: title,
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: absoluteUrl(post.href),
        item: {
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(post.href)}#article`,
          headline: post.title,
          url: absoluteUrl(post.href),
        },
      })),
    },
  );
  return result;
}
