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

import com.scsme.dataConfigCenter.davinci.biz.model.RelRoleDashboard;
import com.scsme.dataConfigCenter.davinci.core.model.RoleDisableViz;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Set;
@Mapper
public interface RelRoleDashboardMapper {

    int insert(RelRoleDashboard relRoleDashboard);

    int insertBatch(List<RelRoleDashboard> list);

    @Select({
            "select rru.role_id as roleId, rrd.dashboard_id as vizId",
            "from daav_rel_role_dashboard rrd",
            "   inner join daav_rel_role_user rru on rru.role_id = rrd.role_id",
            "   inner join daav_dashboard d on d.id  = rrd.dashboard_id",
            "where rru.user_id = #{userId} and rrd.visible = 0 and d.dashboard_portal_id = #{portalId}"
    })
    List<RoleDisableViz> getDisableByUser(@Param("userId") Long userId, @Param("portalId") Long portalId);


    @Select("select role_id from daav_rel_role_dashboard where dashboard_id = #{dashboardId} and visible = 0")
    List<Long> getExecludeRoles(@Param("dashboardId") Long dashboardId);

    int deleteByDashboardIds(@Param("dashboardIds") Set<Long> dashboardIds);

    @Delete({
            "delete from daav_rel_role_dashboard where dashboard_id in (select id from daav_dashboard where id = #{id} or find_in_set(#{id}, full_parent_Id) > 0)"
    })
    int deleteByDashboardId(Long id);

    @Select({
            "select rrd.dashboard_id",
            "from daav_rel_role_dashboard rrd",
            "inner join daav_dashboard d on d.id = rrd.dashboard_id",
            "INNER JOIN daav_dashboard_portal p on p.id = d.dashboard_portal_id",
            "where rrd.role_id = #{id} and rrd.visible = 0 and p.project_id = #{projectId}"
    })
    List<Long> getExecludeDashboards(@Param("id") Long id, @Param("projectId") Long projectId);

    @Delete({"delete from daav_rel_role_dashboard where dashboard_id = #{dashboardId} and role_id = #{roleId}"})
    int delete(@Param("dashboardId") Long dashboardId, @Param("roleId") Long roleId);

    @Delete({"delete from daav_rel_role_dashboard where role_id = #{roleId}"})
    int deleteByRoleId(Long roleId);

    @Delete({"DELETE rrd FROM daav_rel_role_dashboard rrd WHERE rrd.dashboard_id IN " +
            "( " +
            "SELECT d.id " +
            "FROM daav_dashboard d " +
            "WHERE d.dashboard_portal_id = #{portalId} " +
            ") "})
    int deleteByPortalId(@Param("portalId") Long portalId);

    @Delete({
            "delete from daav_rel_role_dashboard where dashboard_id in (",
            "select d.id from daav_dashboard d left join daav_dashboard_portal p on p.id = d.dashboard_portal_id ",
            "where p.project_id = #{projectId})"
    })
    int deleteByProject(Long projectId);
}