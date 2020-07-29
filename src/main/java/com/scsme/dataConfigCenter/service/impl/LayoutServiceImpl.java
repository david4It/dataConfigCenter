package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scsme.dataConfigCenter.davinci.biz.dao.DashboardMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.executor.HTMLCreationExecutor;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import com.scsme.dataConfigCenter.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class LayoutServiceImpl implements LayoutService {
    @Autowired
    DashboardMapper dashboardMapper;
    @Autowired
    LayoutMapper layoutMapper;
    @Autowired
    ComponentService componentService;

    @Override
    public List<LayoutVO> list(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize) {
        List<LayoutVO> vos = new ArrayList<>();
        Page<Layout> page = new Page<>(pageNo, pageSize);
        IPage<Layout> layoutIPage = layoutMapper.selectPage(page, new QueryWrapper<>());
        result.setTotal(layoutIPage.getTotal());
        List<Layout> records = layoutIPage.getRecords();
        records.forEach((r) -> {
            LayoutVO vo = new LayoutVO().convert(r);
            vos.add(vo);
        });
        return vos;
    }

    @Override
    public List<LayoutVO> enabledLayouts() {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("enabled", "Y");
        List<Layout> layouts = layoutMapper.selectList(queryWrapper);
        List<LayoutVO> results = new ArrayList<>();
        layouts.forEach(layout -> {
            List<Component> componentList = componentService.componentList(layout.getId());
            LayoutVO vo = new LayoutVO().convert(layout);
            vo.convertComponents(componentList);
            results.add(vo);
        });
        return results;
    }

    @Override
    public LayoutVO queryLayout(Long id) {
        Layout layout = layoutMapper.selectById(id);
        List<Component> componentList = componentService.componentList(id);
        LayoutVO vo = new LayoutVO().convert(layout);
        vo.convertComponents(componentList);
        return vo;
    }

    @Override
    public Boolean saveLayout(LayoutVO layout) {
        Layout beSave = layout.transLayout();
        int insert = layoutMapper.insert(beSave);
        if (insert > 0) {
            Layout saved = getLayout(beSave.getUrl());
            if (saved != null) {
                List<Component> components = layout.transComponents(saved.getId());
                Boolean result = componentService.saveComponents(components);
                if (result) {
                    HTMLCreationExecutor.generatedHTMLFile(layout.convert(saved), layoutMapper);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public Boolean updateLayout(LayoutVO layout) {
        Layout beSave = layout.transLayout();
        beSave.setLastUpdateTime(LocalDateTime.now());
        int result = layoutMapper.updateById(beSave);
        if (result > 0) {
            List<Component> componentList = layout.transComponents();
            return componentService.saveComponents(componentList);
        }
        return false;
    }

    @Override
    public Boolean checkUrl(String url) {
        return getLayout(url) != null;
    }

    private Layout getLayout(String url) {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("url", url);
        return layoutMapper.selectOne(queryWrapper);
    }
}
