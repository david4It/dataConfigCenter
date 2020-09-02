package com.scsme.dataConfigCenter.graph;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.util.HashMap;

public class Map extends AbstractGraph {
    Map(DataSource dataSource, Component component, java.util.Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, java.util.Map<String, Object> result) throws Exception {
        String configJson = component.getConfigJson();
        if (StringUtils.hasText(configJson)) {
            result.put(CONFIG_JSON, new ObjectMapper().readValue(configJson, Object.class));
        }
    }

    @Override
    java.util.Map<String, Object> getGraphicalData() throws Exception {
       java.util.Map<String, Object> result = new HashMap<>();
       transMap(null, result);
       return result;
    }
}
