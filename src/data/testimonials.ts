// Shared customer feedback. Display order is maintained here for every page.
export const testimonials = [
  {
    name: "Đặng Hải Triều",
    company: "Đồng Hồ Hải Triều",
    logo: "/images/testimonials/logo-donghohaitrieu.png",
    quote:
      "Chất lượng dịch vụ rất tốt! Đội ngũ hỗ trợ mau chóng, phối hợp nhịp nhàng để hỗ trợ mấy ca khó. Linh hoạt xử lý mấy tình huống ngoài phạm vi trách nhiệm luôn. Rất tuyệt vời.",
    logoWidth: 900,
    logoHeight: 190,
  },
  {
    name: "Lê Minh Hưng",
    company: "SEO Việt",
    logo: "/images/testimonials/logo-seoviet.png",
    quote:
      "Sau 1 thời gian trải nghiệm và đã sử dụng dịch vụ của InterData thì Hưng đánh giá chất lượng dịch vụ khá là tốt. Hưng cũng dùng dịch vụ rất nhiều bên ở Việt Nam rồi thì thấy dịch vụ không thua kém bất kể bên nào, nhiều khi còn nhỉnh hơn các bên. Hệ thống ổn định, đặc biệt giá thành tốt hơn so với các bên trên thị trường. Mong muốn của Hưng cũng như tất cả khách hàng là InterData sẽ duy trì sự ổn định bền vững ở hiện tại và tương lai.",
    logoWidth: 609,
    logoHeight: 236,
  },
  {
    name: "Thắng Nguyễn",
    company: "UMIX Việt Nam",
    logo: "/images/testimonials/logo-umix-vietnam.png",
    quote:
      "Tôi đã chuyển website Umix sang chạy ở InterData, điều tôi hài lòng nhất chính là sự nhiệt tình của các nhân viên, hỗ trợ mọi vấn đề một cách nhanh chóng ngay cả lúc nửa đêm.",
    logoWidth: 148,
    logoHeight: 53,
  },
  {
    name: "Vĩnh Minh Đạo",
    company: "RealDev",
    logo: "/images/testimonials/logo-realdev.png",
    quote:
      "Với tư cách là đơn vị sử dụng trực tiếp và cung cấp dịch vụ website đến khách hàng toàn quốc, mình đã sử dụng dịch vụ của các đơn vị cung cấp VPS, Hosting, Dedicate từ trong nước đến nước ngoài. Sau khi sử dụng dịch vụ VPS tại InterData, mình rất ấn tượng với cấu hình chuẩn chỉnh và giá trị thực tế của dịch vụ. Mình đánh giá rất cao thái độ cầu thị của toàn thể công ty InterData và chất lượng sản phẩm dịch vụ.",
    logoWidth: 500,
    logoHeight: 277,
  },
  {
    name: "Gia Tuấn",
    company: "WPTANGTOC OLS",
    showFullQuote: true,
    logo: "/images/testimonials/logo-wptangtoc.png",
    quote:
      "Mình đang sử dụng và rất thích gói AMD Cloud Server của InterData. Hiệu năng cực khủng, vô địch trong tầm giá.",
    logoWidth: 600,
    logoHeight: 600,
  },
  {
    name: "Trịnh Bảo",
    company: "BALICO",
    logo: "/images/testimonials/balico.png",
    quote:
      "Mình thấy khá hài lòng với dịch vụ Cloud AMD của InterData. Website chạy ổn định, hiệu suất và các tính năng đều đáp ứng tốt nhu cầu của mình. Có lúc cũng gặp vài trục trặc nhỏ, nhưng đội ngũ kỹ thuật xử lý rất nhanh và nhiệt tình. Nhìn chung, dùng dịch vụ của InterData mình cảm thấy rất yên tâm.",
    logoWidth: 400,
    logoHeight: 111,
  },
  {
    name: "Trường Phong",
    hidden: true,
    company: "Công ty TNHH Giải pháp Công nghệ Trường Phong",
    logo: "/images/testimonials/logo-themewpgiare-truongphong.png",
    quote:
      "Từ lúc chuyển qua dùng VPS của InterData, mình thấy website chạy mượt hơn hẳn, hiếm khi gặp lỗi. Đội ngũ hỗ trợ cũng rất chuyên nghiệp, lúc nào cần là phản hồi liền. Hiện tại thì mình hoàn toàn hài lòng với dịch vụ này.",
    logoWidth: 1024,
    logoHeight: 269,
  },
  {
    name: "Trần Mạnh Hùng",
    company: "Digizone Việt Nam",
    logo: "/images/testimonials/logo-digizone-vietnam.png",
    quote:
      "Bên mình là Agency về thiết kế web và Ads nên rất chú trọng về tính ổn định, bảo mật của VPS, Hosting để đảm bảo chất lượng dịch vụ với khách hàng. Từ khi dùng dịch vụ của InterData thì mình thấy hạ tầng mạnh, cập nhật các dòng cấu hình server mới, tốc độ kết nối nhanh và đội ngũ hỗ trợ nhiệt tình. Mình tin tưởng vào chất lượng dịch vụ của InterData sẽ luôn đảm bảo ổn định và bảo mật cao.",
    logoWidth: 1024,
    logoHeight: 384,
  },
  {
    name: "Tạ Quốc Khánh",
    company: "Công ty Cổ phần Jobkey",
    logo: "/images/testimonials/logo-jobkey.png",
    quote:
      "Đội ngũ hỗ trợ kỹ thuật nhiệt tình và nhanh chóng. Tôi sẽ giới thiệu thêm cho bạn bè và đối tác của mình về dịch vụ của InterData trong thời gian tới.",
    logoWidth: 260,
    logoHeight: 55,
  },
];

export const visibleTestimonials = testimonials.filter((item) => !item.hidden);
