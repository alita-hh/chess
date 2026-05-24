@echo off
cd /d "%~dp0"
echo ========================================
echo   朝阳区象棋协会 HTML Demo
echo ========================================
echo.
echo 正在启动本地服务器...
echo 启动后请在浏览器打开: http://localhost:8080
echo 按 Ctrl+C 可停止服务器
echo.
py -m http.server 8080
if errorlevel 1 (
  echo.
  echo py 命令失败，尝试 python...
  python -m http.server 8080
)
pause
