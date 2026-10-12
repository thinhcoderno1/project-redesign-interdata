import type { Metadata } from "next";
import policy from "@/data/privacy-policy.json";
import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";

const description = policy.blocks[0].text;

function headingId(text: string) {
  return `muc-${text.match(/^\d+(?:\.\d+)*/)?.[0].replaceAll(".", "-")}`;
}

const sections = policy.blocks.flatMap((block) =>
  block.type === "h2" && block.text
    ? [{ id: headingId(block.text), title: block.text }]
    : [],
);

export const metadata: Metadata = {
  title: `${policy.title} | InterData`,
  description,
  alternates: { canonical: "https://interdata.vn/chinh-sach-bao-mat/" },
  openGraph: {
    title: `${policy.title} | InterData`,
    description,
    url: "https://interdata.vn/chinh-sach-bao-mat/",
    siteName: "InterData",
    locale: "vi_VN",
    type: "website",
  },
};

// Keep the supplied wording intact; only render the source Markdown email link.
function PolicyText({ text }: { text: string }) {
  const link = /\[([^\]]+)\]\((mailto:[^)]+)\)/.exec(text);
  if (!link) return text;
  return (
    <>
      {text.slice(0, link.index)}
      <a href={link[2]}>{link[1]}</a>
      {text.slice(link.index + link[0].length)}
    </>
  );
}

export default function Page() {
  return (
    <LegalDocumentLayout
      title={policy.title}
      titleId="privacy-title"
      sections={sections}
    >
      {policy.blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} id={headingId(block.text!)}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={index} id={headingId(block.text!)}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items?.map((item) => (
                <li key={item}>
                  <PolicyText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            <PolicyText text={block.text!} />
          </p>
        );
      })}
    </LegalDocumentLayout>
  );
}
