package com.scsme.dataConfigCenter.util;

import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import freemarker.template.Configuration;
import freemarker.template.Template;
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

public class HTMLTemplateUtil {
    private static final String TEMPLATES_DIR = "/templates/";
    private static final String FREEMARKER_DIR = "/freemarker/";

    public static void generatedHTMLFile(LayoutVO layout, LayoutMapper layoutMapper) {
        List<ComponentVO> components = layout.getComponents();

        //写入到本地文件
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
        try {
            configuration.setDirectoryForTemplateLoading(new File(new ClassPathResource(FREEMARKER_DIR).getURI().getPath()));
            Template template = configuration.getTemplate("template.ftl");
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("title", layout.getTitle());
            dataMap.put("components", components);
            File file = new File(new ClassPathResource(TEMPLATES_DIR).getURI().getPath() + layout.getUrl() + ".html");
            file.deleteOnExit();
            try (Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file)))) {
                template.process(dataMap, out);
            }
            layout.setFile(Files.readAllBytes(Paths.get(file.getPath())));
            layoutMapper.updateById(layout);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
