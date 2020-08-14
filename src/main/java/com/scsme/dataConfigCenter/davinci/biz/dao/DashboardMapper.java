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


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scsme.dataConfigCenter.davinci.biz.dto.dashboardDto.DashboardWithPortal;
import com.scsme.dataConfigCenter.davinci.biz.model.Dashboard;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Set;

@Mapper
public interface DashboardMapper  extends BaseMapper<Dashboard> {

    int insert(Dashboard dashboard);

    @Delete({"delete from daav_dashboard where id = #{id}"})
    int deleteById(@Param("id") Long id);

    @Delete({"delete from daav_dashboard where find_in_set(#{parentId}, full_parent_id)"})
    int deleteByParentId(@Param("parentId") Long parentId);

    @Delete({"delete from daav_dashboard where dashboard_portal_id = #{portalId}"})
    int deleteByPortalId(@Param("portalId") Long portalId);


    @Select({"select * from daav_dashboard where id = #{id}"})
    Dashboard getById(@Param("id") Long id);


    @Select({"select id from daav_dashboard where dashboard_portal_id = #{portalId} and `name` = #{name}"})
    Long getByNameWithPortalId(@Param("name") String name, @Param("portalId") Long portalId);


    @Update({
            "update daav_dashboard",
            "set `name` = #{name,jdbcType=VARCHAR},",
            "dashboard_portal_id = #{dashboardPortalId,jdbcType=BIGINT},",
            "`type` = #{type,jdbcType=SMALLINT},",
            "`index` = #{index,jdbcType=INTEGER},",
            "parent_id = #{parentId,jdbcType=BIGINT},",
            "`config` = #{config,jdbcType=LONGVARCHAR},",
            "update_by = #{updateBy,jdbcType=BIGINT},",
            "update_time = #{updateTime,jdbcType=TIMESTAMP}",
            "where id = #{id,jdbcType=BIGINT}"
    })
    int update(Dashboard record);


    int updateBatch(List<Dashboard> list);


    @Select({
            "select * from daav_dashboard where dashboard_portal_id = #{portalId} order by `index`"
    })
    List<Dashboard> getByPortalId(@Param("portalId") Long portalId);

    @Select({
            "SELECT * FROM daav_dashboard WHERE parent_id = #{parentId} OR id = #{parentId} "
    })
    List<Dashboard> getByParentId(@Param("parentId") Long parentId);

    @Select({
            "SELECT ",
            "	d.*,",
            "	dp.id 'portal.id',",
            "	dp.`name` 'portal.name',",
            "	dp.description 'portal.description',",
            "	dp.project_id 'portal.projectId',",
            "	dp.avatar 'portal.avatar',",
            "	dp.publish 'portal.publish',",
            "	p.id 'project.id',",
            "	p.`name` 'project.name',",
            "	p.description 'project.description',",
            "	p.pic 'project.pic',",
            "	p.org_id 'project.orgId',",
            "	p.user_id 'project.userId',",
            "	p.visibility 'p.visibility'",
            "from daav_dashboard d ",
            "LEFT JOIN daav_dashboard_portal dp on dp.id = d.dashboard_portal_id",
            "LEFT JOIN daav_project p on p.id = dp.project_id",
            "WHERE d.id = #{dashboardId}"
    })
    DashboardWithPortal getDashboardWithPortalAndProject(@Param("dashboardId") Long dashboardId);

    @Delete({"delete from daav_dashboard WHERE dashboard_portal_id in (SELECT id FROM daav_dashboard_portal WHERE project_id = #{projectId})"})
    int deleteByProject(@Param("projectId") Long projectId);

    @Select({"select full_parent_id from daav_dashboard where id = #{id}"})
    String getFullParentId(Long id);

    List<Dashboard> queryByParentIds(@Param("parentIds") Set<Long> parentIds);

    Set<Long> getIdSetByIds(@Param("set") Set<Long> dashboardIds);


    @Select({
            "select * from dashboard where type = 1 and FIND_IN_SET(#{id},full_parent_Id)"
    })
    List<Dashboard> getSubDashboardById(@Param("id") Long id);

    Set<Dashboard> queryDashboardsByIds(@Param("set") Set<Long> dashboardIds);

    Set<Dashboard> queryByPortals(@Param("set") Set<Long> portalIds);
}