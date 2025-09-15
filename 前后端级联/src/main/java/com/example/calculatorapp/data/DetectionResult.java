package com.example.calculatorapp.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// 添加DTO类
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetectionResult {
    private int class_id;
    private String class_name;
    private double confidence;
    private double[][] polygon;
}