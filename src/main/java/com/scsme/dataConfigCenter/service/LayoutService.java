package com.scsme.dataConfigCenter.service;

import com.scsme.dataConfigCenter.vo.LayoutVO;

public interface LayoutService {
    Boolean saveLayout(LayoutVO layout);
    Boolean checkUrl(String url);
}
