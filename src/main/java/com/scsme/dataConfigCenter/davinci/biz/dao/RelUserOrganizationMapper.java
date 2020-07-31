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

import com.scsme.dataConfigCenter.davinci.biz.dto.organizationDto.OrganizationMember;
import com.scsme.dataConfigCenter.davinci.biz.model.RelUserOrganization;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Mapper
public interface RelUserOrganizationMapper {

    int insert(RelUserOrganization relUserOrganization);

    @Select({"select * from daav_rel_user_tenant where user_id = #{userId} and org_id = #{orgId}"})
    RelUserOrganization getRel(@Param("userId") Long userId, @Param("orgId") Long orgId);

    @Delete("delete from daav_rel_user_tenant where org_id = #{orgId}")
    int deleteByOrgId(@Param("orgId") Long orgId);


    @Select({
            "SELECT ruo.id, u.id AS 'user.id', ",
            "    IF(u.`name` is NULL,u.username,u.`name`) AS 'user.username', ",
            "    u.email, u.avatar AS 'user.avatar', ruo.role AS 'user.role'",
            "FROM `daav_user` u",
            "LEFT JOIN daav_rel_user_tenant ruo on ruo.user_id = u.id",
            "LEFT JOIN daav_tenant o on o.id = ruo.org_id",
            "WHERE ruo.org_id = #{orgId}"
    })
    List<OrganizationMember> getOrgMembers(@Param("orgId") Long orgId);

    @Select({"select * from daav_rel_user_tenant where id = #{id}"})
    RelUserOrganization getById(@Param("id") Long id);

    @Delete({"delete from daav_rel_user_tenant where id = #{id}"})
    int deleteById(@Param("id") Long id);

    @Update({
            "update daav_rel_user_tenant set role = #{role},",
            "update_by = #{updateBy,jdbcType=BIGINT},",
            "update_time = #{updateTime,jdbcType=TIMESTAMP}",
            "where id= #{id}"
    })
    int updateMemberRole(RelUserOrganization relUserOrganization);

    int insertBatch(@Param("set") Set<RelUserOrganization> set);

    int deleteBatch(@Param("set") Set<Long> set);
}
