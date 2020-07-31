package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ComponentMapper extends BaseMapper<Component> {
    @Delete("DELETE FROM Component WHERE layout_id = #{layoutId}")
    int deletComponenets(Long layoutId);
}
