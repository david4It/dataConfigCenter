package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class ComponentServiceImpl extends ServiceImpl<ComponentMapper, Component> implements ComponentService {
    @Autowired
    ComponentMapper componentMapper;
    @Autowired
    LayoutMapper layoutMapper;
    @Override
    public Boolean saveComponents(List<ComponentVO> components) {
        //先清除当前layout下所有components，然后再保存
        if (components.size() > 0) {
            deleteComponents(components.get(0).getLayoutId());
            List<Component> componentList = new ArrayList<>();
            components.forEach(c -> {
                componentList.add(c.trans());
            });
            return saveOrUpdateBatch(componentList);
        }
        return false;
    }

    @Override
    public List<ComponentVO> componentList(Long layoutId) {
        QueryWrapper<Component> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("layout_id", layoutId);
        List<Component> componentList = componentMapper.selectList(queryWrapper);
        List<ComponentVO> vos = new ArrayList<>();
        componentList.forEach(c -> {
            ComponentVO convert = new ComponentVO().convert(c);
            if (c.getLink() != null) {
                String linkUrl = layoutMapper.getLayoutUrl(c.getLink());
                convert.setLinkUrl(linkUrl);
            }
            vos.add(convert);
        });
        return vos;
    }

    @Override
    public Boolean updateComponent(Long componentId, Long childLayoutId) {
        Component component = new Component();
        component.setId(componentId);
        component.setLink(childLayoutId);
        return componentMapper.updateById(component) > 0;
    }

    @Override
    public Boolean deleteComponents(Long layoutId) {
        return componentMapper.deletComponenets(layoutId) > 0;
    }
}
