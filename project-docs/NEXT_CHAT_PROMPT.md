# Prompt to paste into a new chat (attach omni-convert.zip)
Mình đang làm dự án OMNI CONVERT (website công cụ online miễn phí: Office, Image, Text, Web & Code). Đính kèm là omni-convert.zip chứa toàn bộ dự án.

Hãy làm theo thứ tự:
1. Giải nén, đọc CLAUDE.md, rồi project-docs/PROJECT_STATUS.md, AI_HANDOFF.md, FEATURE_MATRIX.md, DECISIONS.md, BACKLOG.md. Tuân thủ 15 quy tắc trong CLAUDE.md (không bịa trạng thái, không giả lập chuyển đổi, báo cáo trung thực những gì chưa kiểm chứng).
2. Nếu có mạng và npm: chạy `npm install && npm run lint && npm test && npm run build`, kiểm tra thư mục out/, sửa lỗi và ghi kết quả thật vào PROJECT_STATUS/BACKLOG. Nếu không có mạng: chạy `npm test` và bộ test giao diện trong tools/ui-harness (xem README ở đó).
3. Sau đó làm tiếp mục TO DO trong PROJECT_STATUS.md theo thứ tự ưu tiên. Mỗi tool mới: logic thuần trong lib/ + test trong tests/, giao diện + page theo mẫu hiện có (ToolLayout), đăng ký trong lib/tools.ts (chỉ tool chạy thật), chạy lại harness, cập nhật tài liệu (STATUS, FEATURE_MATRIX, CHANGELOG, BACKLOG, FILE_INVENTORY qua scripts/gen-inventory.py, AI_HANDOFF).
4. Khi xong gửi lại zip và ảnh chụp giao diện desktop.
Giao tiếp bằng tiếng Việt. Môi trường triển khai: Cloudflare Pages + Functions + D1.
