package com.scsme.dataConfigCenter.graphical;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.util.SQLParserUtil;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

public abstract class AbstractGraphical {
    static final String LEGEND_DATA = "legendData";
    static final String SERIES_DATA = "seriesData";
    static final String X_AXIS_DATA = "xAxisData";
    static final String NAME = "name";
    static final String VALUE = "value";
    static final String MAX = "max";
    static final String RADAR_INDICATOR = "radarIndicator";
    static final String EXT_DATA = "extData";
    static final String CONFIG_JSON = "configJson";
    static final String COLON_SEPARATOR = ":";
    static final String COMMA_SEPARATOR = ",";

    protected DataSource dataSource;
    protected Component component;
    protected Map<String, Object> valueMap;

    AbstractGraphical(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        this.dataSource = dataSource;
        this.component = component;
        this.valueMap = valueMap;
    }

    Map<String, Object> getGraphicalData() throws Exception {
        String sql = component.getQuery();
        if (valueMap != null) {
            //替换SQL语句中的变量，得到完整的SQL语句
            sql = SQLParserUtil.parseSqlWithValues(sql, valueMap);
        }
        String configJson = component.getConfigJson();
        Map<String, Object> result = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            //处理结果集
            transMap(resultSet, component, result);
            if (StringUtils.hasText(configJson)) {
                //封装自定义配置的json数据信息
                result.put(CONFIG_JSON, new ObjectMapper().readValue(configJson, Object.class));
            }
        }
        return result;
    }

    //LINE,BAR,PIE三种数据封装的方法
    void arrangement(Component component, ResultSet resultSet, List<Map<String, Object>> mapList, List<String> strList) throws Exception {
        Set<String> paramsSet = new HashSet<>();
        //component.categoryValuePattern针对LINE,BAR,PIE,GAUGE数据风格，均采用key:value形式，key为分类的字段名，value为值的字段名
        String[] arr = component.getCategoryValuePattern().split(COLON_SEPARATOR);
        if (StringUtils.hasText(component.getParams())) {
            //component.params用于子页面传参，形式为field1,field2,field3...
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int count = metaData.getColumnCount();
            Map<String, Object> valueData = new HashMap<>();
            //resultSet.getObject返回的是数据库映射到java的类型，详情参考：https://www.cnblogs.com/hwaggLee/p/5111019.html
            //若数据需要特殊展示，例如日期需要特定格式化，请直接在SQL语句中进行格式化！
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getObject(i).toString();
                if (paramsSet.contains(columnName)) {
                    //封装用于传参的字段以及其对应的值
                    if (valueData.get(EXT_DATA) != null) {
                        ((Map)valueData.get(EXT_DATA)).put(columnName, valueStr);
                    } else {
                        Map<String, String> extDataMap = new HashMap<>();
                        extDataMap.put(columnName, valueStr);
                        valueData.put(EXT_DATA, extDataMap);
                    }
                }
                //封装用于展示的数据
                if (columnName.equals(arr[0])) {
                    strList.add(valueStr);
                    valueData.put(NAME, valueStr);
                } else if (columnName.equals(arr[1])) {
                    valueData.put(VALUE, valueStr);
                }
            }
            mapList.add(valueData);
        }
    }

    abstract void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception;
}
