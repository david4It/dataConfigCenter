package com.scsme.dataConfigCenter.graphical;

import com.scsme.dataConfigCenter.pojo.Component;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class Line extends AbstractGraphical {
    public Line(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    public void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
        List<Map<String,Object>> lbSeriesData = new ArrayList<>();
        List<String> lbXAxisData = new ArrayList<>();
        arrangement(component, resultSet, lbSeriesData, lbXAxisData);
        result.put(X_AXIS_DATA, lbXAxisData);
        result.put(SERIES_DATA, lbSeriesData);
    }
}
