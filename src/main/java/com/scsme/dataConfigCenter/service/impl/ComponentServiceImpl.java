package com.scsme.dataConfigCenter.service.impl;

import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.service.ComponentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ComponentServiceImpl implements ComponentService {
    @Autowired
    ComponentMapper componentMapper;
    @Override
    public Boolean saveComponents(List<Component> components) {
        return componentMapper.batchInsert(components);
    }
}
