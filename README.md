# LabMate — Demo đặt và quản lý phòng lab

Ứng dụng demo cho bài Hackathon: tra cứu 5 phòng thí nghiệm, gửi yêu cầu đặt theo ngày/giờ, theo dõi trạng thái và duyệt yêu cầu với vai trò Lab Manager.

## Chạy demo bằng một lệnh

Cần cài **Node.js 22 trở lên** (kèm npm). Tại thư mục `labmate-hackathon`, chạy:

```bash
npm install
npm run dev
```

Mở [http://localhost:5173](http://localhost:5173). Lệnh `npm run dev` khởi động giao diện và API cùng lúc. CSDL SQLite được tạo và seed tự động ở lần chạy đầu tiên.

## Tài khoản demo

Ở màn hình đăng nhập, chọn vai trò để vào nhanh; không cần mật khẩu.

| Vai trò | Tài khoản |
|---|---|
| Sinh viên | `sv01@labmate.vn` |
| Giảng viên | `gv01@labmate.vn` |
| Lab Manager | `ql01@labmate.vn` |

Sinh viên/giảng viên có thể đặt phòng và theo dõi đơn. Lab Manager có thể duyệt/từ chối yêu cầu và xem thống kê.

## API

- `POST /api/auth/login` — đăng nhập demo theo vai trò
- `GET /api/rooms?date=YYYY-MM-DD` — danh sách phòng và lịch đã duyệt
- `GET /api/bookings?userId=1` — đơn của người dùng; bỏ `userId` để xem toàn bộ
- `POST /api/bookings` — tạo yêu cầu đặt phòng
- `PATCH /api/bookings/:id/status` — duyệt hoặc từ chối
- `GET /api/stats` — số đơn và tỷ lệ sử dụng phòng

API chạy tại `http://localhost:4000`. Có thể chạy riêng bằng `npm run start -w server`.

## Cấu trúc

- `server/` — Express API, SQLite, seed, kiểm tra xung đột lịch.
- `client/` — React + Vite, màn hình đăng nhập, danh sách phòng, đơn cá nhân, dashboard quản lý.
- `docs/business_rules.md` — giải thích ba quy tắc nghiệp vụ.
- `docs/erd.svg` — sơ đồ dữ liệu.

> Đây là bản demo hackathon: đăng nhập chỉ dùng để chuyển vai trò, chưa có xác thực mật khẩu hay phân quyền bảo mật production.
