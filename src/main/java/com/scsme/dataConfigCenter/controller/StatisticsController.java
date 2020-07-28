package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.service.StatisticsService;
import com.scsme.dataConfigCenter.vo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("statistics/")
@Slf4j
public class StatisticsController {
    @Autowired
    StatisticsService service;
    @GetMapping("common")
    public Result<Map<String, Object>> common(@RequestParam("componentId") Long componentId) {
        Result<Map<String, Object>> result = new Result<>();
        try {
            Map<String, Object> value = service.query(componentId);
            result.setResult(value);
            result.success("查询视图数据成功！");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("查询视图数据失败！");
        }
        return result;
    }
}
