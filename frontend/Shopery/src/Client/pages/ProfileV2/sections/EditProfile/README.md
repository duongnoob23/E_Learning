# EditProfile Component

Component cho phép người dùng chỉnh sửa thông tin profile của mình, bao gồm cả việc upload ảnh đại diện. **Chỉ sử dụng React Query, không dùng Redux.**

## Tính năng

### ✅ Đã hoàn thành
- **Hiển thị dữ liệu người dùng**: Nhận user data từ props và hiển thị thông tin hiện tại
- **Upload ảnh đại diện**: Hỗ trợ chọn, preview và upload ảnh với validation
- **Validation**: Kiểm tra kích thước file (max 5MB) và loại file (chỉ ảnh)
- **Auto-refresh UI**: Tự động cập nhật UI sau khi edit thành công
- **React Query only**: Chỉ sử dụng React Query để quản lý state và cache
- **Error handling**: Xử lý lỗi và hiển thị thông báo phù hợp
- **Avatar URL handling**: Xử lý đúng các loại URL (http, data:, relative path)

### 🎨 UI/UX Improvements
- **Avatar preview**: Hiển thị ảnh đại diện hoặc chữ cái đầu nếu không có ảnh
- **File upload button**: Button đẹp thay vì input file mặc định
- **Loading states**: Hiển thị trạng thái loading khi đang cập nhật
- **Form validation**: Validation client-side trước khi submit
- **Reset functionality**: Button khôi phục ảnh gốc

## Cách sử dụng

```jsx
import EditProfile from './sections/EditProfile/EditProfile';

// Sử dụng trong component với user data từ React Query
const ProfilePage = () => {
  const { data: profileData } = useGetProfile();
  const user = profileData?.DT;
  
  return <EditProfile user={user} />;
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| user | Object | Yes | User data object chứa thông tin profile |

### User Object Structure
```javascript
{
  user_id: number,
  username: string,
  full_name: string,
  phone_number: string,
  avatar_url: string,
  email: string,
  // ... other fields
}
```

## Dependencies

- **React Query**: Quản lý API calls và cache
- **React Toastify**: Hiển thị thông báo

## API Integration

Component sử dụng `profileApi.updateProfile` để gửi dữ liệu lên server:

- **Text data**: Gửi dưới dạng JSON object
- **With file**: Gửi dưới dạng FormData với multipart/form-data

## State Management

### React Query Cache
- Invalidate `queryKeys.user.profile` để refetch dữ liệu mới
- Cập nhật cache trực tiếp với `setQueryData` để UI phản hồi ngay
- Không sử dụng Redux store

### Local State
- `form`: Form data (username, full_name, phone_number, avatar_url)
- `avatarFile`: File object cho ảnh upload
- `previewUrl`: URL preview cho ảnh mới chọn

## File Structure

```
EditProfile/
├── EditProfile.jsx          # Main component
├── EditProfile.css          # Styles
└── README.md               # Documentation
```

## Avatar URL Handling

Component xử lý 3 loại avatar URL:
1. **HTTP URLs**: `http://example.com/avatar.jpg`
2. **Data URLs**: `data:image/jpeg;base64,...` (từ FileReader)
3. **Relative paths**: `/uploads/avatar.jpg` (thêm BASE_URL)

## Error Handling

- **File size**: Max 5MB
- **File type**: Chỉ accept image/*
- **Network errors**: Hiển thị toast error
- **Validation errors**: Hiển thị chi tiết lỗi từ server

## Performance

- **Optimistic updates**: Cập nhật cache ngay khi submit thành công
- **File preview**: Sử dụng FileReader để preview ảnh local
- **Efficient re-renders**: Chỉ re-render khi cần thiết

## Browser Support

- Modern browsers hỗ trợ FileReader API
- IE11+ (với polyfills)

## Key Differences from Redux Version

1. **No Redux**: Không sử dụng Redux store
2. **Props-based**: Nhận user data từ props thay vì Redux selector
3. **React Query only**: Chỉ dùng React Query cho state management
4. **Simpler architecture**: Ít dependencies, dễ maintain hơn
