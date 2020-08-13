package com.scsme.dataConfigCenter.executor;

import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.vo.LayoutVO;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.ReentrantLock;

public class HTMLCreationExecutor {
    public final static ExecutorService service = Executors.newCachedThreadPool();
    //使用lock解决多线程情况下，同一个布局删除和生成的并发问题
    private static volatile Set<Long> identity = new HashSet<>();
    private static ReentrantLock lock = new ReentrantLock(true);
    public static void generatedHTMLFile(LayoutVO layout, LayoutMapper layoutMapper) {
        service.submit(() -> {
            Long id = layout.getId();
            while (true) {
                if (!identity.contains(id)) {
                    try {
                        lock.lock();
                        identity.add(id);
                        HTMLTemplateUtil.generateHTMLFile(layout, layoutMapper);
                        break;
                    } finally {
                        identity.remove(id);
                        lock.unlock();
                    }
                }
            }
        });
    }
    public static void deleteHTMLFile(Long layoutId, String url, LayoutMapper layoutMapper) {
        service.submit(() -> {
            while (true) {
                if (!identity.contains(layoutId)) {
                    try {
                        lock.lock();
                        identity.add(layoutId);
                        HTMLTemplateUtil.deleteHTMLFile(layoutId, url, layoutMapper);
                        break;
                    } finally {
                        identity.remove(layoutId);
                        lock.unlock();
                    }
                }
            }
        });
    }
}
