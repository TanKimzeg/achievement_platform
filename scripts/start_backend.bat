@echo off
chcp 65001 >nul
title 中国人民公安大学学生成果管理系统 - 后端服务

echo ========================================
echo   中国人民公安大学学生成果管理系统
echo   后端服务启动脚本
echo ========================================
echo.

cd /d "%~dp0..\backend"

echo [1/6] 检查虚拟环境...
if not exist "venv" (
    echo [INFO] 虚拟环境不存在，正在创建...
    python -m venv venv
    if errorlevel 1 (
        echo [ERROR] 创建虚拟环境失败，请检查Python安装
        pause
        exit /b 1
    )
    echo [SUCCESS] 虚拟环境创建成功
) else (
    echo [INFO] 虚拟环境已存在
)

echo.
echo [2/6] 激活虚拟环境...
call venv\Scripts\activate
if errorlevel 1 (
    echo [ERROR] 激活虚拟环境失败
    pause
    exit /b 1
)
echo [SUCCESS] 虚拟环境激活成功

echo.
echo [3/6] 检查依赖包...
call pip3 install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] 安装依赖包失败
    pause
    exit /b 1
)
echo [SUCCESS] 依赖包安装完成

echo.
echo [4/6] 设置环境变量...
set FLASK_APP=run.py
set FLASK_ENV=development
echo [SUCCESS] 环境变量设置完成

echo.
echo [5/6] 检查数据库连接...
echo [INFO] 如果首次运行，请确保已初始化数据库

echo.
echo [6/6] 启动Flask应用...
echo [INFO] 后端服务将在 http://localhost:5000 启动
echo [INFO] 按 Ctrl+C 停止服务
echo ========================================
python run.py

echo.
echo [INFO] 后端服务已停止
pause