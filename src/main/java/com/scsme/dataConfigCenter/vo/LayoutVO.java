package com.scsme.dataConfigCenter.vo;

import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LayoutVO extends Layout {
    private List<ComponentVO> components = new ArrayList<>();
    private List<LayoutVO> children = new ArrayList<>();
    //下钻布局中需要保存父组件的id，以形成对应关系
    private Long parentComponentId;
    public Layout transLayout() {
        Layout layout = new Layout();
        layout.setId(this.getId());
        layout.setEnabled(this.getEnabled());
        layout.setUrl(this.getUrl());
        layout.setCreateTime(this.getCreateTime());
        layout.setTitle(this.getTitle());
        layout.setTemplateName(this.getTemplateName());
        layout.setLastUpdateTime(this.getLastUpdateTime());
        return layout;
    }

    public LayoutVO convert(Layout layout) {
        this.setId(layout.getId());
        this.setEnabled(layout.getEnabled());
        this.setCreateTime(layout.getCreateTime());
        this.setLastUpdateTime(layout.getLastUpdateTime());
        this.setTitle(layout.getTitle());
        this.setTemplateName(layout.getTemplateName());
        this.setUrl(layout.getUrl());
        return this;
    }

//    public List<Component> transComponents(Long layoutId) {
//        List<Component> list = new ArrayList<>();
//        components.forEach((c) -> {
//            list.add(c.trans(layoutId));
//        });
//        return list;
//    }
//
//    public List<Component> transComponents() {
//        List<Component> list = new ArrayList<>();
//        components.forEach((c) -> {
//            list.add(c.trans());
//        });
//        return list;
//    }
//
//    public void convertComponents(List<Component> components) {
//        this.components.clear();
//        components.forEach((c) -> {
//            this.components.add(new ComponentVO().convert(c));
//        });
//    }
}
