# Funhome — Website cho thuê chung cư mini & phòng trọ

## Cấu trúc file
| File | Vai trò | Subdomain gợi ý |
|------|---------|-----------------|
| `funhome.html` | Trang chủ (landing, năng lực, gallery, listing) | funhome.vn |
| `funhome-map.html` | Bản đồ tìm phòng + bộ lọc theo bản đồ | timphong.funhome.vn |
| `funhome-tuyendung.html` | Tuyển dụng + ứng tuyển | tuyendung.funhome.vn |
| `funhome-app.html` | Đăng nhập + dashboard thêm/quản lý phòng | quanly.funhome.vn |
| `funhome-theme.css` | Hệ thiết kế dùng chung (màu xanh đậm) | — |
| `funhome-data.js` | Dữ liệu phòng + cấu hình dùng chung | — |

> ⚠️ Giữ cả 6 file trong CÙNG một thư mục thì trang mới chạy đúng.

## Chạy thử
Mở `funhome.html` bằng trình duyệt. (Nên chạy qua một web server tĩnh để bản đồ & fetch hoạt động tốt nhất, ví dụ: `python3 -m http.server` rồi mở http://localhost:8000/funhome.html)

## Cấu hình (mở `funhome-data.js`)
- `FUNHOME_CONFIG.mapsKey`: dán Google Maps API key. Để trống "" → tự dùng OpenStreetMap miễn phí.
- `FUNHOME_CONFIG.sheetCsv`: dán link CSV Google Sheet (Publish to web → CSV) để tự nạp dữ liệu phòng.
  Cột Sheet cần: id | title | type | price | area | address | district | lat | lng | amenities | image | beds | note
  (amenities ngăn cách bằng dấu ";")

## Đăng nhập demo (trang quản lý)
Email: demo@funhome.vn — Mật khẩu: funhome

## Triển khai lên subdomain thật
1. Upload thư mục lên hosting (Vercel/Netlify/GitHub Pages...).
2. Trỏ mỗi subdomain (CNAME) tới trang tương ứng, hoặc dùng cùng 1 host rồi cập nhật `FUNHOME_CONFIG.domains` sang URL thật.
