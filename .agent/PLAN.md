# Kế Hoạch Triển Khai (Deploy) Bộ Trình Chiếu 45 Slide Lên Vercel

## 1. Các bước thực hiện
- [x] Bước 1: Kết nối tài khoản Vercel (`team_TZ7mUi0bSaIXSCPlL9Ce6utg`) và GitHub (`KhangTestBot`).
- [x] Bước 2: Đẩy toàn bộ mã nguồn 45 Slide, bộ ảnh thực tế và 5 file video MP4 lên repository `KhangTestBot/pham-nhat-vuong-45-slides`.
- [x] Bước 3: Gọi `create_git_project` / `create_deployment` trên Vercel để phát hành bản Production và kiểm tra trạng thái `READY` (`https://pham-nhat-vuong-45-slides.vercel.app`).
- [x] Bước 4: Gửi đường link Vercel công khai cho người dùng.

## 2. Tinh gọn ~30% chữ & tối ưu bố cục trình chiếu
- [x] Bước 5: Rút gọn ~33% từ thừa trên toàn bộ 45 slide (`slides-data.js`: 14.684 → 9.805 từ), giữ nguyên số liệu & khung Mục 5.1 – 5.4 (UTEHY).
- [x] Bước 6: Sửa toàn bộ lỗi ánh xạ thuộc tính & dọn gọn overlay ảnh/footer trên 12 archetype (`app.js`, `styles.css`).
- [x] Bước 7: Kiểm thử trình duyệt thật trên cả 45 slide (không tràn khung, không lỗi ảnh/chữ) & chụp ảnh kiểm tra trực quan.
- [x] Bước 8: Đồng bộ GitHub (`KhangTestBot/pham-nhat-vuong-45-slides`, commit `e3d1ab4`) — Vercel tự động phát hành bản Production mới lên `https://pham-nhat-vuong-45-slides.vercel.app`.

## 3. Chỉ giữ 1 video Vingroup & nâng lên bản đầy đủ (09:56 HD)
- [x] Bước 9: Gỡ bỏ 4 slide video khác (`vid01, vid02, vid04, vid05`), đánh số lại 41 slide gọn gàng và cập nhật bộ lọc Mục lục (`1 Video Tư liệu`).
- [x] Bước 10: Tải bản đầy đủ `09:56` HD 720p (~40 MB) cho `assets/vid03.mp4` (thay cho bản trích 80 giây trước đây) và kiểm chứng trên Chrome (`596.89s`).
- [x] Bước 11: Đồng bộ GitHub (`f94aa2b`) & xác nhận bản cập nhật live trên `https://pham-nhat-vuong-45-slides.vercel.app` (`01 / 41`, `vid03.mp4` `41614108` bytes HTTP 200).

## 4. Gỡ bỏ thanh badge đầu slide & chân trang (`fs-topbar`, `fs-footer`, chữ UTEHY)
- [x] Bước 12: Xóa `.fs-topbar` (`★ KHUNG BÀI GIẢNG UTEHY` / pill badge) và `.fs-footer` (`Khung bài giảng UTEHY · Ánh xạ...`) trên cả 12 mẫu bố cục & làm sạch nhãn trên `index.html`, `slides-data.js`.
- [x] Bước 13: Kiểm tra lại 41 slide không còn badge/footer thừa & chụp ảnh xác nhận Slide 1, 4, 21, 41 trên Chrome (`720x1280`).
- [x] Bước 14: Đẩy lên GitHub (`caaa6c8`) & xác nhận bản không topbar/footer/UTEHY đã live trên `https://pham-nhat-vuong-45-slides.vercel.app`.

## 5. Bổ sung thiết kế Canva "Xanh Rừng – Kem Sáng" (EAHKpviK2Js) + Trình chuyển chủ đề
- [x] Bước 15: Tích hợp 5 bố cục Canva (`renderCanvaHeroCover`, `renderCanvaClosingHero`, `renderCanvaConcaveArch`, `renderCanvaIntroCutout`, `renderCanvaEditorialCollage`), font `Lora` italic serif + `Oswald` knockout, bảng màu Kem `#FAF8F5` & Xanh Rừng `#132E1B`, cùng bộ chọn chuyển đổi sang Đỏ Hoàng Gia.
- [x] Bước 16: Thay ảnh đúng ngữ cảnh (Quỹ Thiện Tâm, nhà máy VinFast Cát Hải) & dọn nhãn `SLIDE XX`, kiểm thử 41 slide không lỗi trên Chrome.
- [x] Bước 17: Đồng bộ GitHub (`88485aa`) & xác nhận live trên Vercel (`https://pham-nhat-vuong-45-slides.vercel.app`).

## 6. Bổ sung 20 Slide Câu hỏi Trắc nghiệm (Câu hỏi → Đáp án tô đậm màu xanh)
- [x] Bước 18: Tạo đủ 20 slide trắc nghiệm (`Slide 42–61`, `1B – 2C – 3A – 4C – 5B – 6B – 7B – 8A – 9C – 10A`), kèm chế độ lọc `📝 20 Câu hỏi` (`?mode=quiz`) và Mục lục `61 Slide`.
- [x] Bước 19: Kiểm thử trình duyệt cả 20 slide câu hỏi/đáp án (đúng đáp án tô xanh `1B – 2C – 3A – 4C – 5B – 6B – 7B – 8A – 9C – 10A`, khớp `1280×720`).
- [x] Bước 20: Đồng bộ bản offline, quét `gitleaks` (`no leaks found`), đẩy GitHub (`38247f1`) & xác nhận live trên Vercel (`https://pham-nhat-vuong-45-slides.vercel.app/?mode=quiz`).

## 7. Thêm 1 Slide Mở đầu & 1 Slide Thanks for Watching (63 Slide)
- [x] Bước 21: Chèn Slide 01 (`pure_opening` — `PHẠM NHẬT VƯỢNG`) và Slide 63 (`pure_thanks` — `THANKS FOR WATCHING`), cập nhật `s.id` +1 trong `app.js`, đồng bộ `index.html` (`63 Slide`, `43 Slide Bài`) & kiểm thử Chrome `1280×720` (`ISSUES: 0` trên mọi chế độ).
- [x] Bước 22: Đồng bộ bản HTML offline, quét `gitleaks`, đẩy GitHub & xác nhận live trên Vercel.
