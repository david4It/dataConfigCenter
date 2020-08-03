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
import com.scsme.dataConfigCenter.davinci.biz.dto.organizationDto.OrganizationInfo;
import com.scsme.dataConfigCenter.davinci.biz.dto.projectDto.ProjectDetail;
import com.scsme.dataConfigCenter.davinci.biz.dto.projectDto.ProjectWithCreateBy;
import com.scsme.dataConfigCenter.davinci.biz.model.Dashboard;
import com.scsme.dataConfigCenter.davinci.biz.model.DaavProject;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Mapper
public interface ProjectMapper extends BaseMapper<DaavProject> {


    List<ProjectWithCreateBy> getProejctsByUser(@Param("userId") Long userId);

    List<ProjectWithCreateBy> getFavoriteProjects(@Param("userId") Long userId);

    List<ProjectWithCreateBy> getProjectsByOrgWithUser(@Param("orgId") Long orgId, @Param("userId") Long userId, @Param("keyword") String keyword);

    List<ProjectWithCreateBy> getProjectsByKewordsWithUser(@Param("keywords") String keywords, @Param("userId") Long userId, @Param("orgList") List<OrganizationInfo> list);

    @Select({"select id from daav_project where org_id = #{orgId} and `name` = #{name}"})
    Long getByNameWithOrgId(@Param("name") String name, @Param("orgId") Long orgId);

    int insert(DaavProject project);

    @Select({"select * from daav_project where id = #{id}"})
    DaavProject getById(@Param("id") Long id);

    ProjectDetail getProjectDetail(@Param("id") Long id);

    ProjectDetail getProjectDetailByDashboardId(@Param("dashboardId") Long dashboardId);

    @Select({"select * from daav_project where id = #{id} and user_id = #{userId}"})
    DaavProject getByProject(DaavProject project);

    @Update({"update daav_project set `name` = #{name}, description = #{description}, visibility = #{visibility}, config = #{config, typeHandler=com.scsme.dataConfigCenter.davinci.core.handler.JsonTypeHandler}, update_time = #{updateTime}, update_by = #{updateBy}  where id = #{id}"})
    int updateBaseInfo(DaavProject project);

    @Update({"update daav_project set `org_id` = #{orgId} where id = #{id}"})
    int changeOrganization(DaavProject project);

    @Update({"update daav_project set `is_transfer` = #{isTransfer, jdbcType=TINYINT} where id = #{id}"})
    int changeTransferStatus(@Param("isTransfer") Boolean isTransfer, @Param("id") Long id);

    @Delete({"delete from daav_project where id = #{id}"})
    int deleteById(@Param("id") Long id);

    @Select({"select * from daav_project where org_id = #{orgId}"})
    List<DaavProject> getByOrgId(@Param("orgId") Long orgId);

    @Update({"update daav_project set star_num = star_num + 1 where id = #{id}"})
    int starNumAdd(@Param("id") Long id);

    @Update({"update daav_project set star_num = IF(star_num > 0,star_num - 1, 0) where id = #{id}"})
    int starNumReduce(@Param("id") Long id);

    Set<Long> getProjectIdsByAdmin(@Param("userId") Long userId);

    int deleteBeforOrgRole(@Param("projectId") Long projectId, @Param("orgId") Long orgId);
}
