package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ComponentServiceImpl extends ServiceImpl<ComponentMapper, Component> implements ComponentService {
    @Autowired
    ComponentMapper componentMapper;
    @Override
    public Boolean saveComponents(List<Component> components) {
        return saveOrUpdateBatch(components);
    }

    @Override
    public List<Component> componentList(Long layoutId) {
        QueryWrapper<Component> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("layout_id", layoutId);
        return componentMapper.selectList(queryWrapper);
    }
}
