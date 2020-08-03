package com.scsme.dataConfigCenter.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Slf4j
public class GraphicalDataUtil {
    private static final String LEGEND_DATA = "legendData";
    private static final String SERIES_DATA = "seriesData";
    private static final String X_AXIS_DATA = "xAxisData";
    private static final String NAME = "name";
    private static final String VALUE = "value";
    private static final String MAX = "max";
    private static final String RADAR_INDICATOR = "radarIndicator";
    private static final String EXT_DATA = "extData";
    private static final String CONFIG_JSON = "configJson";
    private static final String COLON_SEPARATOR = ":";
    private static final String COMMA_SEPARATOR = ",";
    public static Map<String, Object> getGraphicalDataMap(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        String dataType = component.getType();
        String sql = component.getQuery();
        if (valueMap != null) {
            sql = SQLParserUtil.parseSqlWithValues(sql, valueMap);
        }
        String configJson = component.getConfigJson();
        Graphical graphical = Graphical.valueOf(dataType.toUpperCase());
        Map<String, Object> result = new HashMap<>();
        try (Connection connection = dataSource.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            graphical.transMap(resultSet, component, result);
            //TODO 后期调整，直接将数据绑定到configJson中，前端直接merge即可
            if (StringUtils.hasText(configJson)) {
                result.put(CONFIG_JSON, new ObjectMapper().readValue(configJson, Object.class));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    private enum Graphical {
        BAR("bar"),PIE("pie"), LINE("line"), TABLE("table"), RADAR("radar");

        Graphical(String value) {
            this.value = value;
        }

        private String value;

        public String getValue() {
            return value;
        }

        private void arrangement(Component component, ResultSet resultSet, List<Map<String, Object>> mapList, List<String> strList) throws Exception {
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

        //为了能从ResultSetMetaData中解析到别名，需要在JDBC的url配置信息加上useOldAliasMetadataBehavior=true
        public Map<String, Object> transMap(ResultSet resultSet, Component component, Map<String, Object> result) throws Exception {
            switch (this) {
                case PIE:
                    List<Map<String, Object>> pieSeriesData = new ArrayList<>();
                    List<String> pieLegendData = new ArrayList<>();
                    arrangement(component, resultSet, pieSeriesData, pieLegendData);
                    result.put(LEGEND_DATA, pieLegendData);
                    result.put(SERIES_DATA, pieSeriesData);
                    break;
                case LINE: case BAR:
                    List<Map<String,Object>> lbSeriesData = new ArrayList<>();
                    List<String> lbXAxisData = new ArrayList<>();
                    arrangement(component, resultSet, lbSeriesData, lbXAxisData);
                    result.put(X_AXIS_DATA, lbXAxisData);
                    result.put(SERIES_DATA, lbSeriesData);
                    break;
                case RADAR:
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
                    break;
                case TABLE:
                    Set<String> tableLegendData = new LinkedHashSet<>();
                    List<List<String>> tableSeriesData = new ArrayList<>();
                    while (resultSet.next()) {
                        ResultSetMetaData metaData = resultSet.getMetaData();
                        List<String> seriesData = new ArrayList<>();
                        int count = metaData.getColumnCount();
                        for (int i = 1; i <= count; i++) {
                            tableLegendData.add(metaData.getColumnName(i));
                            seriesData.add(resultSet.getString(i));
                        }
                        tableSeriesData.add(seriesData);
                    }
                    result.put(LEGEND_DATA, tableLegendData);
                    result.put(SERIES_DATA, tableSeriesData);
                    break;
            }
            return result;
        }

        private BigDecimal getDecimalValue(String value) {
            if (isDigits(value)) {
                value = value.replaceAll(COMMA_SEPARATOR, "").trim();
            } else {
                value = "0";
            }
            return new BigDecimal(value);
        }

        private boolean isDigits(String value) {
            Pattern pattern = Pattern.compile("^[\\d.,]+$");
            if (StringUtils.hasText(value)) {
                return pattern.matcher(value).find();
            }
            return false;
        }
    }
}
