package com.scsme.dataConfigCenter.util;

import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import freemarker.template.Configuration;
import freemarker.template.Template;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
public class HTMLTemplateUtil {
    private static final String TEMPLATES_DIR = "/templates/";
    private static final String FREEMARKER_DIR = "/templates/freemarker/";
    private static final String TEMPLATE_SUFFIX = ".ftl";
    private static final String HTML_SUFFIX = ".html";
    private static final String TITLE = "title";
    private static final String COMPONENTS = "components";

    public static void deleteHTMLFile(Long layoutId, String url, LayoutMapper layoutMapper) {
        try {
            File file = new File(new ClassPathResource(TEMPLATES_DIR).getURI().getPath() + url + HTML_SUFFIX);
            file.delete();
            if (layoutMapper != null) {
                layoutMapper.removeLayoutFile(layoutId);
            }
        } catch (Exception e) {
            log.error("删除HTML失败....");
            log.error(e.getLocalizedMessage());
            e.printStackTrace();
        }
    }

    public static void generateHTMLFile(LayoutVO layout, LayoutMapper layoutMapper) {
        //写入到本地文件
        List<ComponentVO> components = layout.getComponents();
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
        try {
            configuration.setDirectoryForTemplateLoading(new File(new ClassPathResource(FREEMARKER_DIR).getURI().getPath()));
            Template template = configuration.getTemplate(layout.getTemplateName() + TEMPLATE_SUFFIX);
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put(TITLE, layout.getTitle());
            dataMap.put(COMPONENTS, components);
            File file = new File(new ClassPathResource(TEMPLATES_DIR).getURI().getPath() + layout.getUrl() + HTML_SUFFIX);
            file.delete();
            try (Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file)))) {
                template.process(dataMap, out);
            }
            if (layoutMapper != null) {
                layout.setFile(Files.readAllBytes(Paths.get(file.getPath())));
                layoutMapper.updateById(layout);
            }
        } catch (Exception e) {
            log.error("生成HTML失败....");
            log.error(e.getLocalizedMessage());
            e.printStackTrace();
        }
    }
}
