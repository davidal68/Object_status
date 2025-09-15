# 目标检测推理平台

这是一个基于Spring Boot后端和前端HTML/CSS/JavaScript构建的目标检测推理平台

## 功能特性

- 🖼️ 图片上传和预览
- 🔍 目标检测推理
- 📊 检测结果可视化
- 📥 结果导出功能
- 📱 响应式设计
- 
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

### 目标检测模型
- Pytorch框架下的检测模型修改0
- YOLO目标检测模型的改进思路10
- Docker的模型封装与部属


## 下一步计划

- [ ] 集成更多的检测模型
- [ ] 完善用户等录系统（设置头像以及QQ邮箱发送验证码的业务）
- [ ] 实现检测历史记录 （检测结果的下载）
- [ ] 添加批量处理功能
- [ ] 优化移动端体验
- [ ] Tips:我永远喜欢高松灯，酷酷嘎嘎（🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧🐧）
