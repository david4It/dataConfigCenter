package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.graphical.GraphicalFactory;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/component")
@Slf4j
public class ComponentController {
    @Autowired
    ComponentService componentService;
    @GetMapping("/list")
    public Result<List<ComponentVO>> list(@RequestParam("layoutId") Long layoutId) {
        Result<List<ComponentVO>> result = new Result<>();
        try {
            List<ComponentVO> componentList = componentService.componentList(layoutId);
            result.success("获取组件成功！");
            result.setResult(componentList);
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("获取组件失败！");
        }
        return result;
    }

    @PostMapping("/save")
    public Result<Boolean> save(@RequestBody List<ComponentVO> components) {
        Result<Boolean> result = new Result<>();
        try {
            result.setResult(componentService.saveComponents(components));
            result.success("保存组件成功！");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("保存组件失败！");
        }
        return result;
    }

    @DeleteMapping("/delete")
    public Result<Boolean> delete(@RequestParam("id") Long id) {
        Result<Boolean> result = new Result<>();
        try {
            Boolean deleted = componentService.deleteComponent(id);
            result.setResult(deleted);
            result.success(deleted ? "删除组件成功！" : "删除组件失败！");
        } catch (Exception e) {
            log.error(e.getLocalizedMessage());
            result.error500("删除组件失败！");
        }
        return result;
    }
}
