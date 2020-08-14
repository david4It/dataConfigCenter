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

import com.scsme.dataConfigCenter.davinci.biz.dto.roleDto.RoleBaseInfo;
import com.scsme.dataConfigCenter.davinci.biz.model.Role;
import org.apache.ibatis.annotations.*;

import java.util.List;
@Mapper
public interface RoleMapper {
    int insert(Role record);

    @Delete({
            "delete from `daav_role` where id = #{id,jdbcType=BIGINT}"
    })
    int deleteById(Long id);

    @Select({
            "select * from `daav_role` where id = #{id,jdbcType=BIGINT}"
    })
    Role getById(Long id);


    @Select({
            "SELECT a.* " +
                    "FROM daav_role a " +
                    "LEFT JOIN daav_rel_role_user b ON b.role_id = a.id " +
                    "WHERE a.org_id = #{orgId,jdbcType=BIGINT} AND b.user_id = #{userId,jdbcType=BIGINT} "
    })
    List<Role> getRolesByOrgAndUser(@Param("orgId") Long orgId, @Param("userId") Long userId);

    List<Role> getRolesByIds(List<Long> list);

    @Update({
            "update `daav_role`",
            "set `org_id` = #{orgId,jdbcType=BIGINT},",
            "`name` = #{name,jdbcType=VARCHAR},",
            "`description` = #{description,jdbcType=VARCHAR},",
            "`create_by` = #{createBy,jdbcType=BIGINT},",
            "`create_time` = #{createTime,jdbcType=TIMESTAMP},",
            "`update_by` = #{updateBy,jdbcType=BIGINT},",
            "`update_time` = #{updateTime,jdbcType=TIMESTAMP}",
            "where id = #{id,jdbcType=BIGINT}"
    })
    int update(Role record);


    @Select({
            "select id, `name`, description  from `daav_role` where org_id = #{orgId}"
    })
    List<RoleBaseInfo> getBaseInfoByOrgId(Long orgId);


    List<Role> selectByIdsAndOrgId(@Param("orgId") Long orgId, @Param("roleIds") List<Long> roleIds);


    @Delete({"delete from `daav_role` where org_id = #{orgId}"})
    int deleteByOrg(Long orgId);


    @Select({
            "SELECT DISTINCT r.id FROM daav_role r INNER JOIN daav_rel_role_project rrp on rrp.role_id = r.id",
            "INNER JOIN daav_dashboard_portal p on p.project_id = rrp.project_id",
            "INNER JOIN daav_rel_role_user rru on rru.role_id = r.id",
            "WHERE p.id = #{portalId} and rru.user_id = #{userId}"
    })
    List<Long> getRolesByUserAndPortal(@Param("userId") Long userId, @Param("portalId") Long portalId);


    @Select({
            "SELECT DISTINCT r.id FROM daav_role r INNER JOIN daav_rel_role_project rrp on rrp.role_id = r.id",
            "INNER JOIN daav_display d on d.project_id = rrp.project_id ",
            "INNER JOIN daav_rel_role_user rru on rru.role_id = r.id",
            "WHERE d.id = #{displayId} and rru.user_id = #{userId}"
    })
    List<Long> getRolesByUserAndDisplay(@Param("userId") Long userId, @Param("displayId") Long displayId);

    @Select({
            "SELECT DISTINCT r.id FROM daav_role r",
            "INNER JOIN daav_rel_role_project rrp on rrp.role_id = r.id",
            "INNER JOIN daav_rel_role_user rru on rru.role_id = r.id",
            "WHERE rrp.project_id = #{projectId} and rru.user_id = #{userId}"
    })
    List<Long> getRolesByUserAndProject(@Param("userId") Long userId, @Param("projectId") Long projectId);
}
