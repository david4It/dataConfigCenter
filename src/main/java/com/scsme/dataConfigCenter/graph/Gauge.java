package com.scsme.dataConfigCenter.graph;

import com.scsme.dataConfigCenter.pojo.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Gauge extends AbstractGraph {

    public Gauge(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Map<String, Object> result) throws Exception {
        List<Map<String,Object>> gaugeSeriesData = new ArrayList<>();
        arrangement(resultSet, gaugeSeriesData, new ArrayList<>());
        result.put(SERIES_DATA, gaugeSeriesData);
    }
}
