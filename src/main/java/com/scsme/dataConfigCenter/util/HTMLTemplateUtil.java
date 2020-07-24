package com.scsme.dataConfigCenter.util;

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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HTMLTemplateUtil {
    private static final String TEMPLATES_DIR = "/templates/";
    private static final String FREEMARKER_DIR = "/freemarker/";

    public static void generatedHTMLFile(LayoutVO layout) {
        List<ComponentVO> components = layout.getComponents();
        StringBuilder s = new StringBuilder();
        components.forEach((c) -> {
            addContent(s, c);
        });

        //写入到本地文件
        Configuration configuration = new Configuration(Configuration.VERSION_2_3_30);
        try {
            configuration.setDirectoryForTemplateLoading(new File(new ClassPathResource(FREEMARKER_DIR).getURI().getPath()));
            Template template = configuration.getTemplate("template.ftl");
            Map<String, Object> dataMap = new HashMap<>();
            dataMap.put("title", layout.getTitle());
            dataMap.put("body", s.toString());
            File file = new File(new ClassPathResource(TEMPLATES_DIR).getURI().getPath() + layout.getUrl() + ".html");
            file.deleteOnExit();
            try (Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file)))) {
                template.process(dataMap, out);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void addContent(StringBuilder s, ComponentVO vo){
        String divHTML = "            <div style=\"width: $0%; height: $1px; position: absolute; top: $2px; left: $3%; padding: 15px;\">\n" +
                "                <dv-border-box-8></dv-border-box-8>" +
                "            </div>";
        divHTML = divHTML.replace("$0", vo.getWidth() + "");
        divHTML = divHTML.replace("$1", (vo.getHeight() * 100) + "");
        divHTML = divHTML.replace("$2", (vo.getY() * 100) + "");
        divHTML = divHTML.replace("$3", vo.getX() + "");
        s.append(divHTML);
    }
}
