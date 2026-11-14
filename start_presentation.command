#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

PORT=8765
while lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

URL="http://127.0.0.1:${PORT}/index.html"
echo "=============================================================="
echo " Đang khởi chạy Bài trình bày Web Tương tác (40 Màn · 5 Video)"
echo " Thư mục : $DIR"
echo " Địa chỉ : $URL"
echo " Đóng cửa sổ Terminal này hoặc nhấn Ctrl+C để dừng máy chủ."
echo "=============================================================="

(sleep 1 && open "$URL") &
python3 -m http.server "$PORT"
