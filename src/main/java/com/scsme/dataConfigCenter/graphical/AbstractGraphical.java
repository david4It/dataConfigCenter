package com.scsme.dataConfigCenter.graphical;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.util.SQLParserUtil;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
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
import java.util.regex.Pattern;

public abstract class AbstractGraphical {
    static final String LEGEND_DATA = "legendData";
    static final String SERIES_DATA = "seriesData";
    static final String X_AXIS_DATA = "xAxisData";
    static final String NAME = "name";
    static final String VALUE = "value";
    static final String MAX = "max";
    static final String RADAR_INDICATOR = "radarIndicator";
    static final String EXT_DATA = "extData";
    private static final String CONFIG_JSON = "configJson";
    static final String COLON_SEPARATOR = ":";
    static final String COMMA_SEPARATOR = ",";
    private static final String DIGITS_PATTERN = "^[\\d.,]+$";

    private DataSource dataSource;
    private Component component;
    private Map<String, Object> valueMap;

    AbstractGraphical(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        this.dataSource = dataSource;
        this.component = component;
        this.valueMap = valueMap;
    }

    Map<String, Object> getGraphicalData() throws Exception {
        String sql = component.getQuery();
        if (valueMap != null) {
            sql = SQLParserUtil.parseSqlWithValues(sql, valueMap);
        }
        String configJson = component.getConfigJson();
        Map<String, Object> result = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            transMap(resultSet, component, result);
            //TODO 后期调整，直接将数据绑定到configJson中，前端直接merge即可
            if (StringUtils.hasText(configJson)) {
                result.put(CONFIG_JSON, new ObjectMapper().readValue(configJson, Object.class));
            }
        }
        return result;
    }

    BigDecimal getDecimalValue(String value) {
        if (isDigits(value)) {
            value = value.replaceAll(COMMA_SEPARATOR, "").trim();
        } else {
            value = "0";
        }
        return new BigDecimal(value);
    }

    private boolean isDigits(String value) {
        Pattern pattern = Pattern.compile(DIGITS_PATTERN);
        if (StringUtils.hasText(value)) {
            return pattern.matcher(value).find();
        }
        return false;
    }

    void arrangement(Component component, ResultSet resultSet, List<Map<String, Object>> mapList, List<String> strList) throws Exception {
        Set<String> paramsSet = new HashSet<>();
        String[] arr = component.getCategoryValuePattern().split(COLON_SEPARATOR);
        if (StringUtils.hasText(component.getParams())) {
            String[] split = component.getParams().split(COMMA_SEPARATOR);
            paramsSet.addAll(Arrays.asList(split));
        }
        while (resultSet.next()) {
            ResultSetMetaData metaData = resultSet.getMetaData();
            int count = metaData.getColumnCount();
            Map<String, Object> valueData = new HashMap<>();
            for (int i = 1; i <= count; i++) {
                String columnName = metaData.getColumnName(i);
                String valueStr = resultSet.getString(i);
                if (paramsSet.contains(columnName)) {
                    if (valueData.get(EXT_DATA) != null) {
                        ((Map)valueData.get(EXT_DATA)).put(columnName, valueStr);
                    } else {
                        Map<String, String> extDataMap = new HashMap<>();
                        extDataMap.put(columnName, valueStr);
                        valueData.put(EXT_DATA, extDataMap);
                    }
                } else {
                    if (columnName.equals(arr[0])) {
                        strList.add(valueStr);
                        valueData.put(NAME, valueStr);
                    } else if (columnName.equals(arr[1])) {
                        valueData.put(VALUE, getDecimalValue(valueStr));
                    }
                }
            }
            mapList.add(valueData);
        }
    }

    abstract void transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception;
}
