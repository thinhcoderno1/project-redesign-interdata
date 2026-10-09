# Logo section Đối tác

Section `doi-tac-cong-nghe` được đặt ngay sau section giáo dục. Danh sách 16 thương hiệu do người dùng cung cấp; “Promox” được chuẩn hóa thành “Proxmox”. Thứ tự logo giữ nguyên; desktop bố trí thành hai vòng cung, mỗi bên năm hàng ôm địa cầu. Màn hình dưới 1024px dùng lưới logo bên dưới địa cầu để bảo đảm kích thước dễ đọc. Không hiển thị nhãn nhóm.

Logo được lưu cục bộ trong `public/images/technology-partners/`. Giữ nguyên hình dạng, màu sắc và tỷ lệ artwork; các bản có chữ trắng dùng nền xanh đậm để đọc rõ. Không tải logo từ bên thứ ba khi người dùng mở trang.

| Logo                       | Nguồn asset                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| AMD, Samsung, DELL, Lenovo | SVG từ bộ Simple Icons có sẵn trong checkout `D:/Theme-VPS-Gia-Re-FastByte-Backup-20260825-154338/node_modules/simple-icons/icons/`; bản đơn sắc gốc |
| Intel                      | https://www.intel.com/content/dam/logos/logo-energyblue-1x1.png                                                                                      |
| Proxmox, VMware, Linux     | Asset đã có trong `D:/Anh-dang-bai/Media-Thang-6/Project-Code-Web-Thue-VPS/interdata-vps/public/partners/`                                           |
| Microsoft                  | https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg                                                                    |
| Viettel IDC, VNPT          | Asset đã có trong `D:/InterData/thue-vps/public/images/skin/customer/`                                                                               |
| FPT Fornix                 | https://fornix.fpt.work/wp-content/themes/fornix/assets/image/Logo.svg                                                                               |
| GreenCloud                 | https://greencloudvps.com/img/site/logo.png                                                                                                          |
| HPE                        | https://www.hpe.com/apps/hpeweb-ui/images/gn-icons/logo-lm.svg                                                                                       |
| Supermicro                 | https://www.supermicro.com/sites/default/files/Super_Micro_Computer_Logo.svg                                                                         |
| AWS                        | https://raw.githubusercontent.com/pheralb/svgl/main/static/library/aws_light.svg                                                                     |

Địa cầu SVG được dựng từ dữ liệu Natural Earth qua [world-atlas](https://github.com/topojson/world-atlas), bản `land-110m.json` phiên bản 2.0.2, chiếu trực giao hướng về châu Á. Gradient và đổ bóng tạo khối sáng; không thêm thư viện bản đồ hoặc hoạt ảnh vào runtime của trang. SVG khoảng 44 KB; logo PNG được Next Image tối ưu theo kích thước hiển thị.

Kiểm tra responsive và accessibility cục bộ được lưu trong `artifacts/ecosystem/` (thư mục QA bị Git ignore).
