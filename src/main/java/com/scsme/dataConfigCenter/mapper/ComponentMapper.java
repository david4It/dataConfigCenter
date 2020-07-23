package com.scsme.dataConfigCenter.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.pojo.Component;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ComponentMapper extends BaseMapper<Component> {
    @Insert("<script> insert into component (layout_id,type,title,query,link,params,location_index,x,y,width,height,create_time,last_update_time) values  " +
            "  <foreach collection='components' item='item' separator=',' > " +
            "  (#{item.layoutId},#{item.type},#{item.title},#{item.query},#{item.link},#{item.params},#{item.locationIndex}," +
            "#{item.x},#{item.y},#{item.width},#{item.height},#{item.createTime},#{item.lastUpdateTime})\n" +
            "  </foreach> </script>")
    Boolean batchInsert(@Param(value = "components") List<Component> components);
}
