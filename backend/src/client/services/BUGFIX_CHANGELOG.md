# Bug Fix: EmailVerification Model Import Error

## Issue
```
ReferenceError: EmailVerification is not defined
    at exports.changeEmail (D:\duong\E_Learning-2\backend\src\client\services\profileClientService.js:245:5)
```

## Root Cause
The `profileClientService.js` was using the `EmailVerification` model in the `changeEmail` and `verifyOtp` functions but had not imported it.

## Files Fixed

### 1. backend/src/client/services/profileClientService.js
**Added missing import:**
```javascript
const { EmailVerification } = require("../../models");
```

**Fixed logic error in verifyOtp:**
```javascript
// Before (incorrect - using old email)
await User.updateUser(emailVerification.user_id, { email });

// After (correct - using new email from verification record)
await User.updateUser(emailVerification.user_id, { email: emailVerification.email });
```

### 2. backend/src/client/routes/profileClientRoutes.js
**Added validation rules:**
```javascript
const changeEmailValidation = [
  body('newEmail')
    .isEmail()
    .withMessage('Email mới không hợp lệ')
    .normalizeEmail(),
  body('currentPassword')
    .notEmpty()
    .withMessage('Mật khẩu hiện tại là bắt buộc')
];

const verifyOtpValidation = [
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP phải có 6 ký tự')
    .isNumeric()
    .withMessage('OTP chỉ chứa số')
];
```

**Applied validation to routes:**
```javascript
router.patch("/change-email", authMiddleware, changeEmailValidation, profileClientController.changeEmail);
router.post("/verify-email", verifyOtpValidation, profileClientController.verifyOtp);
```

### 3. backend/src/client/controllers/profileClientController.js
**Added validation error handling:**
```javascript
// Kiểm tra validation errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    EM: "Dữ liệu không hợp lệ",
    EC: "1",
    DT: errors.array()
  });
}
```

### 4. frontend/Shopery/src/Client/api/Profile/profileApi.js
**Added verifyEmailOtp endpoint:**
```javascript
verifyEmailOtp: async ({ email, otp }) => {
  const res = await axiosInstance.post("/user/verify-email", { email, otp });
  return res.data;
},
```

### 5. frontend/Shopery/src/Client/services/Profile/profileMutations.js
**Added mutation hook:**
```javascript
export const useVerifyEmailOtp = () =>
  useMutation({
    mutationFn: profileApi.verifyEmailOtp,
    onSuccess: (data) => {
      const { EM, EC } = data || {};
      if (EC === "0") toast.success(EM || "Email verified successfully");
      else toast.error(EM || "Verification failed");
    },
    onError: () => toast.error("Verification request failed"),
  });
```

## Testing
The fix resolves the `ReferenceError: EmailVerification is not defined` error and ensures:

1. ✅ `changeEmail` function can create email verification records
2. ✅ `verifyOtp` function can validate OTP and update user email
3. ✅ Proper validation on both frontend and backend
4. ✅ Error handling with meaningful messages

## API Endpoints
- `PATCH /user/change-email` - Send OTP to new email
- `POST /user/verify-email` - Verify OTP and update email

## Flow
1. User calls `changeEmail` with new email and current password
2. System validates password and creates OTP record
3. OTP is sent to new email address
4. User calls `verifyEmailOtp` with email and OTP
5. System validates OTP and updates user's email
6. Verification record is marked as verified
