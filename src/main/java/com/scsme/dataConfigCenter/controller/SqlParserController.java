package com.scsme.dataConfigCenter.controller;

import com.scsme.dataConfigCenter.util.SQLParserUtil;
import com.scsme.dataConfigCenter.vo.Result;
import com.scsme.dataConfigCenter.vo.SqlVO;
import lombok.extern.slf4j.Slf4j;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.select.PlainSelect;
import net.sf.jsqlparser.statement.select.Select;
import net.sf.jsqlparser.statement.select.SelectBody;
import net.sf.jsqlparser.statement.select.SelectExpressionItem;
import net.sf.jsqlparser.statement.select.SelectItem;
import net.sf.jsqlparser.statement.select.SelectItemVisitorAdapter;
import net.sf.jsqlparser.statement.select.SetOperationList;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("sql")
@Slf4j
public class SqlParserController {
    @PostMapping("/validate")
    public Result<Boolean> validate(@RequestBody SqlVO vo) {
        Result<Boolean> result = new Result<>();
        try {
            CCJSqlParserUtil.parseStatements(vo.getSql());
            result.success("校验SQL语句成功！");
        } catch (JSQLParserException e) {
            e.printStackTrace();
            result.success("SQL存在语法错误！");
            result.setResult(false);
        } catch (Exception e) {
            e.printStackTrace();
            result.error500("校验SQL语句失败！");
        }
        return result;
    }

    @PostMapping("/validateWithParams")
    public Result<Boolean> validateWithParams(@RequestBody SqlVO vo) {
        Result<Boolean> result = new Result<>();
        try {
            CCJSqlParserUtil.parseStatements(SQLParserUtil.parseSqlWithParams(vo.getSql(), vo.getParams()));
            result.success("校验SQL语句成功！");
        } catch (JSQLParserException e) {
            e.printStackTrace();
            result.success("SQL存在语法错误！");
            result.setResult(false);
        } catch (Exception e) {
            e.printStackTrace();
            result.error500("校验SQL语句失败！");
        }
        return result;
    }

    @PostMapping("/selections")
    public Result<Set<String>> selections(@RequestBody SqlVO vo) {
        Result<Set<String>> result = new Result<>();
        try {
            Set<String> set = new HashSet<>();
            Select stmt = (Select) CCJSqlParserUtil.parse(SQLParserUtil.parseSqlWithParams(vo.getSql(), vo.getParams()));
            SelectBody selectBody = stmt.getSelectBody();
            if (selectBody instanceof PlainSelect) {
                addSelectionName((PlainSelect) selectBody, set);
            } else if (selectBody instanceof SetOperationList) {
                List<SelectBody> selects = ((SetOperationList) selectBody).getSelects();
                selects.forEach(s -> {
                    addSelectionName((PlainSelect) s, set);
                });
            }
            result.success("解析SQL语句成功！");
            result.setResult(set);
        } catch (JSQLParserException e) {
            e.printStackTrace();
            result.error500("SQL存在语法错误！");
        } catch (Exception e) {
            e.printStackTrace();
            result.error500("校验SQL语句失败！");
        }
        return result;
    }

    private void addSelectionName(PlainSelect select, Set<String> set) {
        List<SelectItem> selectItems = select.getSelectItems();
        selectItems.forEach(item -> {
            item.accept(new SelectItemVisitorAdapter() {
                @Override
                public void visit(SelectExpressionItem expressionItem) {
                    if (expressionItem.getAlias() != null) {
                        String name = expressionItem.getAlias().getName();
                        name = name.replaceAll("'", "");
                        set.add(name);
                    } else {
                        String name = expressionItem.getExpression().toString();
                        name = name.replaceAll("'", "");
                        set.add(name);
                    }
                }
            });
        });
    }
}
