package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Layout;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.Map;

@Mapper
public interface LayoutMapper extends BaseMapper<Layout> {
    @Select("SELECT url, enabled, title FROM layout WHERE id = #{id}")
    Map<String, String> getLayoutUrl(Long id);
    @Update("UPDATE layout SET file = NULL WHERE id = #{id}")
    int removeLayoutFile(Long id);
    @Select("SELECT l.* FROM layout l LEFT JOIN component c ON l.id = c.layout_id WHERE c.id = #{componentId}")
    Layout selectLayoutId(Long componentId);
}
