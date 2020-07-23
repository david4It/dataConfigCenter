package com.scsme.dataConfigCenter.util;

import com.scsme.dataConfigCenter.template.HTMLTemplate;
import com.scsme.dataConfigCenter.vo.LayoutVO;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HTMLCreationUtil {
    public static ExecutorService service = Executors.newCachedThreadPool();
    public static void generatedHTMLFile(LayoutVO layout) {
        service.submit(() -> {
            HTMLTemplate.generatedHTMLFile(layout);
        });
    }
}
