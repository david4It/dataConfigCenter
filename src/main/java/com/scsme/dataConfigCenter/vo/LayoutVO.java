package com.scsme.dataConfigCenter.vo;

import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LayoutVO extends Layout {
    private List<ComponentVO> components = new ArrayList<>();
    public Layout transLayout() {
        Layout layout = new Layout();
        layout.setUrl(this.getUrl());
        layout.setCreateTime(this.getCreateTime());
        layout.setTitle(this.getTitle());
        layout.setLastUpdateTime(this.getLastUpdateTime());
        return layout;
    }

    public List<Component> transComponents(Long layoutId) {
        List<Component> list = new ArrayList<>();
        components.forEach((c) -> {
            list.add(c.trans(layoutId));
        });
        return list;
    }
}
