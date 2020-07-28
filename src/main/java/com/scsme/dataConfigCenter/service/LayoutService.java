package com.scsme.dataConfigCenter.service;

import com.scsme.dataConfigCenter.vo.LayoutVO;
import com.scsme.dataConfigCenter.vo.Result;

import java.util.List;

public interface LayoutService {
    List<LayoutVO> list(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize);
    List<LayoutVO> enabledLayouts();
    LayoutVO queryLayout(Long id);
    Boolean saveLayout(LayoutVO layout);
    Boolean updateLayout(LayoutVO layout);
    Boolean checkUrl(String url);
}
