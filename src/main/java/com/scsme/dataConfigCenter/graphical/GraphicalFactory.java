package com.scsme.dataConfigCenter.graphical;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.springframework.util.StringUtils;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

public class GraphicalFactory {
    private GraphicalFactory(){};

    public static GraphicalFactory getInstance() {
        return GraphicalInstance.INSTANCE;
    }

    private static class GraphicalInstance {
        private static final GraphicalFactory INSTANCE= new GraphicalFactory();
    }

    public Map<String, Object> getGraphicalDataMap(DataSource dataSource, Component component, Map<String, Object> valueMap) throws Exception {
        GraphicalType graphicalType = GraphicalType.valueOf(component.getType().toUpperCase());
        AbstractGraphical graphical = null;
        switch (graphicalType) {
            case LINE:
                graphical = new Line(dataSource, component, valueMap);
                break;
            case BAR:
                graphical = new Bar(dataSource, component, valueMap);
                break;
            case PIE:
                graphical = new Pie(dataSource, component, valueMap);
                break;
            case RADAR:
                graphical = new Radar(dataSource, component, valueMap);
                break;
            case TABLE:
                graphical = new Table(dataSource, component, valueMap);
                break;
            case MAP:
                graphical = new com.scsme.dataConfigCenter.graphical.Map(dataSource, component, valueMap);
        }
        return graphical.getGraphicalData();
    }

    public Map<String, Object> getPreviewGraphicalDataMap(Component component) throws Exception {
        Map<String, Object> result = new HashMap<>();
        String configJson = component.getConfigJson();
        if (StringUtils.hasText(configJson)) {
            result.put(AbstractGraphical.CONFIG_JSON, new ObjectMapper().readValue(configJson, Object.class));
        }
        return result;
    }

    private enum GraphicalType {
        BAR("bar"), PIE("pie"), LINE("line"), TABLE("table"), RADAR("radar"), MAP("map");

        GraphicalType(String value) {
            this.value = value;
        }

        private String value;

        public String getValue() {
            return value;
        }
    }
}
