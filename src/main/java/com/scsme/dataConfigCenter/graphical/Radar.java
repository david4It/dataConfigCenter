package com.scsme.dataConfigCenter.graphical;

import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Radar extends AbstractGraphical {

    public Radar(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
        List<String> radarLegendData = new ArrayList<>();
        List<Map<String, Object>> radarIndicatorData = new ArrayList<>();
        Map<String, BigDecimal> indicatorMaxMap = new LinkedHashMap<>();
        List<Map<String, Object>> radarSeriesData = new ArrayList<>();
        Set<String> paramsSet = new HashSet<>();
        String[] arr = component.getCategoryValuePattern().split(COLON_SEPARATOR);
        Set<String> dimensionSet = new HashSet<>(Arrays.asList(arr[1].split(COMMA_SEPARATOR)));
        if (StringUtils.hasText(component.getParams())) {
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int count = metaData.getColumnCount();
            List<BigDecimal> vList = new ArrayList<>();
            Map<String, Object> radarSeriesMap = new LinkedHashMap<>();
            Map<String, Object> valueData = new HashMap<>();
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getString(i);
                if (paramsSet.contains(columnName)) {
                    valueData.put(columnName, valueStr);
                } else {
                    if (arr[0].equals(columnName)) {
                        radarSeriesMap.put(NAME, valueStr);
                        radarLegendData.add(valueStr);
                    } else if (dimensionSet.contains(columnName)) {
                        BigDecimal decimalValue = getDecimalValue(valueStr);
                        vList.add(decimalValue);
                        //保存维度的最大值
                        if (indicatorMaxMap.get(columnName) == null || indicatorMaxMap.get(columnName).compareTo(decimalValue) < 0) {
                            indicatorMaxMap.put(columnName, decimalValue);
                        }
                    }
                }
            }
            radarSeriesMap.put(VALUE, vList);
            radarSeriesMap.put(EXT_DATA, valueData);
            radarSeriesData.add(radarSeriesMap);
        }
        for (Map.Entry<String, BigDecimal> next : indicatorMaxMap.entrySet()) {
            Map<String, Object> indicatorMap = new LinkedHashMap<>();
            indicatorMap.put(NAME, next.getKey());
            //维度最大值上浮15%，用于维度的max
            indicatorMap.put(MAX, next.getValue().multiply(new BigDecimal(1.15).setScale(2, BigDecimal.ROUND_HALF_UP)));
            radarIndicatorData.add(indicatorMap);
        }
        result.put(LEGEND_DATA, radarLegendData);
        result.put(RADAR_INDICATOR, radarIndicatorData);
        result.put(SERIES_DATA, radarSeriesData);
    }
}
