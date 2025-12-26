# 📚 Tài Liệu API Thanh Toán - Payment & VNPay

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cấu Hình](#cấu-hình)
3. [API Endpoints](#api-endpoints)
4. [Flow Thanh Toán](#flow-thanh-toán)
5. [Cấu Trúc Dữ Liệu](#cấu-trúc-dữ-liệu)
6. [Xử Lý Lỗi](#xử-lý-lỗi)
7. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)

---

## 🎯 Tổng Quan

Hệ thống thanh toán sử dụng **VNPay** làm cổng thanh toán chính, hỗ trợ thanh toán trực tuyến cho các khóa học trên nền tảng.

### Tính Năng Chính

- ✅ Tạo đơn hàng và thanh toán qua VNPay
- ✅ Xử lý callback từ VNPay (IPN và Return URL)
- ✅ Hỗ trợ áp dụng mã giảm giá (Coupon)
- ✅ Tự động tạo CourseEnrollment sau khi thanh toán thành công
- ✅ Lịch sử đơn hàng và tra cứu đơn hàng
- ✅ Xác thực checksum để đảm bảo an toàn

### Base URL

```
http://localhost:5000/payment
```

---

## ⚙️ Cấu Hình

### File Cấu Hình: `backend/src/config/paymentConfig.json`

```json
{
  "vnp_TmnCode": "NFL62W3I",
  "vnp_HashSecret": "VWS4EUF0N4J7MGVPKLQDPGZ6MG8G4NRE",
  "vnp_Url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "vnp_ReturnUrl": "http://localhost:5000/payment/vnpay_return",
  "vnp_IpnUrl": "https://unorbitally-polyneuritic-becky.ngrok-free.dev/payment/vnpay_ipn",
  "vnp_Env": "sandbox",
  "vnp_ExpireAfter": 15,
  "vnp_OrderPrefix": "PAY",
  "frontend_Url": "http://localhost:3000",
  "backend_Url": "http://localhost:5000"
}
```

### Environment Variables

- `FRONTEND_URL`: URL frontend để redirect sau khi thanh toán (mặc định: `http://localhost:3000`)

### Các Tham Số VNPay

| Tham Số | Mô Tả |
|---------|-------|
| `vnp_TmnCode` | Mã website của merchant trên hệ thống VNPay |
| `vnp_HashSecret` | Secret key để tạo và verify checksum |
| `vnp_Url` | URL cổng thanh toán VNPay (sandbox/production) |
| `vnp_ReturnUrl` | URL redirect user về sau khi thanh toán |
| `vnp_IpnUrl` | URL callback server-to-server từ VNPay |
| `vnp_Env` | Môi trường: `sandbox` hoặc `production` |
| `vnp_ExpireAfter` | Thời gian hết hạn đơn hàng (phút) |

---

## 🔌 API Endpoints

### 1. Tạo Đơn Hàng và Payment URL

**Endpoint:** `POST /payment/order`

**Authentication:** ✅ Required (Bearer Token)

**Request Body:**

```json
{
  "courses": [
    {
      "course_id": 1
    },
    {
      "course_id": 2
    }
  ],
  "coupon_code": "DISCOUNT10" // Optional
}
```

**Response Success (200):**

```json
{
  "code": "success",
  "message": "Tạo đơn hàng thành công",
  "data": {
    "order_id": 123,
    "order_number": "ORD-20241215-00123",
    "subtotal": 500000,
    "discount_amount": 50000,
    "total_amount": 450000,
    "payment_url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=45000000&vnp_Command=pay&..."
  }
}
```

**Response Error (400):**

```json
{
  "code": "error",
  "message": "Không có khóa học nào được chọn"
}
```

**Response Error (401):**

```json
{
  "code": "error",
  "message": "Vui lòng đăng nhập để thanh toán"
}
```

**Logic Xử Lý:**

1. Validate danh sách khóa học
2. Kiểm tra user đã mua khóa học chưa
3. Tính tổng tiền (subtotal)
4. Áp dụng coupon nếu có
5. Tạo Order trong database
6. Tạo OrderItem cho mỗi khóa học
7. Tạo Payment record (status: pending)
8. Tạo VNPay payment URL
9. Trả về payment URL để redirect user

---

### 2. Lấy Lịch Sử Đơn Hàng

**Endpoint:** `GET /payment/orders`

**Authentication:** ✅ Required (Bearer Token)

**Response Success (200):**

```json
{
  "code": "success",
  "data": [
    {
      "order_id": 123,
      "order_number": "ORD-20241215-00123",
      "user_id": 8,
      "subtotal": 500000,
      "discount_amount": 50000,
      "total_amount": 450000,
      "order_status": "confirmed",
      "payment_status": "paid",
      "payment_method": "vnpay",
      "paid_at": "2024-12-15T10:30:00.000Z",
      "created_at": "2024-12-15T10:25:00.000Z",
      "items": [
        {
          "order_item_id": 1,
          "course_id": 1,
          "course_title": "Khóa học tiếng Anh cơ bản",
          "course_image": "https://...",
          "original_price": 500000,
          "sale_price": 500000,
          "final_price": 450000
        }
      ],
      "payments": [
        {
          "payment_id": 1,
          "payment_method": "vnpay",
          "amount": 450000,
          "currency": "VND",
          "payment_status": "completed",
          "transaction_id": "12345678",
          "paid_at": "2024-12-15T10:30:00.000Z"
        }
      ]
    }
  ]
}
```

**Response Error (401):**

```json
{
  "code": "error",
  "message": "Vui lòng đăng nhập"
}
```

---

### 3. Lấy Thông Tin Đơn Hàng Theo Order Number

**Endpoint:** `GET /payment/order/:orderNumber`

**Authentication:** ❌ Not Required

**Path Parameters:**

- `orderNumber`: Số đơn hàng (ví dụ: `ORD-20241215-00123`)

**Response Success (200):**

```json
{
  "code": "success",
  "data": {
    "order_id": 123,
    "order_number": "ORD-20241215-00123",
    "user_id": 8,
    "subtotal": 500000,
    "discount_amount": 50000,
    "total_amount": 450000,
    "order_status": "confirmed",
    "payment_status": "paid",
    "payment_method": "vnpay",
    "paid_at": "2024-12-15T10:30:00.000Z",
    "created_at": "2024-12-15T10:25:00.000Z",
    "items": [...],
    "payments": [...]
  }
}
```

**Response Error (404):**

```json
{
  "code": "error",
  "message": "Không tìm thấy đơn hàng"
}
```

---

### 4. VNPay IPN Callback (Server-to-Server)

**Endpoint:** `GET /payment/vnpay_ipn`

**Authentication:** ❌ Not Required (VNPay gọi trực tiếp)

**Query Parameters:** (VNPay tự động gửi)

```
?vnp_Amount=45000000
&vnp_BankCode=NCB
&vnp_BankTranNo=VNP12345678
&vnp_CardType=ATM
&vnp_OrderInfo=Thanh+toan+don+hang+ORD-20241215-00123
&vnp_PayDate=20241215103000
&vnp_ResponseCode=00
&vnp_TmnCode=NFL62W3I
&vnp_TransactionNo=12345678
&vnp_TransactionStatus=00
&vnp_TxnRef=ORD-20241215-00123
&vnp_SecureHash=abc123...
```

**Response Success (200):**

```json
{
  "RspCode": "00",
  "Message": "Success"
}
```

**Response Error (200):** (VNPay yêu cầu luôn trả về 200)

```json
{
  "RspCode": "97",
  "Message": "Invalid Checksum"
}
```

**Logic Xử Lý:**

1. Verify checksum từ VNPay
2. Nếu checksum hợp lệ → Trả về `RspCode: "00"`
3. Nếu checksum không hợp lệ → Trả về `RspCode: "97"`
4. **Lưu ý:** IPN chỉ verify checksum, không xử lý thanh toán (xử lý ở Return URL)

---

### 5. VNPay Return URL (User Redirect)

**Endpoint:** `GET /payment/vnpay_return`

**Authentication:** ❌ Not Required (User redirect từ VNPay)

**Query Parameters:** (VNPay tự động redirect với query params)

```
?vnp_Amount=45000000
&vnp_BankCode=NCB
&vnp_BankTranNo=VNP12345678
&vnp_CardType=ATM
&vnp_OrderInfo=Thanh+toan+don+hang+ORD-20241215-00123
&vnp_PayDate=20241215103000
&vnp_ResponseCode=00
&vnp_TmnCode=NFL62W3I
&vnp_TransactionNo=12345678
&vnp_TransactionStatus=00
&vnp_TxnRef=ORD-20241215-00123
&vnp_SecureHash=abc123...
```

**Response:** Redirect đến Frontend

**Success Redirect:**

```
http://localhost:3000?orderNumber=ORD-20241215-00123&amount=450000&transactionId=12345678
```

**Failed Redirect:**

```
http://localhost:3000/payment/failed?orderNumber=ORD-20241215-00123&code=07&message=Giao+dịch+bị+nghi+ngờ
```

**Logic Xử Lý:**

1. Verify checksum từ VNPay
2. Nếu checksum không hợp lệ → Redirect đến `/payment/failed`
3. Nếu checksum hợp lệ:
   - Gọi `processPaymentSuccess()` để xử lý thanh toán
   - Nếu thành công (`responseCode === "00"`):
     - Update Order: `payment_status = "paid"`, `order_status = "confirmed"`
     - Update Payment: `payment_status = "completed"`
     - Tạo CourseEnrollment cho mỗi khóa học
     - Update coupon `used_count` (nếu có)
     - Update Course `total_students`
     - Redirect đến frontend với query params
   - Nếu thất bại:
     - Update Order: `payment_status = "failed"`
     - Update Payment: `payment_status = "failed"`
     - Redirect đến `/payment/failed` với thông tin lỗi

---

### 6. Legacy: Tạo Payment URL (ZaloPay - Giữ lại để tương thích)

**Endpoint:** `POST /payment/zalopay/create_payment_url`

**Authentication:** ✅ Required (Bearer Token)

**Request Body:**

```json
{
  "amount": 450000,
  "orderDescription": "Thanh toan don hang",
  "orderType": "billpayment",
  "bankCode": "NCB", // Optional
  "language": "vn" // Optional
}
```

**Response Success (200):**

```json
{
  "code": "success",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
}
```

---

## 🔄 Flow Thanh Toán

### Sơ Đồ Flow

```
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 1. POST /payment/order
     │    { courses: [...], coupon_code: "..." }
     │
     ▼
┌─────────────┐
│   Backend   │
│  - Tạo Order│
│  - Tạo URL  │
└────┬────────┘
     │
     │ 2. Response: { payment_url: "..." }
     │
     ▼
┌─────────┐
│ Client  │
└────┬────┘
     │
     │ 3. Redirect user đến payment_url
     │
     ▼
┌─────────┐
│  VNPay  │
│ Gateway │
└────┬────┘
     │
     │ 4. User thanh toán
     │
     ├─────────────────┐
     │                 │
     ▼                 ▼
┌──────────┐    ┌─────────────┐
│ IPN URL  │    │ Return URL  │
│ (Server) │    │  (Browser)  │
└──────────┘    └──────┬───────┘
     │                 │
     │ 5. Verify       │ 6. Verify + Process
     │    Checksum    │    Payment
     │                 │
     │ 7. Response     │ 7. Redirect to Frontend
     │    RspCode: 00  │    ?orderNumber=...
     │                 │
     ▼                 ▼
┌─────────┐      ┌─────────┐
│  VNPay  │      │ Client  │
│ Server  │      │ (Show   │
│         │      │ Result) │
└─────────┘      └─────────┘
```

### Chi Tiết Từng Bước

#### Bước 1: Client Tạo Đơn Hàng

```javascript
// Frontend
const response = await axios.post('/payment/order', {
  courses: [{ course_id: 1 }, { course_id: 2 }],
  coupon_code: 'DISCOUNT10'
}, {
  headers: { Authorization: `Bearer ${token}` }
});

const { payment_url } = response.data.data;
window.location.href = payment_url; // Redirect đến VNPay
```

#### Bước 2: User Thanh Toán Trên VNPay

- User nhập thông tin thẻ/ngân hàng
- VNPay xử lý thanh toán

#### Bước 3: VNPay Gọi IPN (Server-to-Server)

- VNPay gọi `GET /payment/vnpay_ipn` với query params
- Backend verify checksum và trả về `RspCode: "00"`

#### Bước 4: VNPay Redirect User Về Return URL

- VNPay redirect user đến `GET /payment/vnpay_return`
- Backend:
  - Verify checksum
  - Xử lý thanh toán (update DB, tạo enrollment)
  - Redirect user về frontend

#### Bước 5: Frontend Hiển Thị Kết Quả

```javascript
// Frontend nhận query params từ URL
const urlParams = new URLSearchParams(window.location.search);
const orderNumber = urlParams.get('orderNumber');
const amount = urlParams.get('amount');

if (orderNumber) {
  // Thanh toán thành công
  showSuccessPage(orderNumber, amount);
} else {
  // Thanh toán thất bại
  const code = urlParams.get('code');
  const message = urlParams.get('message');
  showFailedPage(code, message);
}
```

---

## 📊 Cấu Trúc Dữ Liệu

### Order Model

```javascript
{
  order_id: BIGINT (PK, Auto Increment),
  order_number: STRING(50) (Unique),
  user_id: BIGINT (FK -> users),
  subtotal: DECIMAL(12, 2),
  discount_amount: DECIMAL(12, 2),
  total_amount: DECIMAL(12, 2),
  coupon_id: BIGINT (FK -> coupons, Nullable),
  coupon_code: STRING(50) (Nullable),
  order_status: ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded'),
  payment_status: ENUM('pending', 'paid', 'failed', 'refunded'),
  payment_method: STRING(50),
  note: TEXT (Nullable),
  ip_address: STRING(45),
  user_agent: TEXT,
  paid_at: DATE (Nullable),
  cancelled_at: DATE (Nullable),
  created_at: DATE,
  updated_at: DATE
}
```

### Payment Model

```javascript
{
  payment_id: BIGINT (PK, Auto Increment),
  order_id: BIGINT (FK -> orders),
  user_id: BIGINT (FK -> users),
  payment_method: ENUM('vnpay', 'momo', 'zalopay', 'bank_transfer', 'cod', 'free'),
  amount: DECIMAL(12, 2),
  currency: STRING(10) (Default: 'VND'),
  transaction_id: STRING(100) (Nullable),
  transaction_ref: STRING(100) (Nullable),
  bank_code: STRING(50) (Nullable),
  bank_trans_no: STRING(100) (Nullable),
  card_type: STRING(50) (Nullable),
  payment_status: ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'),
  response_code: STRING(10) (Nullable),
  response_message: STRING(255) (Nullable),
  payment_data: JSON (Nullable),
  refund_amount: DECIMAL(12, 2) (Nullable),
  refund_reason: TEXT (Nullable),
  refunded_at: DATE (Nullable),
  paid_at: DATE (Nullable),
  created_at: DATE,
  updated_at: DATE
}
```

### OrderItem Model

```javascript
{
  order_item_id: BIGINT (PK, Auto Increment),
  order_id: BIGINT (FK -> orders),
  course_id: BIGINT (FK -> courses),
  course_title: STRING(255),
  course_image: STRING(500),
  course_slug: STRING(255),
  instructor_name: STRING(255),
  original_price: DECIMAL(12, 2),
  sale_price: DECIMAL(12, 2),
  final_price: DECIMAL(12, 2),
  created_at: DATE
}
```

### VNPay Query Parameters

| Parameter | Mô Tả | Ví Dụ |
|-----------|-------|-------|
| `vnp_Amount` | Số tiền (x100, không có dấu phẩy) | `45000000` (450,000 VND) |
| `vnp_BankCode` | Mã ngân hàng | `NCB`, `VISA`, `MASTERCARD` |
| `vnp_BankTranNo` | Mã giao dịch ngân hàng | `VNP12345678` |
| `vnp_CardType` | Loại thẻ | `ATM`, `CREDIT`, `DEBIT` |
| `vnp_OrderInfo` | Mô tả đơn hàng | `Thanh toan don hang ORD-20241215-00123` |
| `vnp_PayDate` | Ngày thanh toán (YYYYMMDDHHmmss) | `20241215103000` |
| `vnp_ResponseCode` | Mã phản hồi | `00` (thành công) |
| `vnp_TmnCode` | Mã website merchant | `NFL62W3I` |
| `vnp_TransactionNo` | Mã giao dịch VNPay | `12345678` |
| `vnp_TransactionStatus` | Trạng thái giao dịch | `00` (thành công) |
| `vnp_TxnRef` | Mã tham chiếu (order_number) | `ORD-20241215-00123` |
| `vnp_SecureHash` | Checksum để verify | `abc123...` |

---

## ⚠️ Xử Lý Lỗi

### VNPay Response Codes

| Code | Mô Tả |
|------|-------|
| `00` | Giao dịch thành công |
| `07` | Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường) |
| `09` | Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking |
| `10` | Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần |
| `11` | Đã hết hạn chờ thanh toán |
| `12` | Thẻ/Tài khoản bị khóa |
| `13` | Nhập sai mật khẩu xác thực (OTP) |
| `24` | Khách hàng hủy giao dịch |
| `51` | Tài khoản không đủ số dư |
| `65` | Tài khoản đã vượt quá hạn mức giao dịch trong ngày |
| `75` | Ngân hàng thanh toán đang bảo trì |
| `79` | Nhập sai mật khẩu thanh toán quá số lần quy định |
| `97` | Invalid Checksum |
| `99` | Lỗi không xác định |

### Error Handling trong Code

#### 1. Checksum Verification Failed

```javascript
// IPN hoặc Return URL
if (!isValid) {
  return res.status(200).json({
    RspCode: "97",
    Message: "Invalid Checksum"
  });
}
```

#### 2. Order Not Found

```javascript
if (!order) {
  throw new Error(`Không tìm thấy đơn hàng: ${orderNumber}`);
}
```

#### 3. Amount Mismatch

```javascript
if (Math.abs(amount - parseFloat(order.total_amount)) > 1) {
  throw new Error(`Số tiền không khớp: VNPay=${amount}, Order=${order.total_amount}`);
}
```

#### 4. Duplicate Payment

```javascript
if (order.payment_status === "paid") {
  return {
    success: true,
    message: "Đơn hàng đã được xử lý",
    order
  };
}
```

#### 5. User Already Bought Course

```javascript
if (existingEnrollments.length > 0) {
  const boughtCourseIds = existingEnrollments.map(e => e.course_id);
  throw new Error(`Bạn đã mua các khóa học: ${boughtCourseIds.join(", ")}`);
}
```

---

## 💡 Ví Dụ Sử Dụng

### 1. Frontend: Tạo Đơn Hàng và Thanh Toán

```javascript
// paymentApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const paymentApi = {
  // Tạo đơn hàng
  createOrder: async (courses, couponCode = null) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.post(
      `${API_BASE_URL}/payment/order`,
      {
        courses: courses.map(c => ({ course_id: c.course_id })),
        coupon_code: couponCode
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  },

  // Lấy lịch sử đơn hàng
  getMyOrders: async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `${API_BASE_URL}/payment/orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data.data;
  },

  // Lấy thông tin đơn hàng
  getOrderByNumber: async (orderNumber) => {
    const response = await axios.get(
      `${API_BASE_URL}/payment/order/${orderNumber}`
    );
    return response.data.data;
  }
};

// Component: CheckoutPage.jsx
import { paymentApi } from './api/paymentApi';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const selectedCourses = [/* ... */];
  const couponCode = 'DISCOUNT10';

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const result = await paymentApi.createOrder(selectedCourses, couponCode);
      
      // Redirect đến VNPay
      window.location.href = result.payment_url;
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      alert(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Đang xử lý...' : 'Thanh toán'}
    </button>
  );
};
```

### 2. Frontend: Xử Lý Kết Quả Thanh Toán

```javascript
// PaymentResultPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { paymentApi } from './api/paymentApi';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get('orderNumber');
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    if (orderNumber) {
      // Thanh toán thành công
      loadOrder(orderNumber);
    } else if (code) {
      // Thanh toán thất bại
      setOrder({ error: true, code, message });
      setLoading(false);
    }
  }, [searchParams]);

  const loadOrder = async (orderNumber) => {
    try {
      const orderData = await paymentApi.getOrderByNumber(orderNumber);
      setOrder(orderData);
    } catch (error) {
      console.error('Lỗi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (order?.error) {
    return (
      <div>
        <h2>Thanh toán thất bại</h2>
        <p>Mã lỗi: {order.code}</p>
        <p>Thông báo: {order.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Thanh toán thành công!</h2>
      <p>Đơn hàng: {order.order_number}</p>
      <p>Tổng tiền: {order.total_amount.toLocaleString('vi-VN')} VND</p>
      <p>Trạng thái: {order.payment_status}</p>
    </div>
  );
};
```

### 3. Backend: Test IPN Callback

```bash
# Test IPN với curl
curl "http://localhost:5000/payment/vnpay_ipn?vnp_Amount=45000000&vnp_BankCode=NCB&vnp_ResponseCode=00&vnp_TxnRef=ORD-20241215-00123&vnp_SecureHash=..."
```

### 4. Backend: Verify Checksum

```javascript
// paymentClientService.js
exports.verifyIpn = (vnpParams) => {
  const params = { ...vnpParams };
  const secureHash = params["vnp_SecureHash"];
  
  delete params["vnp_SecureHash"];
  delete params["vnp_SecureHashType"];
  
  const sortedParams = sortObject(params);
  const signData = querystring.stringify(sortedParams, { encode: false });
  const secretKey = config.vnp_HashSecret;
  
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  
  return {
    isValid: signed === secureHash,
    data: params
  };
};
```

---

## 🔒 Bảo Mật

### 1. Checksum Verification

- Tất cả request từ VNPay đều phải verify checksum
- Checksum được tạo bằng HMAC SHA512 với secret key
- Nếu checksum không hợp lệ → Từ chối request

### 2. Amount Validation

- So sánh số tiền từ VNPay với số tiền trong Order
- Nếu không khớp → Từ chối thanh toán

### 3. Duplicate Payment Prevention

- Kiểm tra `payment_status === "paid"` trước khi xử lý
- Tránh xử lý trùng lặp khi VNPay gọi nhiều lần

### 4. Transaction Management

- Sử dụng database transaction để đảm bảo tính nhất quán
- Rollback nếu có lỗi trong quá trình xử lý

---

## 📝 Ghi Chú Quan Trọng

1. **IPN vs Return URL:**
   - IPN: Server-to-server callback, chỉ verify checksum
   - Return URL: Browser redirect, xử lý thanh toán và redirect user

2. **Order Number Format:**
   - Format: `ORD-YYYYMMDD-XXXXX`
   - Ví dụ: `ORD-20241215-00123`

3. **Amount Format:**
   - VNPay yêu cầu amount x100 (không có dấu phẩy)
   - Ví dụ: 450,000 VND → `45000000`

4. **Checksum:**
   - Phải sort params theo key trước khi tạo hash
   - Encode giá trị trước khi tạo signData
   - Sử dụng HMAC SHA512

5. **Environment:**
   - Sandbox: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html`
   - Production: `https://www.vnpayment.vn/paymentv2/vpcpay.html`

---

## 🔗 Tài Liệu Tham Khảo

- [VNPay Integration Guide](https://sandbox.vnpayment.vn/apis/)
- [VNPay Response Codes](https://sandbox.vnpayment.vn/apis/docs/loai-hang-thong-bao/)

---

## 📞 Liên Hệ

Nếu có thắc mắc hoặc cần hỗ trợ, vui lòng liên hệ team phát triển.

---

**Tài liệu được cập nhật lần cuối:** 2024-12-15

