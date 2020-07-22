package com.scsme.dataConfigCenter.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class PageController {
    @GetMapping("/{page}")
    public ModelAndView page(@PathVariable("page") String page) {
        String[] split = page.split(":");
        if (split.length > 0) {
            page = page.replace(":", "/");
        }
        return new ModelAndView(page);
    }
}
