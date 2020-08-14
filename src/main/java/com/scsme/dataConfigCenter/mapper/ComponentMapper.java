package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ComponentMapper extends BaseMapper<Component> {
    @Delete("DELETE FROM component WHERE layout_id = #{layoutId}")
    void deleteComponents(Long layoutId);

    @Update("UPDATE component SET link = NULL AND params = NULL WHERE id = #{id}")
    int updateComponent(Long id);
}
