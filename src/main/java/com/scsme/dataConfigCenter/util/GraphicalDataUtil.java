package com.scsme.dataConfigCenter.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GraphicalDataUtil {
    public static Map<String, Object> getGraphicalDataMap(DataSource dataSource, Component component) {
        String dataType = component.getType();
        String sql = component.getQuery();
        String configJson = component.getConfigJson();
        Graphical graphical = Graphical.valueOf(dataType.toUpperCase());
        try (Connection connection = dataSource.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            Map<String, Object> result = new HashMap<>();
            while (resultSet.next()) {
                List<String> keys = new ArrayList<>();
                List<String> values = new ArrayList<>();
                ResultSetMetaData metaData = resultSet.getMetaData();
                int count = metaData.getColumnCount();
                for (int i = 1; i <= count; i++) {
                    keys.add(metaData.getColumnName(i));
                    values.add(resultSet.getString(i));
                }
                //TODO 根据Graphical类型返回结果Map数据
                switch (graphical) {
                    case BAR:
                        break;
                    case PIE:
                        break;
                    case LINE:
                        result.put("xAxisData", keys);
                        List<BigDecimal> decimals = new ArrayList<>();
                        values.forEach(v -> {
                            decimals.add(new BigDecimal(v.replaceAll(",","").trim()));
                        });
                        result.put("seriesData", decimals);
                        if (StringUtils.hasText(configJson)) {
                            result.put("configJson", new ObjectMapper().readValue(configJson, Object.class));
                        }
                        break;
                    case RADAR:
                        break;
                    case TABLE_ROLL:
                        break;
                    case TABLE_STATIC:
                        break;
                }
            }
            return result;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private enum Graphical {
        BAR("bar"),PIE("pie"), LINE("line"), TABLE_STATIC("table_static"),
            TABLE_ROLL("table_roll"), RADAR("radar");

        Graphical(String value) {
            this.value = value;
        }

        private String value;

        public String getValue() {
            return value;
        }
    }
}
