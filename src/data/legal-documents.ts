export const legalDocuments = [
  {
    slug: "chinh-sach-xu-ly-khieu-nai",
    label: "Chính sách xử lý khiếu nại",
    sourceFile: "Chính sách xử lý khiếu nại.md",
  },
  {
    slug: "cam-ket-chat-luong-dich-vu",
    label: "Cam kết chất lượng dịch vụ",
    sourceFile: "Cam kết chất lượng dịch vụ.md",
  },
  {
    slug: "dieu-khoan-su-dung-dich-vu",
    label: "Điều khoản sử dụng dịch vụ",
    sourceFile: "Điều khoản sử dụng dịch vụ.md",
  },
  {
    slug: "hinh-thuc-thanh-toan",
    label: "Hình thức thanh toán",
    sourceFile: "Hình thức thanh toán.md",
  },
  {
    slug: "huong-dan-thanh-toan-vnpay",
    label: "Hướng dẫn thanh toán VNPAY",
    sourceFile: "Hướng dẫn thanh toán VNPAY.md",
  },
  {
    slug: "quy-dinh-doi-tra-va-hoan-tien",
    label: "Quy định đổi trả và hoàn trả tiền",
    sourceFile: "Quy định đổi trả và hoàn trả tiền.md",
  },
  {
    slug: "quy-dinh-su-dung-ten-mien",
    label: "Quy định sử dụng tên miền",
    sourceFile: "Quy định sử dụng tên miền.md",
  },
] as const;

export type LegalDocument = (typeof legalDocuments)[number];

export function getLegalDocument(slug: string): LegalDocument {
  const document = legalDocuments.find((entry) => entry.slug === slug);
  if (!document) throw new Error(`Unknown legal document: ${slug}`);
  return document;
}
