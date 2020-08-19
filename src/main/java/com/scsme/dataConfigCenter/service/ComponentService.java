package com.scsme.dataConfigCenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.vo.ComponentVO;

import java.util.List;
import java.util.Set;

public interface ComponentService extends IService<Component> {
    void saveComponents(List<ComponentVO> components) throws Exception;
    List<ComponentVO> componentList(Long layoutId);
    void updateComponent(Long componentId, Long childLayoutId);
    void deleteComponents(Long layoutId);
    void deleteComponent(Long componentId) throws Exception;
    Set<String> validatePageSql(Long layoutId);
}
