package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.executor.HTMLCreationExecutor;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class LayoutServiceImpl implements LayoutService {
    @Autowired
    LayoutMapper layoutMapper;
    @Autowired
    ComponentMapper componentMapper;
    @Override
    public Boolean saveLayout(LayoutVO layout) {
        Layout beSave = layout.transLayout();
        int insert = layoutMapper.insert(beSave);
        if (insert > 0) {
            Long layoutId = getLayoutId(beSave.getUrl());
            if (layoutId != null) {
                List<Component> components = layout.transComponents(layoutId);
                Boolean result = componentMapper.batchInsert(components);
                if (result) {
                    HTMLCreationExecutor.generatedHTMLFile(layout);
                    return true;
                }
            }
        }
        return false;
    }

    @Override
    public Boolean checkUrl(String url) {
        return getLayoutId(url) != null;
    }

    private Long getLayoutId(String url) {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("url", url);
        Layout layout = layoutMapper.selectOne(queryWrapper);
        if (layout != null) {
            return layout.getId();
        }
        return null;
    }
}
