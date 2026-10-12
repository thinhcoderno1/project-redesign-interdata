# CAM KẾT CHẤT LƯỢNG DỊCH VỤ

Cam kết Mức độ Dịch vụ (Service Level Agreement – “SLA”) quy định mức độ sẵn sàng, phạm vi hỗ trợ và nguyên tắc xử lý sự cố đối với các dịch vụ do InterData cung cấp.

SLA được xây dựng nhằm:

- Minh bạch chất lượng dịch vụ;
- Xác định rõ trách nhiệm của InterData;
- Xác định rõ trách nhiệm của Khách Hàng;
- Thiết lập tiêu chuẩn đo lường sự cố;
- Quy định thời gian phản hồi hỗ trợ;
- Quy định cơ chế bù dịch vụ trong trường hợp dịch vụ không đạt mức cam kết.

SLA này được áp dụng cùng với Điều khoản sử dụng dịch vụ, chính sách hỗ trợ và các quy định riêng của từng sản phẩm.

## 1. KHÁI NIỆM VÀ ĐỊNH NGHĨA

**Uptime:** Là khoảng thời gian dịch vụ hoạt động bình thường, được tính bằng cách lấy số phút trong tháng trừ đi số phút mà hệ thống dịch vụ ở trạng thái không sẵn sàng do lỗi của InterData và không bao gồm các khoảng thời gian bảo trì, ngưng dịch vụ do sự kiện bất khả kháng và các trường hợp khác được loại trừ.

**Downtime:** Khoảng thời gian dịch vụ không thể sử dụng do nguyên nhân thuộc phạm vi trách nhiệm của InterData.

**Tháng SLA:** Một tháng dương lịch, tính từ 00:00 ngày đầu tháng đến 23:59:59 ngày cuối tháng.

**Service Credit:** Khoản giá trị dịch vụ được bù cho Khách Hàng khi dịch vụ không đạt mức SLA theo quy định.

## 2. MỨC SLA CAM KẾT

| Dịch vụ | Mức SLA |
| --- | --- |
| VPS | 99,90%/tháng |
| Cloud Server | 99,90%/tháng |
| Hosting | 99,90%/tháng |

**Cách tính:** Uptime (%) = (Tổng thời gian dịch vụ trong tháng – Downtime được tính SLA) / Tổng thời gian dịch vụ trong tháng × 100%.

## 3. TRÁCH NHIỆM CỦA INTERDATA

- Duy trì và vận hành hạ tầng thuộc phạm vi quản lý của InterData với mục tiêu đáp ứng mức SLA công bố.
- Theo dõi và giám sát hệ thống để phát hiện, tiếp nhận và xử lý các sự cố thuộc phạm vi trách nhiệm.
- Ưu tiên khôi phục dịch vụ khi xảy ra sự cố hạ tầng và phối hợp với Khách Hàng khi cần thiết.
- Thông báo cho Khách Hàng trong trường hợp sự cố có ảnh hưởng đáng kể hoặc bảo trì có khả năng ảnh hưởng đến dịch vụ, trong điều kiện phù hợp.

## 4. MỨC ĐỀN BÙ DỊCH VỤ

| Uptime hàng tháng | Mức đền bù | Căn cứ tính |
| --- | --- | --- |
| Từ 97,00% đến dưới 99,90% | 10% | Phí dịch vụ của máy chủ/dịch vụ bị ảnh hưởng trong tháng |
| Từ 95,00% đến dưới 97,00% | 30% | Phí dịch vụ của máy chủ/dịch vụ bị ảnh hưởng trong tháng |
| Dưới 95,00% | 100% | Phí dịch vụ của máy chủ/dịch vụ bị ảnh hưởng trong tháng |

**Lưu ý:** Mức đền bù được tính trên phí của chính máy chủ/dịch vụ bị ảnh hưởng, không áp dụng cho các dịch vụ khác trong cùng tài khoản.

## 5. QUY TRÌNH TIẾP NHẬN VÀ GIẢI QUYẾT KHIẾU NẠI:

- Hình thức tiếp nhận thông qua Phòng xử lý sự cố / khiếu nại tại hệ thống tiếp nhận ticket của InterData. ([https://support.interdata.vn/submitticket.php](https://support.interdata.vn/submitticket.php))

- Nội dung khi gửi yêu cầu khiếu nại đến InterData, khách hàng vui lòng cung cấp đầy đủ các thông tin sau:

+ Tiêu đề cần ghi rõ: “Yêu cầu bồi thường theo cam kết SLA”;

+ Thông tin chi tiết tài khoản, dịch vụ bị ảnh hưởng;

+ Ngày, giờ cụ thể và các thời điểm hệ thống, Dịch Vụ mà khách hàng sử dụng bị rơi vào trạng thái Trạng Thái Không Sẵn Sàng;

+ Logs ghi lỗi hoặc hình ảnh chụp màn hình tại thời điểm xảy ra lỗi (các thông tin bảo mật của khách hàng nên được làm mờ hoặc che lại);

- Thời gian tiếp nhận khiếu nại: trong vòng 30 ngày kể từ ngày xảy ra sự cố; quá thời hạn nêu trên, InterData sẽ không tiếp nhận và giải quyết bất kỳ khiếu nại nào có liên quan.

- Thời gian phản hồi, giải quyết khiếu nại: trong vòng mười lăm ngày làm việc kể từ ngày tiếp nhận khiếu nại.

- Trường hợp khách hàng không hài lòng với văn bản giải quyết của InterData thì khách hàng có thể gửi lại phản hồi cho InterData, trong trường hợp này, văn bản phản hồi của khách hàng sẽ được tiếp nhận và xử lý như là khiếu nại mới.

## 6. HÌNH THỨC ĐỀN BÙ

- Đền bù dưới hình thức cộng giá trị tương ứng vào số dư tài khoản (Credit) của Khách Hàng để sử dụng cho các kỳ thanh toán tiếp theo;

- Khoản đền bù không quy đổi thành tiền mặt và không áp dụng đồng thời với một hình thức hoàn tiền khác cho cùng một sự cố.

## 7. TRƯỜNG HỢP KHÔNG TÍNH VÀO SLA

- Dịch vụ không truy cập được do lỗi của khách hàng, người sử dụng/hoặc lỗi của bên thứ 3 như: tên miền hết hạn, lỗi Domain Name Server (DNS), cấu hình sai, lỗi hệ điều hành, virut máy tính, dịch vụ mạng của khách hàng không khả dụng, do hệ thống iptables, firewall, …

- Dịch vụ khóa truy cập do (các) nội dung, tệp tin (file) khách hàng lưu trữ trên hệ thống của InterData vi phạm pháp luật Việt Nam, bị cáo buộc vi phạm quyền sở hữu trí tuệ và/hoặc các quy định khác của InterData; khách hàng sử dụng mã nguồn (source code) gây ảnh hưởng đến hệ thống của InterData; khách hàng không hoàn thành nghĩa vụ thanh toán chi phí dịch vụ cho InterData.

- Truy cập bất hợp pháp vào các dịch vụ khác không thuộc chính khách hàng quản lý.

- Dịch vụ không truy cập được do khách hàng sử dụng dịch vụ không đúng chuẩn khuyến cáo InterData.

- Do yêu cầu chủ động ngưng hệ thống xuất phát từ yêu cầu phía khách hàng.

- Dịch vụ không truy cập được do lỗi liên quan đến các thiết bị của khách hàng.

- Dịch vụ không truy cập được do sự kiện bất khả kháng.

- Khi khách hàng dùng tài nguyên/dịch vụ của InterData để tấn công các hệ thống khác và được phát hiện sẽ bị InterData thông báo ngừng dịch vụ (Ví dụ như: DDoS, tấn công có chủ đích, phát tán virut).

- Dịch vụ tạm ngưng do khách hàng không thanh toán cước thuê bao cho InterData.

- Dịch vụ gián đoạn do InterData bảo trì và có thông báo trước kế hoạch bảo trì với khách hàng.’

- Dịch vụ gián đoạn do InterData thực hiện bảo trì khẩn cấp để đảm bảo an toàn cho hệ thống.

- DDoS, tấn công mạng, mã độc hoặc các sự kiện bất khả kháng nằm ngoài khả năng kiểm soát hợp lý của InterData.

- Các khoảng thời gian Khách Hàng chủ động yêu cầu tắt, khởi động lại, thay đổi cấu hình hoặc thực hiện bảo trì/migration.