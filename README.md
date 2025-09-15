# 目标检测推理平台 - 前后端级联项目

这是一个基于Spring Boot后端和纯前端HTML/CSS/JavaScript构建的目标检测推理平台。

## 项目结构

- `前后端级联/` - Spring Boot后端项目
  - 提供RESTful API接口
  - 处理图片上传和目标检测
  - 端口：8080

- `推理平台/` - 前端界面
  - 用户友好的Web界面
  - 图片上传和结果显示
  - 端口：3000

## 功能特性

- 🖼️ 图片上传和预览
- 🔍 目标检测推理
- 📊 检测结果可视化
- 📥 结果导出功能
- 📱 响应式设计

## 运行要求

- Java 17+
- Maven 3.6+
- Node.js 14+

## 快速启动

### 方法一：使用启动脚本（推荐）

1. 双击运行 `start_project.bat`
2. 等待服务启动完成
3. 访问前端界面：http://localhost:3000
4. 后端API：http://localhost:8080

### 方法二：手动启动

#### 启动后端服务
```bash
cd 前后端级联
mvn spring-boot:run
```

#### 启动前端服务（新终端）
```bash
cd 推理平台
npx http-server -p 3000 -c-1 --cors
```

<img width="1899" height="881" alt="d08b48daa1b4a38dc5bbf0f06b64ec8e" src="https://github.com/user-attachments/assets/09b9b63a-9d90-4cf4-a487-8b17ed6bc738" />

<img width="1905" height="899" alt="17e5e641f397a39b3037c198703316cb" src="https://github.com/user-attachments/assets/fe5b49c4-3508-4588-b213-594500b70681" />


## API接口

### 目标检测接口
- **URL**: `POST /yolo/inference/json`
- **参数**: `image` (MultipartFile)
- **返回**: JSON格式的检测结果

### 图片检测接口
- **URL**: `POST /yolo/inference/image`
- **参数**: `image` (MultipartFile)
- **返回**: 带检测框的图片

<img width="1486" height="681" alt="30e3287f94449986ca00ea9ac1ce850e" src="https://github.com/user-attachments/assets/a1b04b39-0d35-4d50-b81d-7cffb77278f2" />


## 推理的结果
<img width="1093" height="861" alt="024cb13d6dc49ba650877fcda547553a" src="https://github.com/user-attachments/assets/ee6d1ba6-e019-4c9c-918f-396fe8201252" />



## 开发说明

### 后端技术栈
- Spring Boot 3.2.0
- Spring Web
- Thymeleaf模板引擎

### 前端技术栈
- 原生HTML5/CSS3/JavaScript
- Font Awesome图标
- Google Fonts字体

### 跨域配置
后端已配置CORS，允许前端从localhost:3000访问API接口。

## 故障排除

1. **端口冲突**: 如果8080或3000端口被占用，请修改对应配置
2. **依赖问题**: 运行 `mvn clean install` 重新构建后端
3. **CORS错误**: 确保前端服务运行在http://localhost:3000

## 下一步计划

- [ ] 集成真实的YOLO模型
- [ ] 添加用户认证系统
- [ ] 实现检测历史记录
- [ ] 添加批量处理功能
- [ ] 优化移动端体验
