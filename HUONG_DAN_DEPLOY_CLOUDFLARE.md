# HƯỚNG DẪN DEPLOY LÊN CLOUDFLARE PAGES

## ✅ TRẢ LỜI CÂU HỎI CỦA BẠN

**Câu hỏi:** Repository E_Learning đang có cả frontend và backend, có bị sao không?

**Trả lời:** 
- ✅ **KHÔNG SAO CẢ!** Bạn có thể để cả frontend và backend trong cùng một repo
- ✅ Cloudflare Pages chỉ build phần **frontend**, không ảnh hưởng đến backend
- ✅ Backend sẽ chạy **local** với Cloudflare Tunnel, không cần deploy lên Pages
- ✅ Chỉ cần cấu hình đúng **Build settings** trong Cloudflare Pages

---

## 📋 CẤU HÌNH CLOUDFLARE PAGES (QUAN TRỌNG)

Khi bạn đã connect GitHub repo `E_Learning` lên Cloudflare Pages, cần cấu hình như sau:

### Bước 1: Vào Build Settings

Sau khi chọn repository `E_Learning`, bạn sẽ thấy màn hình cấu hình:

```
Project name: e-learning-app
```

### Bước 2: Cấu hình Build Settings

**Framework preset:** `Vite` (hoặc để trống)

**Build command:**
```bash
cd frontend/Shopery && npm install && npm run build
```

**Build output directory:**
```
frontend/Shopery/dist
```

**Root directory:** 
```
/ (để trống hoặc `/`)
```

### Bước 3: Environment Variables

Thêm biến môi trường trong Cloudflare Pages:

1. Vào **Settings** → **Environment variables**
2. Thêm biến:
   - **Variable name:** `VITE_API_URL`
   - **Value:** `https://api-your-app.pages.dev` (URL backend sau khi setup Tunnel)
   - **Environment:** Production

**Lưu ý:** 
- Thay `api-your-app.pages.dev` bằng subdomain bạn sẽ dùng cho backend
- Bạn có thể thêm sau khi đã setup Tunnel

### Bước 4: Save and Deploy

Nhấn **Save and Deploy** và đợi build xong.

---

## 🔄 QUY TRÌNH HOÀN CHỈNH

### 1. Frontend (Cloudflare Pages)
- ✅ Code đã có trong repo `E_Learning`
- ✅ Cloudflare Pages sẽ tự động build từ `frontend/Shopery/`
- ✅ URL: `https://e-learning-app.pages.dev`

### 2. Backend (Cloudflare Tunnel - Local)
- ✅ Code đã có trong repo `E_Learning`
- ✅ Chạy **local** trên máy bạn: `cd backend && npm start`
- ✅ Cloudflare Tunnel expose backend ra Internet
- ✅ URL: `https://api-your-app.pages.dev`

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. File .env.production
- File `.env.production` trong `frontend/Shopery/` chỉ để tham khảo
- **Thực tế:** Dùng Environment Variables trong Cloudflare Pages Dashboard
- Cloudflare Pages sẽ tự động inject biến môi trường khi build

### 2. Backend không cần deploy
- Backend **KHÔNG** cần push lên Cloudflare Pages
- Backend chỉ cần:
  - Chạy local: `npm start`
  - Setup Cloudflare Tunnel để expose ra Internet

### 3. Cấu trúc repo hiện tại là OK
```
E_Learning/
├── frontend/
│   └── Shopery/          ← Cloudflare Pages build từ đây
│       ├── src/
│       ├── package.json
│       └── vite.config.js
└── backend/              ← Chạy local với Tunnel
    ├── src/
    └── package.json
```

---

## 🚀 CÁC BƯỚC TIẾP THEO

1. ✅ Đã connect GitHub → Cloudflare Pages
2. ⏭️ Cấu hình Build settings (theo hướng dẫn trên)
3. ⏭️ Deploy Frontend → Có URL: `https://e-learning-app.pages.dev`
4. ⏭️ Setup Cloudflare Tunnel cho Backend
5. ⏭️ Cập nhật `VITE_API_URL` trong Cloudflare Pages Environment Variables
6. ⏭️ Test toàn bộ hệ thống

---

## 📝 TÓM TẮT

- ✅ **KHÔNG CẦN TÁCH REPO** - Giữ nguyên như hiện tại
- ✅ Chỉ cần cấu hình đúng Build settings trong Cloudflare Pages
- ✅ Backend chạy local, không cần deploy lên Pages
- ✅ Frontend deploy tự động qua GitHub → Cloudflare Pages

