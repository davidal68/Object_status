@echo off
echo 正在启动YOLO推理平台...

REM 检查Maven是否安装
mvn --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Maven，请先安装Maven
    pause
    exit /b 1
)

REM 清理并编译项目
echo 清理和编译项目...
mvn clean compile

REM 启动SpringBoot应用
echo 启动应用服务器...
mvn spring-boot:run

pause