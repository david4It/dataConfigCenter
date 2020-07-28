package com.scsme.dataConfigCenter.util;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

public class GraphicalDataUtil {
    public Map<String, Object> getGraphicalDataMap(DataSource dataSource, String sql, String dataType) {
        Graphical graphical = Graphical.valueOf(dataType);
        try (Connection connection = dataSource.getConnection()) {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                //TODO 根据Graphical类型返回结果Map数据
                switch (graphical) {
                    case BAR:
                        break;
                    case PIE:
                        break;
                    case LINE:
                        break;
                    case RADAR:
                        break;
                    case TABLE_ROLL:
                        break;
                    case TABLE_STATIC:
                        break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private enum Graphical {
        BAR("bar"),PIE("pie"), LINE("line"), TABLE_STATIC("table_static"),
            TABLE_ROLL("table_roll"), RADAR("radar");

        private Graphical(String value) {
            this.value = value;
        }

        private String value;

        public String getValue() {
            return value;
        }
    }
}
