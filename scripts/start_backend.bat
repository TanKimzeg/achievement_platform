@echo off
echo 启动后端服务...

cd /d "%~dp0..\backend"

echo 检查虚拟环境...
if not exist "venv" (
    echo 创建虚拟环境...
    python -m venv venv
)

echo 激活虚拟环境...
call venv\Scripts\activate

echo 安装依赖...
pip3 install -r requirements.txt

echo 设置环境变量...
set FLASK_APP=run.py
set FLASK_ENV=development

echo 启动Flask应用...
python run.py

pause