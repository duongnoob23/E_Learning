# 📦 Luồng Thanh Toán Khóa Học - E-Learning Platform

## 🎯 Tổng Quan

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Thêm vào   │───▶│  Xem giỏ    │───▶│  Checkout   │───▶│  Thanh toán │───▶│  Hoàn tất   │
│  giỏ hàng   │    │    hàng     │    │  (Tạo Order)│    │   (VNPay)   │    │  Enrollment │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## 📋 Chi Tiết Từng Bước

### **Bước 1: Thêm Khóa Học Vào Giỏ Hàng**

| Thông tin | Chi tiết |
|-----------|----------|
| **Actor** | User (đã đăng nhập) |
| **Endpoint** | `POST /api/cart/add` |
| **Table** | `carts` |

**Request:**
```json
{
  "course_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đã thêm khóa học vào giỏ hàng",
  "cart_count": 3
}
```

**Validation:**
- ✅ User đã đăng nhập
- ✅ Khóa học tồn tại và đang published
- ✅ User chưa mua khóa học này (kiểm tra `course_enrollments`)
- ✅ Khóa học chưa có trong giỏ hàng

---

### **Bước 2: Xem Giỏ Hàng**

| Thông tin | Chi tiết |
|-----------|----------|
| **Actor** | User |
| **Endpoint** | `GET /api/cart` |
| **Table** | `carts` JOIN `courses` |

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "cart_id": 1,
        "course_id": 123,
        "course_title": "TOEIC 700+",
        "course_image": "/uploads/courses/toeic.jpg",
        "instructor_name": "Nguyễn Văn A",
        "original_price": 1500000,
        "sale_price": 990000
      }
    ],
    "summary": {
      "total_items": 2,
      "subtotal": 1980000,
      "total": 1980000
    }
  }
}
```

---

### **Bước 3: Áp Dụng Mã Giảm Giá (Optional)**

| Thông tin | Chi tiết |
|-----------|----------|
| **Endpoint** | `POST /api/cart/apply-coupon` |
| **Table** | `coupons` |

**Request:**
```json
{
  "coupon_code": "SALE50"
}
```

**Validation:**
- ✅ Mã tồn tại và đang active
- ✅ Còn trong thời hạn (`valid_from` - `valid_until`)
- ✅ Chưa vượt giới hạn sử dụng (`used_count < max_uses`)
- ✅ User chưa dùng quá số lần cho phép (`max_uses_per_user`)
- ✅ Đơn hàng đạt giá trị tối thiểu (`minimum_amount`)

---

### **Bước 4: Checkout - Tạo Đơn Hàng**

| Thông tin | Chi tiết |
|-----------|----------|
| **Endpoint** | `POST /api/orders/checkout` |
| **Tables** | `orders`, `order_items` |

**Request:**
```json
{
  "coupon_code": "SALE50",
  "payment_method": "vnpay",
  "note": "Ghi chú đơn hàng"
}
```

**Backend Process:**
```
1. Validate giỏ hàng không rỗng
2. Validate coupon (nếu có)
3. Tính toán giá:
   - subtotal = SUM(sale_price của các khóa học)
   - discount_amount = tính theo coupon
   - total_amount = subtotal - discount_amount
4. Tạo order_number: ORD-YYYYMMDD-XXXXX
5. INSERT vào bảng `orders`
6. INSERT vào bảng `order_items` (snapshot thông tin khóa học)
7. Xóa giỏ hàng của user
8. Trả về order_id để redirect thanh toán
```

**Response:**
```json
{
  "success": true,
  "data": {
    "order_id": 456,
    "order_number": "ORD-20241207-00001",
    "total_amount": 1485000,
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/..."
  }
}
```

---

### **Bước 5: Thanh Toán VNPay**

| Thông tin | Chi tiết |
|-----------|----------|
| **Endpoint** | `POST /api/payment/create-vnpay-url` |
| **Table** | `payments` (tạo record pending) |

**Luồng VNPay:**
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Backend │────▶│  VNPay   │────▶│  Client  │
│          │     │ Tạo URL  │     │ Gateway  │     │ Redirect │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │◀────│  Backend │◀────│  VNPay   │
│ Success  │     │  IPN     │     │ Callback │
└──────────┘     └──────────┘     └──────────┘
```

**Tạo Payment URL:**
```javascript
// Tham số gửi VNPay
{
  vnp_Version: "2.1.0",
  vnp_Command: "pay",
  vnp_TmnCode: "NFL62W3I",
  vnp_Amount: 148500000, // x100
  vnp_CreateDate: "20241207153000",
  vnp_CurrCode: "VND",
  vnp_IpAddr: "127.0.0.1",
  vnp_Locale: "vn",
  vnp_OrderInfo: "Thanh toan don hang ORD-20241207-00001",
  vnp_OrderType: "billpayment",
  vnp_ReturnUrl: "http://localhost:3000/payment/result",
  vnp_TxnRef: "ORD-20241207-00001",
  vnp_SecureHash: "abc123..."
}
```

---

### **Bước 6: VNPay Callback (IPN)**

| Thông tin | Chi tiết |
|-----------|----------|
| **Endpoint** | `GET /api/payment/vnpay-ipn` |
| **Tables** | `payments`, `orders`, `course_enrollments` |

**VNPay gửi về:**
```
vnp_Amount=148500000
vnp_BankCode=NCB
vnp_BankTranNo=VNP14234560
vnp_CardType=ATM
vnp_OrderInfo=Thanh+toan+don+hang+ORD-20241207-00001
vnp_PayDate=20241207153500
vnp_ResponseCode=00
vnp_TmnCode=NFL62W3I
vnp_TransactionNo=14234560
vnp_TransactionStatus=00
vnp_TxnRef=ORD-20241207-00001
vnp_SecureHash=xyz789...
```

**Backend Process (IPN Handler):**
```
1. Verify SecureHash (chống giả mạo)
2. Kiểm tra vnp_ResponseCode === "00" (thành công)
3. Tìm order theo vnp_TxnRef
4. Kiểm tra amount khớp
5. Nếu thành công:
   a. UPDATE payments SET payment_status = 'completed'
   b. UPDATE orders SET payment_status = 'paid', order_status = 'confirmed'
   c. INSERT course_enrollments cho mỗi khóa học trong order
   d. UPDATE coupons SET used_count = used_count + 1 (nếu có)
6. Response: {"RspCode": "00", "Message": "Confirm Success"}
```

---

### **Bước 7: Redirect User & Hiển Thị Kết Quả**

| Thông tin | Chi tiết |
|-----------|----------|
| **Endpoint** | `GET /api/payment/vnpay-return` |
| **Frontend** | `/payment/result?vnp_TxnRef=...` |

**Frontend hiển thị:**
```
✅ Thanh toán thành công!
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đơn hàng: ORD-20241207-00001
Số tiền: 1,485,000 VND
Ngân hàng: NCB
Mã giao dịch: VNP14234560

Các khóa học đã mua:
• TOEIC 700+ - Luyện thi cấp tốc
• IELTS Writing Task 2

[Bắt đầu học ngay] [Xem đơn hàng]
```

---

## 🗄️ Database Flow Diagram

```
                          CHECKOUT
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                        orders                            │
│  order_id: 456                                          │
│  order_number: ORD-20241207-00001                       │
│  user_id: 1                                             │
│  subtotal: 1980000                                      │
│  discount_amount: 495000                                │
│  total_amount: 1485000                                  │
│  coupon_id: 5                                           │
│  order_status: pending ──────▶ confirmed                │
│  payment_status: pending ────▶ paid                     │
└─────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│      order_items        │    │        payments         │
├─────────────────────────┤    ├─────────────────────────┤
│ item_id: 1              │    │ payment_id: 1           │
│ order_id: 456           │    │ order_id: 456           │
│ course_id: 123          │    │ payment_method: vnpay   │
│ course_title: TOEIC 700+│    │ amount: 1485000         │
│ original_price: 1500000 │    │ transaction_id: VNP123  │
│ sale_price: 990000      │    │ bank_code: NCB          │
│ final_price: 742500     │    │ payment_status: pending │
├─────────────────────────┤    │           ▼             │
│ item_id: 2              │    │        completed        │
│ order_id: 456           │    │ paid_at: 2024-12-07     │
│ course_id: 124          │    └─────────────────────────┘
│ course_title: IELTS     │
│ ...                     │
└─────────────────────────┘
              │
              │ Sau khi payment_status = completed
              ▼
┌─────────────────────────────────────────────────────────┐
│                   course_enrollments                     │
├─────────────────────────────────────────────────────────┤
│ enrollment_id: 101 | user_id: 1 | course_id: 123        │
│ status: active | payment_status: paid                    │
│ payment_amount: 742500 | transaction_id: VNP123         │
├─────────────────────────────────────────────────────────┤
│ enrollment_id: 102 | user_id: 1 | course_id: 124        │
│ status: active | payment_status: paid                    │
│ payment_amount: 742500 | transaction_id: VNP123         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/cart/add` | Thêm khóa học vào giỏ |
| `GET` | `/api/cart` | Xem giỏ hàng |
| `DELETE` | `/api/cart/:course_id` | Xóa khóa học khỏi giỏ |
| `DELETE` | `/api/cart/clear` | Xóa toàn bộ giỏ hàng |
| `POST` | `/api/cart/apply-coupon` | Áp dụng mã giảm giá |
| `POST` | `/api/orders/checkout` | Tạo đơn hàng |
| `GET` | `/api/orders` | Lịch sử đơn hàng của user |
| `GET` | `/api/orders/:id` | Chi tiết đơn hàng |
| `POST` | `/api/payment/create-vnpay-url` | Tạo URL thanh toán VNPay |
| `GET` | `/api/payment/vnpay-return` | VNPay redirect về frontend |
| `GET` | `/api/payment/vnpay-ipn` | VNPay IPN callback |

---

## ⚠️ Xử Lý Lỗi & Edge Cases

### 1. Thanh toán thất bại
```
vnp_ResponseCode !== "00"
├── UPDATE payments SET payment_status = 'failed'
├── UPDATE orders SET payment_status = 'failed'
└── KHÔNG tạo course_enrollments
```

### 2. User hủy thanh toán
```
vnp_ResponseCode === "24" (User cancelled)
├── UPDATE orders SET order_status = 'cancelled'
└── Cho phép user thử lại thanh toán
```

### 3. Duplicate IPN (VNPay gửi nhiều lần)
```
Kiểm tra orders.payment_status
├── Nếu đã 'paid' → Response {"RspCode": "02", "Message": "Order already confirmed"}
└── Không xử lý lại
```

### 4. Khóa học đã mua
```
Trước khi checkout:
├── Kiểm tra course_enrollments
├── Nếu đã có → Loại khỏi giỏ hàng
└── Thông báo user
```

### 5. Coupon hết hạn khi checkout
```
├── Validate lại coupon
├── Nếu invalid → Xóa coupon, tính lại giá
└── Thông báo user
```

---

## 🔐 Bảo Mật

| Vấn đề | Giải pháp |
|--------|-----------|
| Giả mạo callback | Verify `vnp_SecureHash` với secret key |
| Sửa đổi amount | So sánh `vnp_Amount` với `orders.total_amount` |
| Replay attack | Kiểm tra `order.payment_status` trước khi xử lý |
| SQL Injection | Sử dụng Sequelize ORM với parameterized queries |

---

## 📊 Admin Dashboard Features

### Quản lý đơn hàng
- Danh sách đơn hàng (filter theo status, date, user)
- Chi tiết đơn hàng
- Thay đổi trạng thái đơn hàng
- Xử lý hoàn tiền

### Thống kê
- Doanh thu theo ngày/tuần/tháng
- Khóa học bán chạy nhất
- Tỷ lệ thanh toán thành công/thất bại
- Phương thức thanh toán phổ biến

### API Admin
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/admin/orders` | Danh sách tất cả đơn hàng |
| `GET` | `/api/admin/orders/:id` | Chi tiết đơn hàng |
| `PUT` | `/api/admin/orders/:id/status` | Cập nhật trạng thái |
| `POST` | `/api/admin/orders/:id/refund` | Hoàn tiền |
| `GET` | `/api/admin/orders/statistics` | Thống kê doanh thu |
| `GET` | `/api/admin/payments` | Lịch sử thanh toán |

---

## 🚀 Checklist Triển Khai

### Database
- [ ] Tạo bảng `orders`
- [ ] Tạo bảng `order_items`
- [ ] Tạo bảng `payments`
- [ ] Tạo bảng `carts`
- [ ] Tạo Sequelize Models

### Backend
- [ ] Cart Controller & Routes
- [ ] Order Controller & Routes
- [ ] Payment Controller (VNPay integration)
- [ ] Middleware xác thực
- [ ] Validation schemas

### Frontend (Client)
- [ ] Trang giỏ hàng (`/cart`)
- [ ] Trang checkout (`/checkout`)
- [ ] Trang kết quả thanh toán (`/payment/result`)
- [ ] Component thêm vào giỏ hàng
- [ ] Lịch sử đơn hàng (`/orders`)

### Frontend (Admin)
- [ ] Danh sách đơn hàng
- [ ] Chi tiết đơn hàng
- [ ] Thống kê doanh thu
- [ ] Quản lý thanh toán

---

## 📝 Ghi Chú

1. **VNPay Sandbox**: Sử dụng môi trường test trước khi go live
2. **Webhook retry**: VNPay sẽ retry IPN nếu không nhận được response 200
3. **Timezone**: Đảm bảo server timezone là UTC+7 (Vietnam)
4. **Amount format**: VNPay yêu cầu amount x100 (không có số thập phân)

---

*Cập nhật lần cuối: 2024-12-07*

