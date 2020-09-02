package com.scsme.dataConfigCenter.graph;

import com.alibaba.fastjson.JSONObject;
import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Line extends AbstractGraph {
    public Line(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    public void transMap(ResultSet resultSet, Map<String, Object> result) throws Exception {
        Set<String> legendSet = new LinkedHashSet<>();
        Set<String> dimensionSet = new LinkedHashSet<>();
        Map<String, List<JSONObject>> seriesDetail = new LinkedHashMap<>();
        arrangement(resultSet, legendSet, dimensionSet, seriesDetail);
        result.put(LEGEND_DATA, legendSet);
        result.put(X_AXIS_DATA, dimensionSet);
        result.put(SERIES_DATA, seriesDetail);
    }
}
