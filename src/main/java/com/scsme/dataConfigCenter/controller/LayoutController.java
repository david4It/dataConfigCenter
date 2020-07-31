package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.vo.LayoutVO;
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

import java.util.List;

@RestController
@RequestMapping("/layout")
@Slf4j
public class LayoutController {
    @Autowired
    LayoutService layoutService;
    @PostMapping("/create")
    public Result<Boolean> create(@RequestBody LayoutVO layout) {
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

    @GetMapping("/list")
    public Result<List<LayoutVO>> list(@RequestParam(name="pageNo", defaultValue="1") Integer pageNo,
                                     @RequestParam(name="pageSize", defaultValue="10") Integer pageSize) {
        Result<List<LayoutVO>> result = new Result<>();
        try {
            List<LayoutVO> list = layoutService.list(result, pageNo, pageSize);
            result.setResult(list);
            result.success("查询布局列表数据成功！");
        } catch (Exception e) {
            result.error500("查询布局列表数据失败！");
            log.error(e.getLocalizedMessage());
        }
        return result;
    }

    @DeleteMapping("/delete")
    public Result<Boolean> delete(@RequestParam(name="id") Long id) {
        Result<Boolean> result = new Result<>();
        try {
            Boolean deleted= layoutService.deleteLayout(id);
            result.setResult(deleted);
            result.success("删除布局数据成功！");
        } catch (Exception e) {
            result.error500("删除布局数据失败！");
            log.error(e.getLocalizedMessage());
        }
        return result;
    }

    @PostMapping("/update")
    public Result<Boolean> update(@RequestBody LayoutVO layout) {
        Result<Boolean> result = new Result<>();
        try {

            result.success("更新布局数据成功！");
        } catch (Exception e) {
            result.error500("更新布局数据失败！");
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
