package com.scsme.dataConfigCenter.executor;

import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.vo.LayoutVO;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class HTMLCreationExecutor {
    public final static ExecutorService service = Executors.newCachedThreadPool();
    public static void generatedHTMLFile(LayoutVO layout) {
        service.submit(() -> {
            HTMLTemplateUtil.generatedHTMLFile(layout);
        });
    }
}
