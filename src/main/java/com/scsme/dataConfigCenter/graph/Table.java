package com.scsme.dataConfigCenter.graph;

import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class Table extends AbstractGraph {

    public Table(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }

    @Override
    void transMap(ResultSet resultSet, Map<String, Object> result) throws Exception {
        Set<String> tableLegendData = new LinkedHashSet<>();
        List<List<Object>> tableSeriesData = new ArrayList<>();
        List<Map<String, String>> extData = new ArrayList<>();
        Set<String> paramsSet = new HashSet<>();
        //表格的component.categoryValuePattern，值为字段的名称，使用的数据格式为field1,field2,field3,...
        Set<String> headerSet = new HashSet<>(Arrays.asList(component.getCategoryValuePattern().split(COMMA_SEPARATOR)));
        if (StringUtils.hasText(component.getParams())) {
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            List<Object> seriesData = new ArrayList<>();
            Map<String, String> extDataMap = new HashMap<>();
            int count = metaData.getColumnCount();
            //resultSet.getObject返回的是数据库字段类型映射到java的类型，详情参考：https://www.cnblogs.com/hwaggLee/p/5111019.html
            //若数据需要特殊展示，例如日期需要特定格式化，请直接在SQL语句中进行格式化！
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getObject(i).toString();
                if (headerSet.contains(columnName)) {
                    tableLegendData.add(columnName);
                    seriesData.add(valueStr);
                }
                if (paramsSet.contains(columnName)) {
                    //封装用于传参的字段以及其对应的值
                    extDataMap.put(columnName, valueStr);
                }
            }
            extData.add(extDataMap);
            tableSeriesData.add(seriesData);
        }
        result.put(EXT_DATA, extData);
        result.put(LEGEND_DATA, tableLegendData);
        result.put(SERIES_DATA, tableSeriesData);
    }
}