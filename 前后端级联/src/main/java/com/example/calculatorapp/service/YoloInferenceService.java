package com.example.calculatorapp.service;

import com.example.calculatorapp.data.DetectionResult;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

// 添加必要的导入
import java.awt.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

@Service
public class YoloInferenceService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String YOLO_API_URL = "http://localhost:5000/detect";
    
    // 添加缺失的inferenceWithJson方法
    public String inferenceWithJson(MultipartFile imageFile) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("image", imageFile.getResource());
        body.add("visualize", "false");
        body.add("output_format", "json");
        
        HttpEntity<MultiValueMap<String, Object>> requestEntity = 
            new HttpEntity<>(body, headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            YOLO_API_URL,
            HttpMethod.POST,
            requestEntity,
            String.class
        );
        
        return response.getBody();
    }
    
    public byte[] generateVisualizationImage(MultipartFile imageFile, String jsonResult) throws IOException {
        try {
            // 首先解析整个JSON响应
            Map<String, Object> response = objectMapper.readValue(jsonResult, 
                new TypeReference<Map<String, Object>>() {});
            
            // 检查是否成功
            if (!Boolean.TRUE.equals(response.get("success"))) {
                throw new IOException("Detection failed: " + response.get("error"));
            }
            
            // 提取results数组
            List<Map<String, Object>> resultsList = (List<Map<String, Object>>) response.get("results");
            List<DetectionResult> results = new ArrayList<>();
            
            // 转换为DetectionResult对象
            for (Map<String, Object> resultMap : resultsList) {
                DetectionResult result = new DetectionResult();
                result.setClass_id((Integer) resultMap.get("class_id"));
                result.setClass_name((String) resultMap.get("class_name"));
                result.setConfidence((Double) resultMap.get("confidence"));
                
                // 处理polygon数组
                List<List<Double>> polygonList = (List<List<Double>>) resultMap.get("polygon");
                double[][] polygon = new double[4][2];
                for (int i = 0; i < 4; i++) {
                    List<Double> point = polygonList.get(i);
                    polygon[i][0] = point.get(0);
                    polygon[i][1] = point.get(1);
                }
                result.setPolygon(polygon);
                
                results.add(result);
            }
            
            // 读取原始图片
            BufferedImage originalImage = ImageIO.read(imageFile.getInputStream());
            BufferedImage visualizedImage = new BufferedImage(
                originalImage.getWidth(), 
                originalImage.getHeight(), 
                BufferedImage.TYPE_INT_RGB
            );
            
            Graphics2D g2d = visualizedImage.createGraphics();
            g2d.drawImage(originalImage, 0, 0, null);
            
            // 定义类别颜色映射 - 按照您的要求
            Map<String, Color> classColors = new HashMap<>();
            classColors.put("vehicle", Color.GREEN);     // 车子类别 - 绿色
            classColors.put("car", Color.GREEN);        // 车子类别 - 绿色
            classColors.put("ship", Color.RED);         // 船只类别 - 红色
            classColors.put("boat", Color.RED);          // 船只类别 - 红色
            classColors.put("building", Color.BLUE);     // 建筑类别 - 蓝色
            classColors.put("person", Color.YELLOW);     // 人类别 - 黄色
            classColors.put("airplane", Color.CYAN);     // 飞机类别 - 青色
            classColors.put("tree", Color.MAGENTA);      // 树木类别 - 洋红色
            
            // 为其他类别定义默认颜色数组
            Color[] defaultColors = {
                Color.ORANGE, Color.PINK, Color.WHITE, Color.GRAY,
                new Color(128, 0, 128),   // 紫色
                new Color(255, 165, 0),   // 橙色
                new Color(0, 128, 128),   // 深青色
                new Color(128, 128, 0)    // 橄榄色
            };
            
            // 绘制检测结果 - 同一类别相同颜色
            for (int i = 0; i < results.size(); i++) {
                DetectionResult result = results.get(i);
                String className = result.getClass_name().toLowerCase();
                
                // 获取类别对应的颜色
                Color color = classColors.get(className);
                if (color == null) {
                    // 如果类别不在预定义映射中，使用哈希算法分配固定颜色
                    int colorIndex = Math.abs(className.hashCode()) % defaultColors.length;
                    color = defaultColors[colorIndex];
                    // 缓存这个类别的颜色
                    classColors.put(className, color);
                }
                
                // 设置绘图属性
                g2d.setColor(color);
                g2d.setStroke(new BasicStroke(3));
                
                // 绘制多边形边界框
                int[] xPoints = new int[4];
                int[] yPoints = new int[4];
                for (int j = 0; j < 4; j++) {
                    xPoints[j] = (int) result.getPolygon()[j][0];
                    yPoints[j] = (int) result.getPolygon()[j][1];
                }
                
                g2d.drawPolygon(xPoints, yPoints, 4);
                
                // 移除标签显示（不显示类别名和置信度）
                // 按照您的要求，不再添加标签
            }
            
            g2d.dispose();
            
            // 转换为字节数组
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(visualizedImage, "jpg", baos);
            return baos.toByteArray();
            
        } catch (Exception e) {
            throw new IOException("Failed to generate visualization image: " + e.getMessage(), e);
        }
    }
    
    // 修改inferenceWithVisualization方法
    public byte[] inferenceWithVisualization(MultipartFile imageFile) throws IOException {
        // 先获取JSON结果
        String jsonResult = inferenceWithJson(imageFile);
        
        // 生成可视化图片
        return generateVisualizationImage(imageFile, jsonResult);
    }
}