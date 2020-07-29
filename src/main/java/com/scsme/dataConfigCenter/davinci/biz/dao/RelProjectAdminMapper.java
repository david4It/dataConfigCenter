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
import com.scsme.dataConfigCenter.davinci.biz.dto.projectDto.RelProjectAdminDto;
import com.scsme.dataConfigCenter.davinci.biz.model.RelProjectAdmin;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
@Mapper
public interface RelProjectAdminMapper {

    int insert(RelProjectAdmin relProjectAdmin);


    @Select({
            "select * from rel_project_admin where project_id = #{projectId} and user_id = #{userId}"
    })
    RelProjectAdmin getByProjectAndUser(@Param("projectId") Long projectId, @Param("userId") Long userId);

    @Delete({
            "delete from rel_project_admin where id = #{id,jdbcType=BIGINT}"
    })
    int deleteById(Long id);

    @Delete({
            "delete from rel_project_admin where project_id = #{projectId} and user_id = #{userId}"
    })
    int delete(@Param("projectId") Long projectId, @Param("userId") Long userId);

    @Select({
            "select * from rel_project_admin where id = #{id,jdbcType=BIGINT}"
    })
    RelProjectAdmin getById(Long id);

    @Delete({
            "delete from rel_project_admin where project_id = #{projectId}"
    })
    int deleteByProjectId(Long projectId);

    @Select({
            "select r.id,",
            "    u.id                         as 'user.id',",
            "    ifnull(u.`name`, u.username) as 'user.username',",
            "    u.avatar                     as 'user.avatar'",
            "from rel_project_admin r",
            "    left join `user` u on u.id = r.user_id",
            "where r.project_id = #{projectId}"
    })
    List<RelProjectAdminDto> getByProject(Long projectId);


    @Select({
            "select r.user_id",
            "from rel_project_admin r",
            "    left join `user` u on u.id = r.user_id",
            "where r.project_id = #{projectId}"
    })
    List<Long> getAdminIds(Long projectId);

    int insertBatch(List<RelProjectAdmin> list);
}
