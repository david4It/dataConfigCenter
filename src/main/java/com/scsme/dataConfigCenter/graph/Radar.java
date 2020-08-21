package com.scsme.dataConfigCenter.graph;

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

public class Radar extends AbstractGraph {

    public Radar(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
        List<String> radarLegendData = new ArrayList<>();
        List<Map<String, Object>> radarIndicatorData = new ArrayList<>();
        //indicatorMaxMap用于保存各个维度的最大值
        Map<String, BigDecimal> indicatorMaxMap = new LinkedHashMap<>();
        List<Map<String, Object>> radarSeriesData = new ArrayList<>();
        Set<String> paramsSet = new HashSet<>();
        //由于雷达度需要展示的是多维度信息，故component.categoryValuePattern使用的数据形式为key:value1,value2,value3...
        String[] arr = component.getCategoryValuePattern().split(COLON_SEPARATOR);
        Set<String> dimensionSet = new HashSet<>(Arrays.asList(arr[1].split(COMMA_SEPARATOR)));
        if (StringUtils.hasText(component.getParams())) {
            //component.params用于子页面传参，值为字段的名字，形式为field1,field2,field3...
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int count = metaData.getColumnCount();
            List<BigDecimal> vList = new ArrayList<>();
            Map<String, Object> radarSeriesMap = new LinkedHashMap<>();
            Map<String, Object> valueData = new HashMap<>();
            //resultSet.getObject返回的是数据库字段类型映射到java的类型，详情参考：https://www.cnblogs.com/hwaggLee/p/5111019.html
            //若数据需要特殊展示，例如日期需要特定格式化，请直接在SQL语句中进行格式化！
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getObject(i).toString();
                if (paramsSet.contains(columnName)) {
                    //封装用于传参的字段以及其对应的值
                    valueData.put(columnName, valueStr);
                }
                if (arr[0].equals(columnName)) {
                    radarSeriesMap.put(NAME, valueStr);
                    radarLegendData.add(valueStr);
                } else if (dimensionSet.contains(columnName)) {
                    BigDecimal decimalValue = (BigDecimal) resultSet.getObject(i);
                    vList.add(decimalValue);
                    //保存维度的最大值
                    if (indicatorMaxMap.get(columnName) == null || indicatorMaxMap.get(columnName).compareTo(decimalValue) < 0) {
                        indicatorMaxMap.put(columnName, decimalValue);
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
