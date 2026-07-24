# Funhome — Website cho thuê chung cư mini & phòng trọ

Static site (HTML/CSS/JS thuần), deploy thẳng lên Netlify, không cần build.

## Cấu trúc
```
index.html                → Trang chủ (landing, năng lực, gallery, listing)
funhome-map.html          → Bản đồ tìm phòng + filter   (URL đẹp: /timphong)
funhome-tuyendung.html    → Tuyển dụng + ứng tuyển        (URL đẹp: /tuyendung)
funhome-app.html          → Đăng nhập + quản lý/thêm phòng (URL đẹp: /quanly)
funhome-theme.css         → Hệ thiết kế dùng chung (xanh đậm)
funhome-data.js           → Dữ liệu phòng + cấu hình dùng chung
netlify.toml              → Cấu hình redirect + headers cho Netlify
```

## Cách deploy

### Cách A — Kéo–thả (nhanh nhất)
1. Vào https://app.netlify.com → "Add new site" → "Deploy manually".
2. Kéo TOÀN BỘ thư mục này (chứa index.html) vào ô upload. Xong.

### Cách B — Qua GitHub (khuyến nghị, tự động cập nhật)
1. Tạo repo mới trên GitHub, upload tất cả file này vào (giữ nguyên cấu trúc, index.html ở thư mục gốc).
2. Netlify → "Add new site" → "Import from Git" → chọn repo.
3. Build command: để trống. Publish directory: `.` (dấu chấm). Deploy.
4. Mỗi lần push GitHub, Netlify tự deploy lại.

Sau khi deploy, site chạy tại `ten-cua-ban.netlify.app`. Các URL đẹp: `/timphong`, `/tuyendung`, `/quanly`.

## Cấu hình (mở funhome-data.js)
- `FUNHOME_CONFIG.mapsKey`: dán Google Maps API key. Để trống "" → tự dùng OpenStreetMap miễn phí.
- `FUNHOME_CONFIG.sheetCsv`: dán link CSV Google Sheet (Publish to web → CSV) để tự nạp dữ liệu phòng.
  Cột cần: id | title | type | price | area | address | district | lat | lng | amenities | image | beds | note
  (amenities ngăn cách bằng dấu ";")

## Đăng nhập demo (trang /quanly)
Email: demo@funhome.vn — Mật khẩu: funhome

## Muốn subdomain thật (timphong.funhome.vn ...)?
Trên Netlify, subdomain thật cần cấu hình DNS. Có 2 hướng:
1. Đơn giản: dùng URL path /timphong, /tuyendung, /quanly (đã cấu hình sẵn) — không cần DNS.
2. Subdomain riêng: tạo mỗi site Netlify riêng cho từng trang, rồi trỏ CNAME của từng subdomain (timphong, tuyendung, quanly) về site tương ứng trong phần Domain settings.
