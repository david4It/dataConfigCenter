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

import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.ViewBaseInfo;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.ViewWithProjectAndSource;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.ViewWithSource;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.ViewWithSourceBaseInfo;
import com.scsme.dataConfigCenter.davinci.biz.model.View;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Mapper
public interface ViewMapper {

    int insert(View view);

    @Select({"select id from `daav_view` where project_id = #{projectId} and `name` = #{name}"})
    Long getByNameWithProjectId(@Param("name") String name, @Param("projectId") Long projectId);


    ViewWithProjectAndSource getViewWithProjectAndSourceById(@Param("id") Long id);

    ViewWithProjectAndSource getViewWithProjectAndSourceByWidgetId(@Param("widgetId") Long widgetId);



    @Delete({"delete from `daav_view` where id = #{id}"})
    int deleteById(Long id);

    @Select({"select * from `daav_view` where id = #{id}"})
    View getById(Long id);


    @Update({
            "update `daav_view`",
            "set `name` = #{name,jdbcType=VARCHAR},",
            "`description` = #{description,jdbcType=VARCHAR},",
            "`project_id` = #{projectId,jdbcType=BIGINT},",
            "`source_id` = #{sourceId,jdbcType=BIGINT},",
            "`sql` = #{sql,jdbcType=LONGVARCHAR},",
            "`model` = #{model,jdbcType=LONGVARCHAR},",
            "`variable` = #{variable,jdbcType=LONGVARCHAR},",
            "`config` = #{config,jdbcType=LONGVARCHAR},",
            "`update_by` = #{updateBy,jdbcType=BIGINT},",
            "`update_time` = #{updateTime,jdbcType=TIMESTAMP}",
            "where id = #{id,jdbcType=BIGINT}"
    })
    int update(View view);

    @Select({"select * from `daav_view` where source_id = #{sourceId}"})
    List<View> getBySourceId(@Param("sourceId") Long sourceId);

    @Select({
            "select v.*,",
            "s.id as 'source.id', s.`name` as 'source.name' from `daav_view` v ",
            "left join daav_data_source s on s.id = v.source_id ",
            "where v.id = #{id}"
    })
    ViewWithSourceBaseInfo getViewWithSourceBaseInfo(@Param("id") Long id);


    @Select({
            "select v.id, v.`name`, v.`description`, s.name as 'sourceName'",
            "from `daav_view` v ",
            "left join daav_data_source s on s.id = v.source_id ",
            "where v.project_id = #{projectId}"
    })
    List<ViewBaseInfo> getViewBaseInfoByProject(@Param("projectId") Long projectId);


    int insertBatch(@Param("list") List<View> sourceList);

    @Delete({"delete from `daav_view` where project_id = #{projectId}"})
    int deleteByPorject(@Param("projectId") Long projectId);

    @Select({
            "SELECT ",
            "	v.*,",
            "	s.`id` 'source.id',",
            "	s.`name` 'source.name',",
            "	s.`description` 'source.description',",
            "	s.`config` 'source.config',",
            "	s.`project_id` 'source.projectId',",
            "	s.`type` 'source.type'",
            "FROM `daav_view` v",
            "	LEFT JOIN daav_project p on p.id = v.project_id",
            "	LEFT JOIN daav_data_source s on s.id = v.source_id",
            "WHERE v.id = #{id}",
    })
    ViewWithSource getViewWithSource(Long id);

    Set<View> selectByWidgetIds(@Param("widgetIds") Set<Long> widgetIds);

}