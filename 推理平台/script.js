// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化变量
    const navMenu = document.getElementById('navMenu');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('previewArea');
    const previewImage = document.getElementById('previewImage');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const detectBtn = document.getElementById('detectBtn');
    const loadingArea = document.getElementById('loadingArea');
    
    const resultImage = document.getElementById('resultImage');
    const detectionCanvas = document.getElementById('detectionCanvas');
    const detectionTableBody = document.getElementById('detectionTableBody');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let uploadedImage = null;
    let currentDetections = [];
    
    // 汉堡菜单点击事件
    hamburgerBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', function() {
        // 模拟登录成功
        loginBtn.style.display = 'none';
        userMenu.style.display = 'flex';
    });
    
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('href').substring(1);
            showPage(targetPage);
            
            // 移动端点击后关闭菜单
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // 页面切换函数
    window.showPage = function(pageId) {
        // 隐藏所有页面
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 取消所有导航链接的激活状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // 显示目标页面
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // 激活对应的导航链接
            const correspondingLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    };
    
    // 上传区域点击事件
    uploadArea.addEventListener('click', function() {
        imageInput.click();
    });
    
    // 拖放功能
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#0056b3';
        uploadArea.style.background = 'rgba(0, 123, 255, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.style.borderColor = '#007BFF';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#007BFF';
        uploadArea.style.background = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0]);
        }
    });
    
    // 文件输入变化事件
    imageInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });
    
    // 处理图片文件
    function handleImageFile(file) {
        if (!file.type.match('image.*')) {
            alert('请选择图片文件（JPG、PNG格式）！');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小不能超过10MB！');
            return;
        }
        
        // 显示上传进度
        uploadProgress.style.display = 'block';
        
        // 模拟上传进度
        let progress = 0;
        const uploadInterval = setInterval(() => {
            progress += 5;
            if (progress <= 100) {
                progressFill.style.width = progress + '%';
                progressText.textContent = progress + '%';
            } else {
                clearInterval(uploadInterval);
                uploadProgress.style.display = 'none';
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImage = new Image();
                    uploadedImage.onload = function() {
                        // 显示预览图片
                        previewImage.src = e.target.result;
                        previewArea.style.display = 'block';
                        detectBtn.disabled = false;
                        
                        // 调整canvas大小
                        detectionCanvas.width = uploadedImage.width;
                        detectionCanvas.height = uploadedImage.height;
                    };
                    uploadedImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }, 50);
    }
    
    // 检测按钮点击事件
    detectBtn.addEventListener('click', function() {
        if (!uploadedImage) {
            alert('请先上传图片！');
            return;
        }
        
        // 显示加载动画
        previewArea.style.display = 'none';
        loadingArea.style.display = 'block';
        
        // 调用后端API进行目标检测
        performObjectDetection();
    });
    
    // 实际目标检测函数 - 调用后端API
    async function performObjectDetection() {
        try {
            // 将图片转换为Blob对象
            const response = await fetch(uploadedImage.src);
            const blob = await response.blob();
            
            // 创建FormData
            const formData = new FormData();
            formData.append('image', blob, 'uploaded_image.jpg');
            
            // 同时调用两个API：获取可视化图片和JSON结果
            const [imageResponse, jsonResponse] = await Promise.all([
                fetch('http://localhost:8089/yolo/inference/image', {
                    method: 'POST',
                    body: formData
                }),
                fetch('http://localhost:8089/yolo/inference/json', {
                    method: 'POST',
                    body: formData
                })
            ]);
            
            if (!imageResponse.ok || !jsonResponse.ok) {
                throw new Error(`HTTP error! status: ${imageResponse.status}, ${jsonResponse.status}`);
            }
            
            // 获取可视化图片
            const imageBlob = await imageResponse.blob();
            const visualizationImageUrl = URL.createObjectURL(imageBlob);
            
            // 获取JSON检测结果
            const detectionResults = await jsonResponse.json();
            
            // 处理检测结果
            displayDetectionResults(detectionResults, visualizationImageUrl);
            
            // 隐藏加载动画，显示结果页面
            loadingArea.style.display = 'none';
            showPage('results');
            
        } catch (error) {
            console.error('检测失败:', error);
            loadingArea.style.display = 'none';
            previewArea.style.display = 'block';
            alert('检测失败，请检查后端服务是否正常运行！');
        }
    }
    
    // 显示检测结果
    function displayDetectionResults(results, visualizationImageUrl) {
        const ctx = detectionCanvas.getContext('2d');
        ctx.clearRect(0, 0, detectionCanvas.width, detectionCanvas.height);
        
        // 显示可视化图片（带有检测框的图片）
        resultImage.src = visualizationImageUrl;
        
        // 清空之前的检测结果
        currentDetections = [];
        detectionTableBody.innerHTML = '';
        
        // 检查Docker服务返回的数据格式
        if (results && results.success && Array.isArray(results.results)) {
            // 处理Docker服务返回的多边形数据
            results.results.forEach((detection, index) => {
                // 计算多边形的最小外接矩形用于显示
                const polygon = detection.polygon;
                const xs = polygon.map(p => p[0]);
                const ys = polygon.map(p => p[1]);
                const minX = Math.min(...xs);
                const minY = Math.min(...ys);
                const maxX = Math.max(...xs);
                const maxY = Math.max(...ys);
                const width = maxX - minX;
                const height = maxY - minY;
                
                // 添加到检测结果表格
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detection.class_name}</td>
                    <td>${detection.confidence.toFixed(4)}</td>
                    <td>(${Math.round(minX)}, ${Math.round(minY)})</td>
                    <td>${Math.round(width)}×${Math.round(height)}</td>
                `;
                detectionTableBody.appendChild(row);
                
                // 保存检测结果（适配前端期望格式）
                currentDetections.push({
                    class: detection.class_name,
                    confidence: detection.confidence,
                    x: minX,
                    y: minY,
                    width: width,
                    height: height
                });
            });
        } else if (results && Array.isArray(results)) {
            // 处理旧的矩形框数据格式（向后兼容）
            results.forEach((detection, index) => {
                // 添加到检测结果表格
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detection.class}</td>
                    <td>${detection.confidence}</td>
                    <td>(${detection.x}, ${detection.y})</td>
                    <td>${detection.width}×${detection.height}</td>
                `;
                detectionTableBody.appendChild(row);
                
                // 保存检测结果
                currentDetections.push(detection);
            });
        } else {
            // 如果没有检测结果
            detectionTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">未检测到目标</td></tr>';
        }
    }
    
    
    // 显示检测结果表格
    function displayDetectionTable(detections) {
        detectionTableBody.innerHTML = '';
        
        detections.forEach((detection, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${detection.class}</td>
                <td>${detection.confidence}</td>
                <td>(${Math.round(detection.x)}, ${Math.round(detection.y)})</td>
                <td>${Math.round(detection.width)}×${Math.round(detection.height)}</td>
            `;
            
            detectionTableBody.appendChild(row);
        });
    }
    
    // 下载按钮点击事件
    downloadBtn.addEventListener('click', function() {
        if (currentDetections.length === 0) {
            alert('没有检测结果可下载！');
            return;
        }
        
        // 创建检测结果文本
        let resultText = '目标检测结果\n\n';
        resultText += `检测时间: ${new Date().toLocaleString()}\n`;
        resultText += `检测目标数: ${currentDetections.length}\n\n`;
        
        currentDetections.forEach((detection, index) => {
            resultText += `目标 ${index + 1}:\n`;
            resultText += `  类别: ${detection.class}\n`;
            resultText += `  置信度: ${detection.confidence}\n`;
            resultText += `  位置: (${Math.round(detection.x)}, ${Math.round(detection.y)})\n`;
            resultText += `  尺寸: ${Math.round(detection.width)}×${Math.round(detection.height)}\n\n`;
        });
        
        // 创建下载链接
        const blob = new Blob([resultText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `detection_results_${new Date().getTime()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('检测结果已下载！');
    });
    
    // 生成随机颜色
    function getRandomColor() {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA5A5', 
            '#FFD166', '#06D6A0', '#118AB2', '#073B4C',
            '#FF9F1C', '#E71D36', '#2EC4B6', '#FDFFFC'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // 响应式调整
    window.addEventListener('resize', function() {
        if (uploadedImage && detectionCanvas) {
            // 保持canvas与图片比例
            const aspectRatio = uploadedImage.width / uploadedImage.height;
            detectionCanvas.style.width = '100%';
            detectionCanvas.style.height = 'auto';
        }
        
        // 屏幕变大时自动关闭汉堡菜单
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
        }
    });
    
    // 点击页面其他区域关闭汉堡菜单
    document.addEventListener('click', function(e) {
        if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});