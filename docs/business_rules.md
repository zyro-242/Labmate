# Quy tắc nghiệp vụ LabMate

## 1. Ai được đặt phòng?

Sinh viên và giảng viên có thể gửi yêu cầu đặt phòng. Yêu cầu được lưu ở trạng thái **Chờ duyệt**; Lab Manager là vai trò xét duyệt hoặc từ chối. Lab Manager dùng bảng điều khiển để xử lý yêu cầu và xem thống kê. Bản demo cung cấp một tài khoản mẫu cho mỗi vai trò, không yêu cầu mật khẩu.

## 2. Khi nào hai lịch bị trùng?

Hai lịch của cùng một phòng trong cùng một ngày bị xem là trùng khi khoảng thời gian giao nhau. Công thức kiểm tra là `giờ_bắt_đầu_mới < giờ_kết_thúc_cũ && giờ_kết_thúc_mới > giờ_bắt_đầu_cũ`. Vì vậy, lịch 09:00–10:00 và 10:00–11:00 được phép đặt liền nhau; lịch 09:00–10:30 và 10:00–11:00 thì không.

Khung giờ nhận đặt là 08:00–18:00. Đơn đang chờ duyệt và đơn đã duyệt đều giữ chỗ, tránh nhiều người cùng gửi yêu cầu cho một khung giờ. Đơn bị từ chối không còn giữ chỗ. Máy chủ kiểm tra lại xung đột lúc gửi yêu cầu và lúc duyệt.

## 3. Lịch nào được hiển thị và thống kê?

Lịch ở trang danh sách phòng chỉ hiển thị các đơn đã duyệt để người dùng nhận biết thời gian phòng chắc chắn được sử dụng. Danh sách cá nhân hiển thị cả đơn chờ duyệt, đã duyệt và bị từ chối. Bảng điều khiển hiển thị tất cả đơn và cho phép xử lý đơn đang chờ.

Biểu đồ tính tổng thời lượng của các đơn đã duyệt trong tuần hiện tại (5 ngày làm việc), so với công suất tham chiếu 8 giờ/ngày × 5 ngày. Tỷ lệ được giới hạn tối đa 100%.

## Dữ liệu demo

- Sinh viên: `sv01@labmate.vn`
- Giảng viên: `gv01@labmate.vn`
- Lab Manager: `ql01@labmate.vn`
- Có 5 phòng lab và một số lịch mẫu; ngày của lịch mẫu được tính tương đối từ ngày chạy seed.
