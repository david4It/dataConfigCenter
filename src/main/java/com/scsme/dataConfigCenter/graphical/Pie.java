package com.scsme.dataConfigCenter.graphical;

import com.scsme.dataConfigCenter.pojo.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Pie extends AbstractGraphical {

    public Pie(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
        List<Map<String, Object>> pieSeriesData = new ArrayList<>();
        List<String> pieLegendData = new ArrayList<>();
        arrangement(component, resultSet, pieSeriesData, pieLegendData);
        result.put(LEGEND_DATA, pieLegendData);
        result.put(SERIES_DATA, pieSeriesData);
    }
}
