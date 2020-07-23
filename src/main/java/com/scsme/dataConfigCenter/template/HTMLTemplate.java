package com.scsme.dataConfigCenter.template;

import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

public class HTMLTemplate {
    private static final String DOC_TYPE = "<!DOCTYPE html>";
    private static final String HTML_TAG_START = "<html lang=\"zh-CN\">";
    private static final String HEAD = "<head>\n" +
            "    <meta charset=\"utf-8\">\n" +
            "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n" +
            "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
            "    <title>政府采购大数据平台</title>\n" +
            "    <link href=\"/css/bootstrap.css\" rel=\"stylesheet\">\n" +
            "    <link rel=\"stylesheet\" href=\"/css/base.css\">\n" +
            "    <link rel=\"stylesheet\" href=\"/css/pages/index.css\">\n" +
            "\n" +
            "    <style>\n" +
            "        .t_title{\n" +
            "            width: 100%;\n" +
            "            height: 100%;\n" +
            "            text-align: center;\n" +
            "            font-size: 2.5em;\n" +
            "            line-height: 80px;\n" +
            "            color: #fff;\n" +
            "        }\n" +
            "        #chart_map{\n" +
            "            cursor: pointer;\n" +
            "        }\n" +
            "        .t_show{\n" +
            "            position: absolute;\n" +
            "            top: 0;\n" +
            "            right: 0;\n" +
            "            border-radius: 2px;\n" +
            "            background: #2C58A6;\n" +
            "            padding: 2px 5px;\n" +
            "            color: #fff;\n" +
            "            cursor: pointer;\n" +
            "        }\n" +
            "    </style>\n" +
            "</head>";
    private static final String BODY_TAG_START = "<body>\n";
    private static final String TITLE = "<!--header-->\n" +
            "<div class=\"header\">\n" +
            "    <div class=\"bg_header\">\n" +
            "        <div class=\"header_nav fl t_title\">\n" +
            "            $\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>";
    private static final String MAIN = "<!--main-->\n" +
            "<div class=\"data_content\">\n" +
            "    <div class=\"data_time\">\n" +
            "        温馨提示: 点击模块后跳转至详情页面。\n" +
            "    </div>\n" +
            "\n" +
            "    <div class=\"data_main\">\n" +
            "        $\n" +
            "    </div>\n" +
            "</div>";
    private static final String BODY_TAG_END = "</body>\n";
    private static final String SCRIPT_IMPORT = "<script src=\"/js/jquery-2.2.1.min.js\"></script>\n" +
            "<script src=\"/js/bootstrap.min.js\"></script>\n" +
            "<script src=\"/js/common.js\"></script>\n" +
            "<script src=\"/js/echarts.min.js\"></script>\n" +
            "<script src=\"/js/axios.js\"></script>\n" +
            "<script src=\"/js/china.js\"></script>";
    private static final String HTML_TAG_END = "</html>";

    private static final String DYNAMIC_DIV_START = "<div style=\"width: 100%; float: left\">";
    private static final String DYNAMIC_DIV_END = "</div>";

    public static void generatedHTMLFile(LayoutVO layout){
        String title = layout.getTitle();
        String titleHTML = TITLE.replace("$", title);
        List<ComponentVO> components = layout.getComponents();
        Integer y = components.get(0).getY();
        StringBuilder s = new StringBuilder(DYNAMIC_DIV_START);
        for (int i = 0; i < components.size(); i++) {
            ComponentVO vo = components.get(i);
            if (!vo.getY().equals(y)) {
                //换行添加元素
                y = vo.getY();
                s.append(DYNAMIC_DIV_END);
                s.append(DYNAMIC_DIV_START);
                addContent(s, vo, null);
            } else {
                //同一行添加元素
                addContent(s, vo, (i - 1 >= 0) ? components.get(i-1) : null);
            }
        }
        s.append(DYNAMIC_DIV_END);
        String mainHTML = MAIN.replace("$", s.toString());

        StringBuilder htmlContent = new StringBuilder(DOC_TYPE);
        htmlContent.append(HTML_TAG_START);
        htmlContent.append(HEAD);
        htmlContent.append(BODY_TAG_START);
        htmlContent.append(titleHTML);
        htmlContent.append(mainHTML);
        htmlContent.append(BODY_TAG_END);
        htmlContent.append(SCRIPT_IMPORT);
        htmlContent.append(HTML_TAG_END);

        //写入到本地文件
        ClassPathResource resource = new ClassPathResource("/templates/");
        try {
            File file = new File(resource.getURI().getPath() + "index2.html");
            if (file.exists()) {
                Files.delete(Paths.get(file.getPath()));
            }
            Files.write(Paths.get(file.getPath()),htmlContent.toString().getBytes());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void addContent(StringBuilder s, ComponentVO vo, ComponentVO pre){
        String divHTML = "            <div style=\"width: $0%; height: $1px; float: left; border: solid 1px red; position: relative; top: 0; left: $2%;\">\n" +
                "                <div style=\"background-color: white; padding: 10px; width: 100%; height: 100%\"></div>\n" +
                "            </div>";
        divHTML = divHTML.replace("$0", vo.getWidth().toString());
        divHTML = divHTML.replace("$1", (vo.getHeight() * 100) + "");
        if (pre == null) {
            divHTML = divHTML.replace("$2", vo.getX() + "");
        } else {
            divHTML = divHTML.replace("$2", (vo.getX() - pre.getWidth()) + "");
        }
        s.append(divHTML);
    }
}
