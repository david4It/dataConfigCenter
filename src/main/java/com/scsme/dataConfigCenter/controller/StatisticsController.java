package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.service.StatisticsService;
import com.scsme.dataConfigCenter.vo.Result;
import com.scsme.dataConfigCenter.vo.StatisticsVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("statistics/")
@Slf4j
public class StatisticsController {
    @Autowired
    StatisticsService service;
    @PostMapping("common")
    public Result<Map<String, Object>> common(@RequestBody StatisticsVO vo) {
        Result<Map<String, Object>> result = new Result<>();
        try {
            Map<String, Object> value = service.query(vo.getComponentId(), vo.getValueMap());
            result.setResult(value);
            result.success("查询视图数据成功！");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("查询视图数据失败！");
        }
        return result;
    }

    @PostMapping("preview")
    public Result<Map<String, Object>> preview(@RequestBody StatisticsVO vo) {
        Result<Map<String, Object>> result = new Result<>();
        try {
            Map<String, Object> value = service.preview(vo.getComponentId());
            result.setResult(value);
            result.success("查询预览视图数据成功！");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("查询预览视图数据失败！");
        }
        return result;
    }
}
