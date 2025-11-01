@echo off
echo 启动前端服务...

cd /d "%~dp0..\frontend"

echo 检查Node.js依赖...
if not exist "node_modules" (
    echo 安装依赖...
    npm install
)

echo 启动Vue开发服务器...
npm run serve

pause