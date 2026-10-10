# Logo section Đối tác

Section `doi-tac-cong-nghe` được đặt ngay sau section giáo dục. Danh sách ban đầu gồm 16 thương hiệu do người dùng cung cấp; “Promox” được chuẩn hóa thành “Proxmox”. Ngày 10/10/2026 bổ sung 4 logo minh họa theo yêu cầu demo: Kubernetes, Prometheus, Helm và containerd. Giữ thứ tự tương đối của 16 logo ban đầu; Kubernetes bổ sung ở cuối bên trái, 3 logo còn lại ở cuối bên phải. Desktop bố trí hai vòng cung cân đối, mỗi bên 10 logo, năm hàng × hai ô ôm địa cầu. Màn hình dưới 1024px dùng lưới logo bên dưới địa cầu để bảo đảm kích thước dễ đọc. Không hiển thị nhãn nhóm.

Bốn logo bổ sung giữ metadata `demo: true` trong dữ liệu để lưu nguồn gốc minh họa. Theo yêu cầu ngày 10/10/2026, giao diện không hiển thị nhãn Demo hoặc dòng chú thích bên dưới. Các mục này không bổ sung tuyên bố tính năng, tích hợp hay chứng nhận.

Logo được lưu cục bộ trong `public/images/technology-partners/`. Giữ nguyên hình dạng, màu sắc và tỷ lệ artwork; các bản có chữ trắng dùng nền xanh đậm để đọc rõ. Không tải logo từ bên thứ ba khi người dùng mở trang.

| Logo                       | Nguồn asset                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AMD, Samsung, DELL, Lenovo | SVG từ bộ Simple Icons có sẵn trong checkout `D:/Theme-VPS-Gia-Re-FastByte-Backup-20260825-154338/node_modules/simple-icons/icons/`; bản đơn sắc gốc         |
| Intel                      | https://www.intel.com/content/dam/logos/logo-energyblue-1x1.png                                                                                              |
| Proxmox, VMware, Linux     | Asset đã có trong `D:/Anh-dang-bai/Media-Thang-6/Project-Code-Web-Thue-VPS/interdata-vps/public/partners/`                                                   |
| Microsoft                  | https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg                                                                            |
| Viettel IDC, VNPT          | Asset đã có trong `D:/InterData/thue-vps/public/images/skin/customer/`                                                                                       |
| FPT Fornix                 | https://fornix.fpt.work/wp-content/themes/fornix/assets/image/Logo.svg                                                                                       |
| GreenCloud                 | https://greencloudvps.com/img/site/logo.png                                                                                                                  |
| HPE                        | https://www.hpe.com/apps/hpeweb-ui/images/gn-icons/logo-lm.svg                                                                                               |
| Supermicro                 | https://www.supermicro.com/sites/default/files/Super_Micro_Computer_Logo.svg                                                                                 |
| AWS                        | https://raw.githubusercontent.com/pheralb/svgl/main/static/library/aws_light.svg                                                                             |
| Kubernetes (demo)          | https://raw.githubusercontent.com/cncf/artwork/002662490acb2303c7301acc0256c00790e03e9f/projects/kubernetes/horizontal/color/kubernetes-horizontal-color.svg |
| Prometheus (demo)          | https://raw.githubusercontent.com/cncf/artwork/002662490acb2303c7301acc0256c00790e03e9f/projects/prometheus/horizontal/black/prometheus-horizontal-black.svg |
| Helm (demo)                | https://raw.githubusercontent.com/cncf/artwork/002662490acb2303c7301acc0256c00790e03e9f/projects/helm/horizontal/color/helm-horizontal-color.svg             |
| containerd (demo)          | https://raw.githubusercontent.com/cncf/artwork/002662490acb2303c7301acc0256c00790e03e9f/projects/containerd/horizontal/color/containerd-horizontal-color.svg |

Logo demo lấy trực tiếp từ [CNCF Artwork](https://github.com/cncf/artwork), pin commit `002662490acb2303c7301acc0256c00790e03e9f`. Giữ nguyên artwork SVG theo bố cục ngang; Prometheus dùng bản đen chính thức để dễ đọc trên nền trắng, ba logo còn lại dùng bản màu. Không vẽ lại hoặc chỉnh tỷ lệ artwork.

Địa cầu SVG được dựng từ dữ liệu Natural Earth qua [world-atlas](https://github.com/topojson/world-atlas), bản `land-110m.json` phiên bản 2.0.2, chiếu trực giao hướng về châu Á. Gradient và đổ bóng tạo khối sáng; không thêm thư viện bản đồ hoặc hoạt ảnh vào runtime của trang. SVG khoảng 44 KB; logo PNG được Next Image tối ưu theo kích thước hiển thị.

Kiểm tra responsive và accessibility cục bộ được lưu trong `artifacts/ecosystem/` (thư mục QA bị Git ignore).
