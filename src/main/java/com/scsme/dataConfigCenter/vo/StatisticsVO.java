package com.scsme.dataConfigCenter.vo;

import lombok.Data;

import java.util.Map;

@Data
public class StatisticsVO {
    private Long componentId;
    private Map<String, Object> valueMap;
}
