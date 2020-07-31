package com.scsme.dataConfigCenter.controller;

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
import java.util.List;

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

    @PostMapping("/selections")
    public Result<List<String>> selections(@RequestBody SqlVO vo) {
        Result<List<String>> result = new Result<>();
        try {
            List<String> list = new ArrayList<>();
            Select stmt = (Select) CCJSqlParserUtil.parse(vo.getSql());
            SelectBody selectBody = stmt.getSelectBody();
            if (selectBody instanceof PlainSelect) {
                addSelectionName((PlainSelect) selectBody, list);
            } else if (selectBody instanceof SetOperationList) {
                List<SelectBody> selects = ((SetOperationList) selectBody).getSelects();
                selects.forEach(s -> {
                    addSelectionName((PlainSelect) s, list);
                });
            }
            result.success("解析SQL语句成功！");
            result.setResult(list);
        } catch (Exception e) {
            e.printStackTrace();
            result.error500("解析SQL语句失败！");
        }
        return result;
    }

    private void addSelectionName(PlainSelect select, List<String> list) {
        List<SelectItem> selectItems = select.getSelectItems();
        selectItems.forEach(item -> {
            item.accept(new SelectItemVisitorAdapter() {
                @Override
                public void visit(SelectExpressionItem expressionItem) {
                    if (expressionItem.getAlias() != null) {
                        list.add(expressionItem.getAlias().getName());
                    } else {
                        list.add(expressionItem.getExpression().toString());
                    }
                }
            });
        });
    }
}
