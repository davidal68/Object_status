package com.example.calculatorapp.controller;

import com.example.calculatorapp.service.YoloInferenceService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/yolo")
public class YoloController {
    
    private final YoloInferenceService yoloService;
    
    public YoloController(YoloInferenceService yoloService) {
        this.yoloService = yoloService;
    }
    
    @GetMapping("/detect")
    public String detectionPage() {
        return "yolo-detection";
    }
    
    @PostMapping(value = "/inference/image", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> inferenceWithImage(@RequestParam("image") MultipartFile imageFile) {
        try {
            byte[] resultImage = yoloService.inferenceWithVisualization(imageFile);
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=result.jpg")
                .body(resultImage);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/inference/json")
    public ResponseEntity<String> inferenceWithJson(@RequestParam("image") MultipartFile imageFile) {
        try {
            String jsonResult = yoloService.inferenceWithJson(imageFile);
            return ResponseEntity.ok(jsonResult);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/inference")
    public String inference(@RequestParam("image") MultipartFile imageFile, 
                           @RequestParam(value = "format", defaultValue = "image") String format,
                           Model model) {
        try {
            if ("json".equalsIgnoreCase(format)) {
                String result = yoloService.inferenceWithJson(imageFile);
                model.addAttribute("jsonResult", result);
            } else {
                byte[] resultImage = yoloService.inferenceWithVisualization(imageFile);
                String base64Image = java.util.Base64.getEncoder().encodeToString(resultImage);
                model.addAttribute("imageResult", "data:image/jpeg;base64," + base64Image);
            }
            model.addAttribute("message", "推理成功");
        } catch (Exception e) {
            model.addAttribute("message", "推理失败: " + e.getMessage());
        }
        return "yolo-detection";
    }
}