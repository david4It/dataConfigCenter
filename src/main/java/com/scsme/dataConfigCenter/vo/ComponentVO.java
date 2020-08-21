package com.scsme.dataConfigCenter.vo;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.scsme.dataConfigCenter.pojo.Component;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ComponentVO extends Component {
    private String linkUrl;
    private String linkTitle;
    private String linkEnabled;
    private Boolean sqlValid;
    private Boolean animationEnabled = false;
    public Component trans(){
        Component component = new Component();
        component.setLayoutId(this.getLayoutId());
        component.setType(this.getType());
        component.setTitle(this.getTitle());
        component.setQuery(this.getQuery());
        component.setLink(this.getLink());
        component.setParams(this.getParams());
        component.setCategoryValuePattern(this.getCategoryValuePattern());
        component.setLocationIndex(this.getLocationIndex());
        component.setX(this.getX());
        component.setY(this.getY());
        component.setWidth(this.getWidth());
        component.setHeight(this.getHeight());
        component.setConfigJson(this.getConfigJson());
        component.setCreateTime(LocalDateTime.now());
        return component;
    }

//    public Component trans(Long layoutId){
//        Component component = trans();
//        component.setLayoutId(layoutId);
//        return component;
//    }

    public ComponentVO convert(Component component) {
        this.setId(component.getId());
        this.setLayoutId(component.getLayoutId());
        this.setType(component.getType());
        this.setTitle(component.getTitle());
        this.setQuery(component.getQuery());
        this.setLink(component.getLink());
        this.setParams(component.getParams());
        this.setCategoryValuePattern(component.getCategoryValuePattern());
        this.setLocationIndex(component.getLocationIndex());
        this.setX(component.getX());
        this.setY(component.getY());
        this.setWidth(component.getWidth());
        this.setHeight(component.getHeight());
        this.setConfigJson(component.getConfigJson());
        this.setCreateTime(component.getCreateTime());
        if (StringUtils.hasText(component.getConfigJson())) {
            JSONObject jsonObject = JSONObject.parseObject(component.getConfigJson());
            if (jsonObject.containsKey("cusAnimation") && "Y".equals(jsonObject.getJSONObject("cusAnimation").getString("enable"))) {
                this.setAnimationEnabled(true);
            }
        }
        return this;
    }
}
