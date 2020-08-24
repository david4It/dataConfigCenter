package com.scsme.dataConfigCenter.util;

import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SQLParserUtil {
    public static String parseSqlWithParams(String sql, String[] params) {
        for (int i = 0; i < params.length; i++) {
            String regex = "\\$\\{\\s*(" + params[i] + ")\\s*}";
            Pattern p = Pattern.compile(regex);
            Matcher matcher = p.matcher(sql);
            if (matcher.find()) {
                //将所有使用${}变量的值修改为1，仅为获取select字段；避免在类似LIMIT ${a} 替换变量时，造成语法解析错误
                sql = matcher.replaceAll("1");
            }
        }
        return sql;
    }

    public static String parseSqlWithValues(String sql, Map<String, Object> map) {
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            String regex = "\\$\\{\\s*(" + key + ")\\s*}";
            Pattern p = Pattern.compile(regex);
            Matcher matcher = p.matcher(sql);
            if (matcher.find()) {
                sql = matcher.replaceAll(map.get(key).toString());
            }
        }
        return sql;
    }
}