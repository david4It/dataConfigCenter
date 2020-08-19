package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.util.SQLParserUtil;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class ComponentServiceImpl extends ServiceImpl<ComponentMapper, Component> implements ComponentService {
    @Autowired
    ComponentMapper componentMapper;
    @Autowired
    LayoutMapper layoutMapper;
    @Autowired
    LayoutService layoutService;
    @Override
    public void saveComponents(List<ComponentVO> components) throws Exception {
        //先清除当前layout下所有components，然后再保存
        if (components.size() > 0) {
            Long layoutId = components.get(0).getLayoutId();
            deleteComponents(layoutId);
            List<Component> componentList = new ArrayList<>();
            components.forEach(c -> {
                componentList.add(c.trans());
            });
            Layout layout = layoutMapper.selectById(layoutId);
            boolean result = saveOrUpdateBatch(componentList);
            if (!result) {
                throw new RuntimeException("批量保存组件失败！");
            }
            //保存组件需要重新生成页面，以及将所有页面和子页面设置为禁用状态
            layoutService.updateLayout(new LayoutVO().convert(layout));
        }
    }

    @Override
    public List<ComponentVO> componentList(Long layoutId) {
        QueryWrapper<Component> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("layout_id", layoutId);
        List<Component> componentList = componentMapper.selectList(queryWrapper);
        List<ComponentVO> vos = new ArrayList<>();
        componentList.forEach(c -> {
            ComponentVO convert = new ComponentVO().convert(c);
            if (c.getLink() != null) {
                Map<String, String> resultMap = layoutMapper.getLayoutUrl(c.getLink());
                convert.setLinkEnabled(resultMap.get("enabled"));
                convert.setLinkUrl(resultMap.get("url"));
                convert.setLinkTitle(resultMap.get("title"));
            }
            validatePageSql(convert);
            vos.add(convert);
        });
        return vos;
    }

    @Override
    public void updateComponent(Long componentId, Long childLayoutId) {
        Component component = new Component();
        component.setId(componentId);
        component.setLink(childLayoutId);
        Boolean result = componentMapper.updateById(component) > 0;
        if (!result) {
            throw new RuntimeException("更新组件失败！");
        }
    }

    @Override
    public void deleteComponents(Long layoutId) {
        componentMapper.deleteComponents(layoutId);
    }

    @Override
    public void deleteComponent(Long componentId) throws Exception {
        //组件删除，需要更新layout.enabled=N，同时删除已经存在的页面
        Layout layout = layoutMapper.selectLayout(componentId);
        if (layout != null) {
            HTMLTemplateUtil.deleteHTMLFile(layout.getId(), layout.getUrl(), layoutMapper);
            layout.setEnabled("N");
            boolean result = layoutMapper.updateById(layout) > 0;
            if (result) {
                result = componentMapper.deleteById(componentId) > 0;
                if (!result) {
                    throw new RuntimeException("删除组件失败！");
                }
            } else {
                throw new RuntimeException("更新布局失败！");
            }
        } else {
            throw new RuntimeException("组件对应的布局数据未找到！");
        }
    }

    @Override
    public Set<String> validatePageSql(Long layoutId) {
        //递归校验页面的SQL是否正确，包含父子页面传参的情况；
        //为了避免父页面传参发生变化后，导致子页面引用了错误的参数。
        Set<String> names = new HashSet<>();
        recursionValidatePageSql(layoutId, names);
        return names;
    }

    private void validatePageSql(ComponentVO vo) {
        //不包含子页面的组件，若能找到父组件，则结合父组件相关信息，进行SQL校验
        String params = "";
        Component parent = componentMapper.selectParentComponent(vo.getLayoutId());
        if (parent != null) {
            params = parent.getParams() != null ? parent.getParams() : "";
        }
        try {
            validateSQL(vo.getQuery(), params, vo.getType());
            vo.setSqlValid(true);
        } catch (JSQLParserException e) {
            vo.setSqlValid(false);
            e.printStackTrace();
        }
    }

    private void recursionValidatePageSql(Long layoutId, Set<String> names) {
        List<ComponentVO> list = this.componentList(layoutId);
        if (list != null && list.size() > 0) {
            list.forEach((c) -> {
                if (c.getLink() != null) {
                    //包含子页面的组件，则进行递归调用，进行SQL校验
                    String params = c.getParams() != null ? c.getParams() : "";
                    Long subLayoutId = c.getLink();
                    Layout subLayout = layoutMapper.selectById(subLayoutId);
                    if (subLayout != null) {
                        List<ComponentVO> subPageComponents = this.componentList(subLayoutId);
                        subPageComponents.forEach((sub) -> {
                            if (sub.getLink() != null) {
                                recursionValidatePageSql(sub.getLink(), names);
                            } else {
                                try {
                                    validateSQL(sub.getQuery(), params, sub.getType());
                                } catch (JSQLParserException e) {
                                    names.add(subLayout.getTitle());
                                    e.printStackTrace();
                                }
                            }
                        });
                    }
                } else {
                    //不包含子页面的组件，若能找到父组件，则结合父组件相关信息，进行SQL校验
                    String params = "";
                    Component parent = componentMapper.selectParentComponent(layoutId);
                    if (parent != null) {
                        params = parent.getParams() != null ? parent.getParams() : "";
                    }
                    Layout layout = layoutMapper.selectById(layoutId);
                    try {
                        validateSQL(c.getQuery(), params, c.getType());
                    } catch (JSQLParserException e) {
                        names.add(layout.getTitle());
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    private void validateSQL(String query, String params, String type) throws JSQLParserException {
        //map类型不参与SQL校验
        if (!"map".equals(type)) {
            CCJSqlParserUtil.parseStatements(SQLParserUtil.parseSqlWithParams(query, params.split(",")));
        }
    }
}
