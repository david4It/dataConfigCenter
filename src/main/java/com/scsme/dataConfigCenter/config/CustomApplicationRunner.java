package com.scsme.dataConfigCenter.config;

import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CustomApplicationRunner implements ApplicationRunner {
    @Autowired
    LayoutService service;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        //服务启动时，根据布局配置，动态生成HTML页面
        List<LayoutVO> layouts = service.enabledLayouts();
        layouts.forEach(HTMLTemplateUtil::generatedHTMLFile);
    }
}
