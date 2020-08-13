package com.scsme.dataConfigCenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.vo.ComponentVO;

import java.util.List;

public interface ComponentService extends IService<Component> {
    Boolean saveComponents(List<ComponentVO> components);
    List<ComponentVO> componentList(Long layoutId);
    Boolean updateComponent(Long componentId, Long childLayoutId);
    void deleteComponents(Long layoutId);
    Boolean deleteComponent(Long componentId);
}
