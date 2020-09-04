package com.scsme.dataConfigCenter.graph;

import com.scsme.dataConfigCenter.pojo.Component;

import javax.sql.DataSource;
import java.util.Map;

public class MixLineBar extends Line {
    public MixLineBar(DataSource dataSource, Component component, Map<String, Object> valueMap) {
        super(dataSource, component, valueMap);
    }
}
