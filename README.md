# Funhome — Website cho thuê chung cư mini & phòng trọ

Static site (HTML/CSS/JS thuần), deploy thẳng lên Netlify. Slogan: **Ở vui mỗi ngày**.

## Cấu trúc
```
index.html                → Trang chủ (SEO, gallery, phòng nổi bật thật, FAQ)
funhome-map.html          → Bản đồ phòng trống: 40 tòa nhà + đặt lịch xem phòng   (/timphong)
funhome-tuyendung.html    → Tuyển dụng                                            (/tuyendung)
funhome-app.html          → Đăng nhập + quản lý/thêm phòng                        (/quanly)
funhome-theme.css         → Hệ thiết kế dùng chung (xanh đậm + logo Funhome)
funhome-data.js           → Cấu hình thương hiệu + logo + nút liên hệ nổi + helpers
funhome-inventory.js      → Snapshot kho phòng thật (40 tòa / 199 phòng) — dữ liệu dự phòng
favicon.svg, og-image.png → Nhận diện & ảnh chia sẻ mạng xã hội
robots.txt, sitemap.xml   → SEO
netlify.toml              → Redirect URL đẹp + headers
tich-hop/                 → Google Apps Script (Code.gs) + hướng dẫn nối Sheet/Zalo
```

## Deploy (Netlify)
- **Kéo–thả:** Netlify → Add new site → Deploy manually → kéo cả thư mục (có index.html).
- **Qua GitHub:** push repo → Netlify → Import from Git → Build command để trống, Publish directory `.`.

Sau deploy, đổi `https://funhome.vn` trong các thẻ canonical/og và `sitemap.xml`/`robots.txt` thành domain thật của bạn.

## Cấu hình nhanh (funhome-data.js)
```js
mapsKey:    ""   // Google Maps API key. Trống = dùng OpenStreetMap miễn phí.
roomsApi:   ""   // URL Apps Script (GET) — phòng tự cập nhật từ Sheet + ảnh thật
bookingApi: ""   // URL Apps Script (POST) — đặt lịch → Sheet + Zalo
```
Để trống `roomsApi` → web dùng snapshot `funhome-inventory.js`. Để trống `bookingApi` → form đặt lịch chỉ log ra console (demo).

## Nối dữ liệu thật + đặt lịch → Sheet/Zalo
Xem **`tich-hop/HUONG-DAN.md`**: tạo Apps Script, deploy Web App, dán URL vào `roomsApi`/`bookingApi`.
Kết quả: bản đồ lấy phòng trực tiếp từ Google Sheet (kèm ảnh), form đặt lịch ghi vào tab `DatLich` và bắn thông báo Zalo cho Sale.

## Thông tin thương hiệu
- Hotline / Zalo: 0919 293 277
- Email: contact.funhome@gmail.com
- Facebook: /Funhome · Instagram: /funhome8386

## Đăng nhập demo (trang /quanly)
Email: demo@funhome.vn — Mật khẩu: funhome
