package com.scsme.dataConfigCenter.graph;

import com.alibaba.fastjson.JSONArray;
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

public class Bar extends AbstractGraph {

    public Bar(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
        Set<String> paramsSet = new LinkedHashSet<>();
        Set<String> legendSet = new LinkedHashSet<>();
        Set<String> dimensionSet = new LinkedHashSet<>();
        Map<String, List<JSONObject>> legendMap = new LinkedHashMap<>();
        //为了支持柱状图的复合类型，使用key:value:legend的形式对category_value_pattern
        String[] arr = component.getCategoryValuePattern().split(COLON_SEPARATOR);
        if (StringUtils.hasText(component.getParams())) {
            //component.params用于子页面传参，形式为field1,field2,field3...
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int count = metaData.getColumnCount();
            String legendValue = null;
            JSONObject valueData = new JSONObject();
            //resultSet.getObject返回的是数据库映射到java的类型，详情参考：https://www.cnblogs.com/hwaggLee/p/5111019.html
            //若数据需要特殊展示，例如日期需要特定格式化，请直接在SQL语句中进行格式化！
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getObject(i).toString();
                if (paramsSet.contains(columnName)) {
                    //封装用于传参的字段以及其对应的值
                    if (valueData.get(EXT_DATA) != null) {
                        ((JSONObject)valueData.get(EXT_DATA)).put(columnName, valueStr);
                    } else {
                        JSONObject extData = new JSONObject();
                        extData.put(columnName, valueStr);
                        valueData.put(EXT_DATA, extData);
                    }
                }
                //封装用于展示的数据
                if (columnName.equals(arr[0])) {
                    dimensionSet.add(valueStr);
                    valueData.put(NAME, valueStr);
                } else if (columnName.equals(arr[1])) {
                    valueData.put(VALUE, valueStr);
                } else if (columnName.equals(arr[2])) {
                    legendSet.add(valueStr);
                    legendValue = valueStr;
                }
            }
            if (legendMap.containsKey(legendValue)) {
                legendMap.get(legendValue).add(valueData);
            } else {
                List<JSONObject> details = new ArrayList<>();
                details.add(valueData);
                legendMap.put(legendValue, details);
            }
        }
        result.put(LEGEND_DATA, legendSet);
        result.put(AXIS_DATA, dimensionSet);
        result.put(SERIES_DATA, legendMap);
    }
}
