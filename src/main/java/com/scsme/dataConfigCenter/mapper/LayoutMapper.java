package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Layout;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.Map;

@Mapper
public interface LayoutMapper extends BaseMapper<Layout> {
    @Select("SELECT url, enabled FROM Layout WHERE id = #{id}")
    Map<String, String> getLayoutUrl(Long id);
}
