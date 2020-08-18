/*
 * <<
 *  Davinci
 *  ==
 *  Copyright (C) 2016 - 2019 EDP
 *  ==
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *  >>
 *
 */

package com.scsme.dataConfigCenter.davinci.biz.dao;

import com.scsme.dataConfigCenter.davinci.biz.dto.displayDto.MemDisplaySlideWidgetWithSlide;
import com.scsme.dataConfigCenter.davinci.biz.model.MemDisplaySlideWidget;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
public interface MemDisplaySlideWidgetMapper {

    int insert(MemDisplaySlideWidget memDisplaySlideWidget);

    @Delete({"delete from daav_mem_display_slide_widget where id = #{id}"})
    int deleteById(@Param("id") Long id);

    int deleteBatchById(@Param("list") List<Long> list);

    @Delete({
            "delete from daav_mem_display_slide_widget where display_slide_id in ",
            "(SELECT s.id FROM daav_display_slide s LEFT JOIN daav_display d on s.display_id = d.id where d.project_id = #{projectId})"
    })
    int deleteByProject(@Param("projectId") Long projectId);

    @Select({"select * from daav_mem_display_slide_widget where id = #{id}"})
    MemDisplaySlideWidget getById(@Param("id") Long id);

    @Update({
            "update daav_mem_display_slide_widget",
            "set `display_slide_id` = #{displaySlideId,jdbcType=BIGINT},",
            "widget_id = #{widgetId,jdbcType=BIGINT},",
            "`name` = #{name,jdbcType=VARCHAR},",
            "`type` = #{type,jdbcType=SMALLINT},",
            "sub_type = #{subType,jdbcType=SMALLINT},",
            "`index` = #{index,jdbcType=INTEGER},",
            "`params` = #{params,jdbcType=LONGVARCHAR},",
            "update_by = #{updateBy,jdbcType=BIGINT},",
            "update_time = #{updateTime,jdbcType=TIMESTAMP}",
            "where id = #{id,jdbcType=BIGINT}"
    })
    int update(MemDisplaySlideWidget memDisplaySlideWidget);


    @Select({"SELECT m.* FROM daav_mem_display_slide_widget m WHERE m.display_slide_id = #{slideId}"})
    List<MemDisplaySlideWidget> getMemDisplaySlideWidgetListBySlideId(@Param("slideId") Long slideId);

    @Delete({"delete from daav_mem_display_slide_widget where display_slide_id in (select id from daav_display_slide where display_id = #{displayId})"})
    int deleteByDisplayId(@Param("displayId") Long displayId);


    @Delete({"delete from daav_mem_display_slide_widget where display_slide_id = #{slideId}"})
    int deleteBySlideId(@Param("slideId") Long slideId);

    int insertBatch(@Param("list") List<MemDisplaySlideWidget> list);

    int updateBatch(@Param("list") List<MemDisplaySlideWidget> list);

    @Select({
            "SELECT m.*,",
            "	s.id 'displaySlide.id',",
            "	s.display_id 'displaySlide.displayId',",
            "	s.`index` 'displaySlide.index',",
            "	s.`config` 'displaySlide.config'",
            "FROM daav_mem_display_slide_widget m LEFT JOIN daav_display_slide s on m.display_slide_id = s.id",
            "WHERE s.display_id = #{displayId}",
    })
    List<MemDisplaySlideWidgetWithSlide> getMemWithSlideByDisplayId(@Param("displayId") Long displayId);

    @Delete({"delete from daav_mem_display_slide_widget where widget_id = #{widgetId}"})
    int deleteByWidget(@Param("widgetId") Long widgetId);
}