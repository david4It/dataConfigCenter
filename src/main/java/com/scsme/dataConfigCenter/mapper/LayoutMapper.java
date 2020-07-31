package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Layout;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LayoutMapper extends BaseMapper<Layout> {
    @Select("SELECT url FROM Layout WHERE id = #{id}")
    String getLayoutUrl(Long id);
}
