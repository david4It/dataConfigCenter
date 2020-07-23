package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import com.scsme.dataConfigCenter.vo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/layout")
@Slf4j
public class LayoutController {
    @Autowired
    LayoutService layoutService;
    @PostMapping("/create")
    public Result<Boolean> createLayout(@RequestBody LayoutVO layout) {
        Result<Boolean> result = new Result<>();
        try {
            Boolean saved = layoutService.saveLayout(layout);
            if (saved) {
                result.success("保存布局成功！");
            } else {
                result.error500("保存布局失败！");
            }
        } catch (Exception e) {
            result.error500("保存布局失败！");
            log.error(e.getLocalizedMessage());
        }
        return result;
    }

    @GetMapping("/checkUrl")
    public Result<Boolean> checkUrl(@RequestParam String url) {
        Result<Boolean> result = new Result<>();
        try {
            Boolean isValid = layoutService.checkUrl(url);
            result.success("校验url成功！");
            result.result(isValid);
        } catch (Exception e) {
            result.error500("校验url失败！");
            log.error(e.getLocalizedMessage());
        }
        return result;
    }
}
