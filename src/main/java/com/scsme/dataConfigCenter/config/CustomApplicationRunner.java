package com.scsme.dataConfigCenter.config;

import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomApplicationRunner implements ApplicationRunner {
    @Autowired
    LayoutService layoutService;
    @Autowired
    ComponentService componentService;
    @Override
    public void run(ApplicationArguments args) {
        //服务启动时，根据布局配置，动态生成HTML页面
        try {
            List<LayoutVO> layouts = layoutService.enabledLayouts();
            layouts.forEach(layoutVO -> {
                List<ComponentVO> componentVOS = componentService.componentList(layoutVO.getId());
                layoutVO.setComponents(componentVOS);
                HTMLTemplateUtil.generatedHTMLFile(layoutVO);
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
