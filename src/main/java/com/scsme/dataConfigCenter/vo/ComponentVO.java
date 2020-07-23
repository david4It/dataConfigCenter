package com.scsme.dataConfigCenter.vo;

import com.scsme.dataConfigCenter.pojo.Component;
import lombok.Data;

@Data
public class ComponentVO extends Component {
    public Component trans(Long layoutId){
        Component component = new Component();
        component.setLayoutId(layoutId);
        component.setType(this.getType());
        component.setTitle(this.getTitle());
        component.setQuery(this.getQuery());
        component.setLink(this.getLink());
        component.setParams(this.getParams());
        component.setLocationIndex(this.getLocationIndex());
        component.setX(this.getX());
        component.setY(this.getY());
        component.setWidth(this.getWidth());
        component.setHeight(this.getHeight());
        component.setCreateTime(this.getCreateTime());
        component.setLastUpdateTime(this.getLastUpdateTime());
        return component;
    }
}
