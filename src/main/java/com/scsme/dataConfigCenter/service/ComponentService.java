package com.scsme.dataConfigCenter.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scsme.dataConfigCenter.pojo.Component;

import java.util.List;

public interface ComponentService extends IService<Component> {
    Boolean saveComponents(List<Component> components);
    List<Component> componentList(Long layoutId);
}
