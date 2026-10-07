import Link from "next/link";
import {
  claims,
  infrastructure,
  campaigns,
  links,
  reviewMode,
} from "@/data/content";
import { notFound } from "next/navigation";
export default function ContentReview() {
  if (!reviewMode) notFound();
  return (
    <main className="container review-page">
      <Link href="/">← Về homepage</Link>
      <h1>Nội dung chờ duyệt</h1>
      <p>
        Bản review ngày 07/10/2026. Dữ liệu sao chép từ brief hoặc dự án nguồn
        là nguồn nội dung, chưa phải bằng chứng xác nhận độc lập.
      </p>
      <h2>Claims từ brief</h2>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Nội dung giữ nguyên</th>
              <th>Trạng thái</th>
              <th>Cần xác nhận</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id}>
                <td>{c.text}</td>
                <td>{c.status === "pending" ? "Chờ duyệt" : "Đã duyệt"}</td>
                <td>{c.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Thông tin hạ tầng</h2>
      <ul>
        {infrastructure.map((i) => (
          <li key={i.name}>
            <strong>{i.name}: </strong>
            {i.detail} — {i.status}; nguồn: {i.source}.
          </li>
        ))}
      </ul>
      <p>
        Xác nhận datacenter, cấu hình khả dụng và phạm vi bảo vệ/giám sát theo
        từng dịch vụ. Không bổ sung chứng nhận hoặc cam kết kỹ thuật chưa có
        nguồn.
      </p>
      <h2>Chiến dịch và tài sản</h2>
      <ul>
        {campaigns.map((c) => (
          <li key={c.title}>
            {c.title} — {c.status}. Xác nhận hiệu lực, điều kiện và quyền công
            bố banner.
          </li>
        ))}
      </ul>
      <p>
        Logo, phản hồi, ảnh khách hàng, báo chí và logo trường lấy từ dự án
        nguồn. Cần rà soát quyền sử dụng, cách ghi tên và phạm vi quan hệ trước
        công bố. Các ảnh chân dung cần xác nhận đúng người.
      </p>
      <p>
        Hero: ảnh chụp lối đi giữa hai dãy rack từ PxHere (CC0). Section hạ tầng:
        ảnh Viettel-IDC.jpg do người dùng cung cấp. Các ảnh này chưa phải
        ảnh cơ sở InterData đã xác minh.
      </p>
      <h2>Đường dẫn và tích hợp</h2>
      <p>
        Ba giải pháp chưa có trang đích được xác nhận: điều hướng đến section
        homepage, CTA đến <a href={links.contact}>trang liên hệ chính thức</a>.
        Không tạo form hoặc mô phỏng gửi thành công. Bản này không có backend,
        analytics hay đăng nhập riêng.
      </p>
      <h2>Chế độ xuất bản</h2>
      <p>
        Mặc định CONTENT_MODE là review, metadata noindex. Đặt
        NEXT_PUBLIC_CONTENT_MODE=public để ẩn banner và claims chưa duyệt cùng
        báo cáo này. Chỉ chuyển trạng thái thành approved trong
        src/data/content.ts sau khi có phê duyệt thật. Cần duyệt
        metadata/indexing riêng khi triển khai. Chưa deploy.
      </p>
    </main>
  );
}
