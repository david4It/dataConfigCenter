package com.scsme.dataConfigCenter.service;

import java.util.Map;

public interface StatisticsService {
    Map<String, Object> query(Long componentId, Map<String, Object> params) throws Exception;
}
