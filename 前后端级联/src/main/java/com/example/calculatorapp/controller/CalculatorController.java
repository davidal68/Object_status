package com.example.calculatorapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CalculatorController {

    @GetMapping("/")
    public String index() {
        return "calculator";
    }

    @PostMapping("/calculate")
    public String calculate(
            @RequestParam("num1") double num1,
            @RequestParam("num2") double num2,
            Model model) {
        
        double result = num1 + num2;
        
        model.addAttribute("num1", num1);
        model.addAttribute("num2", num2);
        model.addAttribute("result", result);
        
        return "calculator";
    }
}