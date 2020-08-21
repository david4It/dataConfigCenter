package com.scsme.dataConfigCenter.service.impl;

import com.scsme.dataConfigCenter.graph.GraphicalFactory;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;
import java.util.Map;

@Service
@Transactional
public class StatisticsServiceImpl implements StatisticsService {
    @Autowired
    DataSource dataSource;
    @Autowired
    ComponentMapper mapper;

    @Override
    public Map<String, Object> query(Long componentId, Map<String, Object> params) throws Exception {
        Component component = mapper.selectById(componentId);
        if (component != null) {
            return GraphicalFactory.getInstance().getGraphicalDataMap(dataSource, component, params);
        }
        return null;
    }

    @Override
    public Map<String, Object> preview(Long componentId) throws Exception {
        Component component = mapper.selectById(componentId);
        if (component != null) {
            return GraphicalFactory.getInstance().getPreviewGraphicalDataMap(component);
        }
        return null;
    }
}
