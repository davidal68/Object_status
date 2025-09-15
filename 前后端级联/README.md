# YOLO目标检测推理平台

基于SpringBoot + Thymeleaf + YOLO模型的可视化目标检测平台。

## 功能特性

- 🖼️ 支持图像文件上传
- 🔍 集成YOLO目标检测模型
- 📊 可视化检测结果（带边界框）
- 📋 JSON格式检测数据输出
- 🎨 现代化响应式UI设计

## 系统要求

- Java 17+
- Maven 3.6+
- Docker（用于运行YOLO推理服务）

## 快速开始

### 1. 启动YOLO推理服务

确保您的YOLO模型镜像已经构建完成，然后运行：

```bash
docker run -p 5000:5000 your-yolo-image
```

YOLO服务需要提供以下API端点：
- `POST /inference` - 接收图像并返回检测结果
- 支持参数：`visualize=true/false`, `output_format=image/json`

### 2. 启动SpringBoot应用

```bash
# 方式一：使用Maven
mvn spring-boot:run

# 方式二：使用启动脚本（Windows）
start.bat
```

### 3. 访问平台

打开浏览器访问：http://localhost:8080/yolo/detect

## 项目结构

```
src/main/java/com/example/calculatorapp/
├── CalculatorApplication.java      # SpringBoot主应用
├── controller/
│   ├── CalculatorController.java   # 简单计算器控制器
│   └── YoloController.java         # YOLO检测控制器
└── service/
    └── YoloInferenceService.java   # YOLO推理服务

src/main/resources/
├── templates/
│   ├── calculator.html            # 计算器页面
│   └── yolo-detection.html        # YOLO检测页面
└── application.properties          # 应用配置
```

## API接口

### 图像检测接口

- **URL**: `POST /yolo/inference`
- **参数**: 
  - `image`: 图像文件（multipart/form-data）
  - `format`: 输出格式（image/json）
- **响应**: 根据格式返回图像或JSON数据

### 直接获取图像结果

- **URL**: `POST /yolo/inference/image`
- **响应**: JPEG格式的图像文件

### 直接获取JSON结果

- **URL**: `POST /yolo/inference/json`
- **响应**: JSON格式的检测数据

## 配置说明

### 应用配置（application.properties）

```properties
# 服务器端口
server.port=8080

# 文件上传大小限制
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# YOLO服务地址（默认localhost:5000）
# 可在YoloInferenceService.java中修改
```

### YOLO服务配置

确保YOLO容器服务：
- 运行在端口5000
- 提供 `/inference` POST接口
- 支持multipart/form-data文件上传
- 支持可视化参数和输出格式选择

## 开发说明

### 添加新的检测模型

1. 在 `YoloInferenceService.java` 中修改API地址
2. 确保新模型提供相同的接口规范
3. 更新前端页面以支持新功能

### 自定义UI

修改 `src/main/resources/templates/yolo-detection.html` 文件：
- 调整页面布局和样式
- 添加新的表单字段
- 修改结果显示方式

## 故障排除

### 常见问题

1. **YOLO服务连接失败**
   - 检查YOLO容器是否正常运行
   - 确认端口5000未被占用

2. **文件上传失败**
   - 检查文件大小是否超过10MB限制
   - 确认网络连接正常

3. **页面无法访问**
   - 确认SpringBoot应用正常启动
   - 检查端口8080是否被占用

## 技术支持

如有问题请检查：
- YOLO模型服务日志
- SpringBoot应用日志
- 浏览器开发者工具网络请求

## 许可证

MIT License