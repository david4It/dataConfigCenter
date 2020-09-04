package com.scsme.dataConfigCenter.service;

import com.scsme.dataConfigCenter.vo.LayoutVO;
import com.scsme.dataConfigCenter.vo.Result;

import java.io.IOException;
import java.util.List;

public interface LayoutService {
    List<LayoutVO> list(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize);
    List<LayoutVO> treePageList(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize);
    List<LayoutVO> treeList();
    List<LayoutVO> enabledLayouts();
    Boolean deleteLayout(Long id) throws Exception;
    Boolean saveLayout(LayoutVO layout);
    Long saveSubLayout(LayoutVO layout);
    void updateLayout(LayoutVO layout) throws Exception;
    void enabled(LayoutVO layout) throws Exception;
    void preview(LayoutVO layout) throws Exception;
    Boolean checkUrl(String url, String id);
    List<String> thumbnails() throws IOException;
}
