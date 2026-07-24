/* =========================================================
   FUNHOME — DỮ LIỆU & LOGIC DÙNG CHUNG
   ---------------------------------------------------------
   👉 GOOGLE MAPS API KEY: dán vào FUNHOME_CONFIG.mapsKey.
      Để trống "" → tự dùng bản đồ OpenStreetMap miễn phí.

   👉 KẾT NỐI GOOGLE SHEET (BẢNG HÀNG):
      Cách nhanh: publish Sheet dạng CSV rồi fetch về.
        1. Trong Google Sheet: File → Share → Publish to web → chọn sheet "BangHang", định dạng CSV.
        2. Điền link vào FUNHOME_CONFIG.sheetCsv bên dưới.
        3. Web sẽ tự nạp dữ liệu; nếu để trống sẽ dùng ROOMS mẫu.
      Các cột Sheet cần có (đúng thứ tự header):
        id | title | type | price | area | address | district | lat | lng | amenities | image | beds | note
      (cột amenities ngăn cách bằng dấu ";" ví dụ: "Điều hòa;Máy giặt;Thang máy")
   ========================================================= */
const FUNHOME_CONFIG = {
  brand: "Funhome",
  slogan: "Ở vui mỗi ngày",
  hotline: "0919293277",
  zalo: "0919293277",
  email: "contact.funhome@gmail.com",
  facebook: "https://www.facebook.com/Funhome",
  instagram: "https://www.instagram.com/funhome8386",
  mapsKey: "",                 // 👈 Google Maps API key (tùy chọn)
  // 👇 API live qua Google Apps Script (xem HUONG-DAN-APPS-SCRIPT.md).
  //    Để trống → web dùng snapshot trong funhome-inventory.js.
  roomsApi: "",                // GET  → trả JSON kho phòng {buildings, rooms}
  bookingApi: "",              // POST → ghi Sheet 'DatLich' + gửi Zalo cho Sale
  promo: "Đăng ký xem phòng qua Funhome — nhận ngay gói khuyến mại dọn phòng trị giá 200.000đ",
  domains: {
    home:   "index.html",
    map:    "funhome-map.html",       // → timphong.funhome.vn
    jobs:   "funhome-tuyendung.html", // → tuyendung.funhome.vn
    app:    "funhome-app.html"        // → quanly.funhome.vn
  }
};

/* Logo Funhome (nhà + cửa sổ 4 ô + mặt cười) — đổi màu qua currentColor */
const FH_LOGO_SVG = '<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">'
 +'<path d="M9 31 32 13 55 31" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
 +'<path d="M16 30V51" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'
 +'<path d="M48 30V51" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'
 +'<path d="M21 41Q32 53 43 41" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>'
 +'<g fill="currentColor"><rect x="27" y="22" width="4.4" height="4.4" rx="1"/><rect x="32.6" y="22" width="4.4" height="4.4" rx="1"/><rect x="27" y="27.6" width="4.4" height="4.4" rx="1"/><rect x="32.6" y="27.6" width="4.4" height="4.4" rx="1"/></g></svg>';

/* Nút liên hệ nổi (Zalo + Gọi) — tự chèn vào mọi trang */
function fhRenderFab(){
  if(document.querySelector('.fh-fab')) return;
  const z=(FUNHOME_CONFIG.zalo||'').replace(/\D/g,'');
  const tel=(FUNHOME_CONFIG.hotline||'').replace(/\s/g,'');
  const el=document.createElement('div');
  el.className='fh-fab';
  el.innerHTML=`
    <a class="fh-fab-btn zalo" href="https://zalo.me/${z}" target="_blank" rel="noopener" aria-label="Chat Zalo">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2C6.48 2 2 5.94 2 10.8c0 2.7 1.42 5.11 3.66 6.74-.13.94-.53 2.28-1.45 3.42-.2.25.02.6.33.53 1.72-.36 3.2-1.08 4.22-1.74 1 .28 2.06.45 3.24.45 5.52 0 10-3.94 10-8.8S17.52 2 12 2z"/></svg>
      <span>Zalo</span>
    </a>
    <a class="fh-fab-btn call" href="tel:${tel}" aria-label="Gọi hotline">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>
      <span>Gọi ngay</span>
    </a>`;
  document.body.appendChild(el);
}
document.addEventListener('DOMContentLoaded', fhRenderFab);

let ROOMS = [
  {id:1,title:"Chung cư mini full nội thất, ban công thoáng",type:"Chung cư mini",price:5500000,area:32,address:"Ngõ 165 Cầu Giấy",district:"Cầu Giấy",lat:21.0362,lng:105.7906,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Thang máy","Ban công","Full nội thất","Bảo vệ 24/7","Wifi"],image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=75"],note:"Căn hộ mới, thiết kế hiện đại, gần Đại học Quốc gia và nhiều trường đại học."},
  {id:2,title:"Phòng trọ khép kín giá tốt cho sinh viên",type:"Phòng trọ",price:2800000,area:20,address:"Ngõ 89 Chùa Láng",district:"Đống Đa",lat:21.0221,lng:105.8080,beds:1,amenities:["Điều hòa","Nóng lạnh","Vệ sinh khép kín","Giờ giấc tự do","Wifi","Chỗ để xe"],image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=900&q=75"],note:"Phòng sạch sẽ, an ninh tốt, gần chợ và nhiều tiện ích."},
  {id:3,title:"Studio cao cấp view thành phố, thang máy",type:"Studio",price:7500000,area:38,address:"Vinhomes Green Bay, Nam Từ Liêm",district:"Nam Từ Liêm",lat:21.0181,lng:105.7639,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Tủ lạnh","Thang máy","Bảo vệ 24/7","Full nội thất","Ban công","Bếp riêng"],image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=75"],note:"Căn studio hiện đại trong khu đô thị cao cấp, đầy đủ tiện ích 5 sao."},
  {id:4,title:"Chung cư mini gần Bách Khoa, tiện đi lại",type:"Chung cư mini",price:4200000,area:26,address:"Ngõ 4 Tạ Quang Bửu",district:"Hai Bà Trưng",lat:21.0045,lng:105.8437,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Gác xép","Wifi","Chỗ để xe","Bếp riêng"],image:"https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75"],note:"Gần Đại học Bách Khoa, Kinh tế Quốc dân, Xây dựng. Có gác xép rộng."},
  {id:5,title:"Phòng trọ có gác, ban công, giờ giấc tự do",type:"Phòng trọ",price:3200000,area:22,address:"Ngõ 175 Định Công",district:"Hoàng Mai",lat:20.9788,lng:105.8342,beds:1,amenities:["Điều hòa","Nóng lạnh","Gác xép","Ban công","Giờ giấc tự do","Wifi","Chỗ để xe"],image:"https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=900&q=75"],note:"Phòng thoáng, có gác để đồ, khu dân cư yên tĩnh, an ninh đảm bảo."},
  {id:6,title:"Căn hộ mini 2 người ở, đầy đủ nội thất",type:"Chung cư mini",price:6000000,area:35,address:"Ngõ 62 Trần Thái Tông",district:"Cầu Giấy",lat:21.0316,lng:105.7889,beds:2,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Tủ lạnh","Thang máy","Bảo vệ 24/7","Full nội thất","Bếp riêng","Wifi"],image:"https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75"],note:"Rộng rãi cho 2 người, gần khu văn phòng Duy Tân, nhiều quán ăn."},
  {id:7,title:"Phòng trọ giá rẻ, sạch sẽ, gần bến xe",type:"Phòng trọ",price:2500000,area:18,address:"Ngõ 214 Nguyễn Trãi",district:"Thanh Xuân",lat:20.9955,lng:105.8046,beds:1,amenities:["Nóng lạnh","Vệ sinh khép kín","Giờ giấc tự do","Wifi","Chỗ để xe"],image:"https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=75"],note:"Phù hợp sinh viên, người đi làm ngân sách tiết kiệm. Gần Royal City."},
  {id:8,title:"Studio ban công lớn, view hồ Tây",type:"Studio",price:8000000,area:40,address:"Phố Tô Ngọc Vân",district:"Tây Hồ",lat:21.0705,lng:105.8230,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Tủ lạnh","Thang máy","Full nội thất","Ban công","Bếp riêng","Bảo vệ 24/7"],image:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=75"],note:"View hồ Tây tuyệt đẹp, khu vực yên tĩnh, nhiều café và không gian xanh."},
  {id:9,title:"Chung cư mini mới xây, thang máy, an ninh",type:"Chung cư mini",price:4800000,area:28,address:"Ngõ 336 Nguyễn Trãi",district:"Thanh Xuân",lat:20.9930,lng:105.8100,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Thang máy","Bảo vệ 24/7","Full nội thất","Wifi","Chỗ để xe"],image:"https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=75"],note:"Toà nhà mới xây, quản lý chuyên nghiệp, camera an ninh 24/7."},
  {id:10,title:"Phòng trọ khép kín, có bếp, khu văn phòng",type:"Phòng trọ",price:3800000,area:24,address:"Phố Duy Tân",district:"Cầu Giấy",lat:21.0301,lng:105.7825,beds:1,amenities:["Điều hòa","Nóng lạnh","Bếp riêng","Vệ sinh khép kín","Wifi","Chỗ để xe","Giờ giấc tự do"],image:"https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=75"],note:"Trung tâm khu văn phòng Cầu Giấy, đi làm cực tiện, nhiều tiện ích xung quanh."},
  {id:11,title:"Căn hộ mini cao cấp Hà Đông, full đồ",type:"Chung cư mini",price:5000000,area:30,address:"KĐT Văn Quán",district:"Hà Đông",lat:20.9710,lng:105.7788,beds:1,amenities:["Điều hòa","Nóng lạnh","Máy giặt","Tủ lạnh","Thang máy","Full nội thất","Ban công","Bảo vệ 24/7"],image:"https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=75"],note:"Khu đô thị xanh, yên tĩnh, thích hợp gia đình nhỏ hoặc cặp đôi."},
  {id:12,title:"Phòng trọ rộng có gác, gần Times City",type:"Phòng trọ",price:3500000,area:25,address:"Ngõ 296 Minh Khai",district:"Hai Bà Trưng",lat:20.9970,lng:105.8630,beds:1,amenities:["Điều hòa","Nóng lạnh","Gác xép","Giờ giấc tự do","Wifi","Chỗ để xe","Vệ sinh khép kín"],image:"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=75",images:["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=900&q=75"],note:"Gần Times City, chợ Mơ, thuận tiện mua sắm và di chuyển vào trung tâm."}
];

const AMENITIES = ["Điều hòa","Máy giặt","Thang máy","Full nội thất","Ban công","Bếp riêng","Bảo vệ 24/7","Gác xép","Chỗ để xe","Giờ giấc tự do"];
const FAVS = new Set();

/* ---- helpers ---- */
const fmtPrice = n => (n/1000000).toLocaleString('vi-VN',{maximumFractionDigits:1}) + " triệu";
const fmtFull  = n => Number(n).toLocaleString('vi-VN') + " đ";
const priceLabel = r => (r.price/1000000).toFixed(1).replace('.0','')+'tr';
const uniqueDistricts = () => [...new Set(ROOMS.map(r=>r.district))].sort((a,b)=>a.localeCompare(b,'vi'));
const PLACEHOLDER = "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e2e8f4'/%3E%3Ctext x='50%25' y='50%25' fill='%231E3A8A' font-family='sans-serif' font-size='22' font-weight='700' text-anchor='middle' dominant-baseline='middle'%3EFunhome%3C/text%3E%3C/svg%3E";
/* gán ảnh dự phòng khi ảnh gốc lỗi (tránh nhúng chuỗi vào onerror inline) */
function fhImg(el){ el.onerror=null; el.src=PLACEHOLDER; }

function fillAreaSelects(ids){
  const opts = uniqueDistricts().map(d=>`<option value="${d}">${d}</option>`).join("");
  ids.forEach(id=>{const el=document.getElementById(id); if(el) el.insertAdjacentHTML('beforeend',opts);});
}
function buildAmenChips(rowId, onChange, stateArr){
  const row=document.getElementById(rowId); if(!row) return;
  AMENITIES.forEach(a=>{
    const c=document.createElement('button');
    c.className='chip'; c.textContent=a; c.dataset.amen=a;
    c.onclick=()=>{c.classList.toggle('on');
      const i=stateArr.indexOf(a); if(i>-1) stateArr.splice(i,1); else stateArr.push(a);
      onChange();};
    row.appendChild(c);
  });
}
function cardHTML(r){
  const fav=FAVS.has(r.id)?'on':'';
  return `<div class="card" data-id="${r.id}" onclick="openDetail(${r.id})" onmouseenter="if(window.focusMarker)focusMarker(${r.id})">
    <div class="card-img">
      <img src="${r.image}" alt="${r.title}" loading="lazy" onerror="fhImg(this)">
      <span class="card-type">${r.type}</span>
      <button class="card-fav ${fav}" onclick="event.stopPropagation();toggleFav(${r.id},this)" aria-label="Lưu">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="${fav?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
    </div>
    <div class="card-body">
      <div class="card-price">${fmtPrice(r.price)}<small>/tháng</small></div>
      <div class="card-title">${r.title}</div>
      <div class="card-loc"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${r.address}, ${r.district}</div>
      <div class="card-meta">
        <span class="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 21V8l9-5 9 5v13"/><path d="M3 9h18"/></svg>${r.area} m²</span>
        <span class="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 11h20v7M4 18v2M20 18v2"/></svg>${r.beds} PN</span>
        <span class="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${r.amenities.length} tiện nghi</span>
      </div>
    </div>
  </div>`;
}
function toggleFav(id,btn){
  if(FAVS.has(id))FAVS.delete(id);else FAVS.add(id);
  btn.classList.toggle('on');
  btn.querySelector('svg').setAttribute('fill',FAVS.has(id)?'currentColor':'none');
}

/* ---- detail modal (cần 1 phần tử #detailModal + #detailContent trên trang) ---- */
function openDetail(id){
  const r=ROOMS.find(x=>x.id===id); if(!r) return;
  const check=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
  const gallery=(r.images||[r.image]);
  const thumbs=gallery.map((src,i)=>`<img src="${src}" onclick="document.getElementById('dHero').src='${src}'" style="width:100%;height:70px;object-fit:cover;border-radius:8px;cursor:pointer;border:2px solid ${i===0?'var(--brand-500)':'transparent'}" onerror="this.style.display='none'">`).join("");
  document.getElementById('detailContent').innerHTML=`
    <img id="dHero" class="d-img" src="${gallery[0]}" alt="${r.title}" onerror="fhImg(this)">
    <div class="d-pad">
      ${gallery.length>1?`<div style="display:grid;grid-template-columns:repeat(${Math.min(gallery.length,4)},1fr);gap:8px;margin-bottom:18px">${thumbs}</div>`:''}
      <div class="d-head">
        <div>
          <span class="card-type" style="position:static;display:inline-block;margin-bottom:10px">${r.type}</span>
          <h3>${r.title}</h3>
          <div class="d-loc">📍 ${r.address}, ${r.district}, Hà Nội</div>
        </div>
        <div class="d-price">${fmtPrice(r.price)}<small>/tháng</small></div>
      </div>
      <div class="d-stats">
        <div class="s"><b>${r.area} m²</b><span>Diện tích</span></div>
        <div class="s"><b>${r.beds}</b><span>Phòng ngủ</span></div>
        <div class="s"><b>${r.amenities.length}</b><span>Tiện nghi</span></div>
        <div class="s"><b>${fmtFull(r.price)}</b><span>Giá / tháng</span></div>
      </div>
      <div class="d-sec"><h4>Mô tả</h4><p style="color:var(--body);font-size:14.5px">${r.note}</p></div>
      <div class="d-sec"><h4>Tiện nghi</h4><div class="d-amens">${r.amenities.map(a=>`<div class="a">${check}${a}</div>`).join("")}</div></div>
      <div class="d-actions">
        <a class="btn btn-primary btn-lg" href="tel:${FUNHOME_CONFIG.hotline.replace(/\s/g,'')}">☎ Đặt lịch xem phòng</a>
        <a class="btn btn-ghost btn-lg" target="_blank" href="https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}">Xem trên Google Maps</a>
      </div>
    </div>`;
  openModal('detailModal');
}
function openModal(id){const m=document.getElementById(id);if(m){m.classList.add('open');document.body.style.overflow='hidden';}}
function closeModal(id){const m=document.getElementById(id);if(m){m.classList.remove('open');document.body.style.overflow='';}}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));document.body.style.overflow='';}});

/* ---- nạp dữ liệu từ Google Sheet CSV (nếu có) ---- */
function parseCSV(text){
  const rows=[]; let row=[],cur='',q=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){ if(c==='"'){ if(text[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
    else { if(c==='"')q=true; else if(c===','){row.push(cur);cur='';} else if(c==='\n'){row.push(cur);rows.push(row);row=[];cur='';} else if(c!=='\r')cur+=c; }
  }
  if(cur.length||row.length){row.push(cur);rows.push(row);}
  const head=rows.shift().map(h=>h.trim());
  return rows.filter(r=>r.length>1).map((r,idx)=>{
    const o={}; head.forEach((h,i)=>o[h]=(r[i]||'').trim());
    return {
      id:Number(o.id)||idx+1, title:o.title, type:o.type, price:Number(o.price)||0,
      area:Number(o.area)||0, address:o.address, district:o.district,
      lat:Number(o.lat)||21.028, lng:Number(o.lng)||105.81, beds:Number(o.beds)||1,
      amenities:(o.amenities||'').split(';').map(s=>s.trim()).filter(Boolean),
      image:o.image||PLACEHOLDER, images:(o.image||'').split(';').map(s=>s.trim()).filter(Boolean),
      note:o.note||''
    };
  });
}
async function loadRooms(cb){
  if(FUNHOME_CONFIG.sheetCsv){
    try{ const t=await fetch(FUNHOME_CONFIG.sheetCsv).then(r=>r.text()); const d=parseCSV(t); if(d.length) ROOMS=d; }
    catch(e){ console.warn('Không tải được Google Sheet, dùng dữ liệu mẫu.',e); }
  }
  cb && cb();
}
