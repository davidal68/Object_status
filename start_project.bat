@echo off
echo ====================================
echo 启动前后端级联项目
echo ====================================

REM 检查是否安装了Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

REM 检查是否安装了Java
java -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Java，请先安装Java 17或更高版本
    pause
    exit /b 1
)

REM 检查是否安装了Maven
mvn -version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Maven，请先安装Maven
    pause
    exit /b 1
)

echo.
echo 1. 启动后端Spring Boot服务...
cd 前后端级联
start "后端服务" cmd /k "mvn spring-boot:run"

REM 等待后端服务启动
timeout /t 10 /nobreak >nul

echo.
echo 2. 启动前端HTTP服务...
cd ..\推理平台
start "前端服务" cmd /k "npx http-server -p 3000 -c-1 --cors"

echo.
echo ====================================
echo 服务启动完成！
echo ====================================
echo 后端API: http://localhost:8080
echo 前端界面: http://localhost:3000
echo ====================================
echo 按任意键退出...
pause >nul