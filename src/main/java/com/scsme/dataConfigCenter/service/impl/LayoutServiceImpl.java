package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scsme.dataConfigCenter.executor.HTMLCreationExecutor;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import com.scsme.dataConfigCenter.pojo.Layout;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.service.LayoutService;
import com.scsme.dataConfigCenter.util.HTMLTemplateUtil;
import com.scsme.dataConfigCenter.vo.ComponentVO;
import com.scsme.dataConfigCenter.vo.LayoutVO;
import com.scsme.dataConfigCenter.vo.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class LayoutServiceImpl implements LayoutService {
    @Autowired
    LayoutMapper layoutMapper;
    @Autowired
    ComponentMapper componentMapper;
    @Autowired
    ComponentService componentService;

    @Override
    public List<LayoutVO> list(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize) {
        List<LayoutVO> vos = new ArrayList<>();
        Page<Layout> page = new Page<>(pageNo, pageSize);
        IPage<Layout> layoutIPage = layoutMapper.selectPage(page, new QueryWrapper<>());
        result.setTotal(layoutIPage.getTotal());
        List<Layout> records = layoutIPage.getRecords();
        records.forEach((r) -> {
            LayoutVO vo = new LayoutVO().convert(r);
            vos.add(vo);
        });
        return vos;
    }

    @Override
    public List<LayoutVO> treePageList(Result<List<LayoutVO>> result, Integer pageNo, Integer pageSize) {
        List<LayoutVO> vos = new ArrayList<>();
        Page<Layout> page = new Page<>(pageNo, pageSize);
        QueryWrapper<Layout> query = new QueryWrapper<>();
        //获取所有根节点数据，用于树形结构构建
        query.eq("root", "Y");
        query.orderByDesc("create_time");
        IPage<Layout> layoutIPage = layoutMapper.selectPage(page, query);
        result.setTotal(layoutIPage.getTotal());
        List<Layout> records = layoutIPage.getRecords();
        records.forEach((r) -> {
            LayoutVO vo = new LayoutVO().convert(r);
            recursionBuildLayout(r.getId(), vo.getChildren());
            vos.add(vo);
        });
        return vos;
    }

    @Override
    public List<LayoutVO> treeList() {
        List<LayoutVO> vos = new ArrayList<>();
        QueryWrapper<Layout> query = new QueryWrapper<>();
        //获取所有根节点数据，用于树形结构构建
        query.eq("root", "Y");
        query.orderByDesc("create_time");
        List<Layout> records = layoutMapper.selectList(query);
        records.forEach((r) -> {
            LayoutVO vo = new LayoutVO().convert(r);
            recursionBuildLayout(r.getId(), vo.getChildren());
            vos.add(vo);
        });
        return vos;
    }

    @Override
    public List<LayoutVO> enabledLayouts() {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("enabled", "Y");
        List<Layout> layouts = layoutMapper.selectList(queryWrapper);
        List<LayoutVO> results = new ArrayList<>();
        layouts.forEach(layout -> {
            LayoutVO vo = new LayoutVO().convert(layout);
            results.add(vo);
        });
        return results;
    }

    @Override
    public Boolean deleteLayout(Long id) throws Exception {
        //删除布局对应的组件节点，同时删除已经生成的页面
        Layout layout = layoutMapper.selectById(id);
        if (layout != null) {
            HTMLCreationExecutor.deleteHTMLFile(layout.getId(), layout.getUrl(), null);
        }
        boolean result = layoutMapper.deleteById(id) > 0;
        if (result) {
            //更新所有引用了此布局的component组件的link为null
            QueryWrapper<Component> query = new QueryWrapper<>();
            query.eq("link", id);
            List<Component> componentList = componentMapper.selectList(query);
            if (componentList != null && componentList.size() > 0) {
                for (Component c: componentList) {
                    result = componentMapper.updateComponent(c.getId()) > 0;
                    if (!result) {
                        throw new RuntimeException("更新组件的link属性失败！");
                    }
                }
            }
            query = new QueryWrapper<>();
            query.eq("layout_id", id);
            componentList = componentMapper.selectList(query);
            if (componentList != null && componentList.size() > 0) {
                //递归删除所有布局和组件
                for (Component c: componentList) {
                    if (c.getLink() != null) {
                       result = deleteLayout(c.getLink());
                       if (!result) {
                           throw new RuntimeException("递归删除组件失败！");
                       }
                    }
                    componentMapper.deleteById(c.getId());
                }
            }
        }
        return true;
    }

    @Override
    public Boolean saveLayout(LayoutVO layout) {
        layout.setEnabled("N");
        Layout beSave = layout.transLayout();
        beSave.setCreateTime(LocalDateTime.now());
        return layoutMapper.insert(beSave) > 0;
    }

    @Override
    public Long saveSubLayout(LayoutVO layout) {
        if (saveLayout(layout)) {
            QueryWrapper<Layout> query = new QueryWrapper<>();
            query.eq("url", layout.getUrl());
            Layout result = layoutMapper.selectOne(query);
            if (result != null) {
                return result.getId();
            }
        }
        return null;
    }

    @Override
    public void updateLayout(LayoutVO layout) throws Exception {
        //删除旧页面
        Layout old = layoutMapper.selectById(layout.getId());
        if (old != null) {
            HTMLTemplateUtil.deleteHTMLFile(old.getId(), old.getUrl(), null);
        }
        //更新布局会递归的新增或者删除子页面
        recursionLayoutPage(layout.transLayout(), "N");
    }

    @Override
    public void enabled(LayoutVO layout) throws Exception {
        recursionLayoutPage(layout.transLayout(), layout.getEnabled());
    }

    @Override
    public Boolean checkUrl(String url, String id) {
        return getLayout(url, id) == null;
    }

    @Override
    public List<String> thumbnails() throws IOException {
        List<String> result = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("/static/img/center/template/");
        if (resource.exists()) {
            File file = new File(resource.getURI().getPath());
            if (file.list() != null) {
                result.addAll(Arrays.asList(file.list()));
            }
        }
        return result;
    }

    private Layout getLayout(String url, String id) {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("url", url);
        if (id != null) {
            queryWrapper.ne("id", id);
        }
        return layoutMapper.selectOne(queryWrapper);
    }

    private void recursionBuildLayout(Long layoutId, List<LayoutVO> children) {
        Set<Long> layoutIdSet = new HashSet<>();
        QueryWrapper<Component> query = new QueryWrapper<>();
        query.eq("layout_id", layoutId);
        List<Component> components = componentMapper.selectList(query);
        components.forEach(c -> {
            Long id = c.getLink();
            if (id != null && !layoutIdSet.contains(id)) {
                layoutIdSet.add(id);
                Layout layout = layoutMapper.selectById(id);
                if (layout != null) {
                    LayoutVO vo = new LayoutVO().convert(layout);
                    if (c.getParams() != null) {
                        vo.getSqlParams().addAll(Arrays.asList(c.getParams().split(",")));
                    }
                    children.add(vo);
                    recursionBuildLayout(layout.getId(), vo.getChildren());
                }
            }
        });
    }

    private void recursionLayoutPage(Layout layout, String enabled) throws Exception {
        boolean result;
        layout.setEnabled(enabled);
        layout.setLastUpdateTime(LocalDateTime.now());
        result = layoutMapper.updateById(layout) > 0;
        if (!result) {
            throw new RuntimeException("更新布局失败！");
        }
        LayoutVO vo = new LayoutVO().convert(layout);
        List<ComponentVO> componentVOS = componentService.componentList(layout.getId());
        if ("N".equals(enabled)) {
            HTMLCreationExecutor.deleteHTMLFile(layout.getId(), layout.getUrl(), layoutMapper);
        } else {
            vo.setComponents(componentVOS);
            HTMLCreationExecutor.generatedHTMLFile(vo, layoutMapper);
        }
        for (ComponentVO c : componentVOS) {
            Long id = c.getLink();
            if (id != null) {
                Layout subLayout = layoutMapper.selectById(id);
                if (subLayout != null) {
                    recursionLayoutPage(subLayout, enabled);
                }
            }
        }
    }
}
