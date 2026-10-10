// Verified against the official Contact page and its Google Maps links on 2026-10-10.
export const contactDetails = {
  source: "https://interdata.vn/contact",
  email: "info@interdata.vn",
  hotline: "1900 636 822",
  hotlineHref: "tel:1900636822",
  mobile: "0966 039 166",
  mobileHref: "tel:0966039166",
  hours: "Thứ 2 – Thứ 7: 9:00 – 18:00",
  zalo: "https://zalo.me/2009180325727970604",
  facebook: "https://www.facebook.com/interdata.com.vn",
} as const;

export const contactOffices = [
  {
    id: "giao-dich",
    name: "Văn phòng giao dịch",
    shortName: "Lakeview City",
    address:
      "Số 211 Đường số 5, Khu đô thị Lakeview City, Phường Bình Trưng, TP. Hồ Chí Minh",
    mapUrl: "https://maps.app.goo.gl/JdnrU5N9xWYKShqt5",
    embedUrl:
      "https://www.google.com/maps?q=10.7952477,106.778797&z=16&output=embed",
  },
  {
    id: "dai-dien",
    name: "Văn phòng đại diện",
    shortName: "Nguyễn Đình Chính",
    address: "240 Nguyễn Đình Chính, Phường Phú Nhuận, TP. Hồ Chí Minh",
    mapUrl: "https://maps.app.goo.gl/ZxSPDiAQerFgVw5RA",
    embedUrl:
      "https://www.google.com/maps?q=10.795176,106.674237&z=16&output=embed",
  },
] as const;

export const contactServices = [
  "VPS",
  "Cloud Server",
  "Thuê Máy Chủ",
  "Colocation",
  "Giải pháp triển khai",
  "Hợp tác / nhu cầu khác",
] as const;
