# Creatory Booking System

Hệ thống đặt lịch quay cho Creatory Studio - Next.js 14 App Router

## 🚀 Deploy lên Vercel

### Cách 1: Qua GitHub (Khuyến nghị - Auto Deploy)

1. **Push code lên GitHub**
```bash
# Tạo repo mới trên GitHub, sau đó:
git remote add origin https://github.com/YOUR_USERNAME/creatory-booking.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

2. **Connect Vercel**
- Truy cập [vercel.com](https://vercel.com)
- Click "New Project"
- Import repository vừa tạo
- Vercel sẽ tự detect Next.js
- Click "Deploy"

3. **Auto Deploy**
- Mỗi khi push lên GitHub, Vercel sẽ tự động build và deploy
- Không cần làm gì thêm!

### Cách 2: Qua Vercel CLI

```bash
# Cài vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd booking-creatory
vercel

# Deploy production
vercel --prod
```

## 🛠️ Local Development

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/creatory-booking.git
cd creatory-booking

# Install dependencies
npm install

# Run dev server
npm run dev
```

## 📁 Cấu trúc Project

```
booking-creatory/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── calendar/       # Calendar view
│   │   ├── bookings/       # Booking list
│   │   └── checklist/      # Cameraman checklist
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/               # UI primitives
│   ├── booking/          # Booking components
│   ├── calendar/         # Calendar components
│   └── checklist/        # Checklist components
└── lib/                   # Utilities & store
```

## 👥 Demo Users

| Role | Email | Tên |
|------|-------|-----|
| Manager | manager@creatory.vn | Minh Quản Lý |
| Cameraman | dat@creatory.vn | Đạt Camera |
| Content Team | content1@creatory.vn | Trần Thị A |

## 📝 License

MIT
