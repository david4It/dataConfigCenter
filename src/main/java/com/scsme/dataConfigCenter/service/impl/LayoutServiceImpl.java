package com.scsme.dataConfigCenter.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scsme.dataConfigCenter.mapper.ComponentMapper;
import com.scsme.dataConfigCenter.mapper.LayoutMapper;
import com.scsme.dataConfigCenter.pojo.Layout;
import com.scsme.dataConfigCenter.service.ComponentService;
import com.scsme.dataConfigCenter.service.LayoutService;
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
import java.util.List;

@Service
@Transactional
public class LayoutServiceImpl implements LayoutService {
    @Autowired
    LayoutMapper layoutMapper;
    @Autowired
    ComponentMapper componentMapper;

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
    public Boolean deleteLayout(Long id) {
        //删除布局对应的组件节点
        return (layoutMapper.deleteById(id) > 0) && (componentMapper.deletComponenets(id) > 0);
    }

    @Override
    public Boolean saveLayout(LayoutVO layout) {
        Layout beSave = layout.transLayout();
        beSave.setCreateTime(LocalDateTime.now());
        int insert = layoutMapper.insert(beSave);
        return insert > 0;
    }

    @Override
    public Boolean updateLayout(LayoutVO layout) {
        Layout beSave = layout.transLayout();
        beSave.setLastUpdateTime(LocalDateTime.now());
        return layoutMapper.updateById(beSave) > 0;
    }

    @Override
    public Boolean checkUrl(String url) {
        return getLayout(url) != null;
    }

    @Override
    public List<String> thumbnails() throws IOException {
        List<String> result = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("/static/img/center/template/");
        File file = new File(resource.getURI().getPath());
        if (file.list() != null) {
            result.addAll(Arrays.asList(file.list()));
        }
        return result;
    }

    private Layout getLayout(String url) {
        QueryWrapper<Layout> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("url", url);
        return layoutMapper.selectOne(queryWrapper);
    }
}
