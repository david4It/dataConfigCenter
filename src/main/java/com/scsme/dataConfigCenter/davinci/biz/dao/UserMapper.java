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

import com.scsme.dataConfigCenter.davinci.biz.dto.userDto.UserBaseInfo;
import com.scsme.dataConfigCenter.davinci.biz.model.User;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
public interface UserMapper {

    int insert(User user);

    @Select({"select * from `daav_user` where id = #{id}"})
    User getById(@Param("id") Long id);

    @Select({"select * from `daav_user` where `username` = #{username} or `email` = #{username} or `name` = #{username}"})
    User selectByUsername(@Param("username") String username);

    @Select({"select * from `daav_user` where `email` = #{email}"})
    User selectByEmail(@Param("email") String email);

    List<UserBaseInfo> getUsersByKeyword(@Param("keyword") String keyword, @Param("orgId") Long orgId);

    @Update({"update `daav_user` set `name` = #{name}, description = #{description}, department = #{department}, update_time = #{updateTime}",
            "where id = #{id}"})
    int updateBaseInfo(User user);

    @Update({"update user set `avatar` = #{avatar}, update_time = #{updateTime}  where id = #{id}"})
    int updateAvatar(User user);

    @Select({"select id from daav_user where (LOWER(`username`) = LOWER(#{name}) or LOWER(`email`) = LOWER(#{name}) or LOWER(`name`) = LOWER(#{name}))"})
    Long getIdByName(@Param("name") String name);

    @Update({"update `daav_user` set `active` = #{active}, `update_time` = #{updateTime}  where id = #{id}"})
    int activeUser(User user);

    @Update({"update `daav_user` set `password` = #{password}, `update_time` = #{updateTime}  where id = #{id}"})
    int changePassword(User user);

    List<User> getByIds(@Param("userIds") List<Long> userIds);

    @Select({"select count(id) from `daav_user` where `email` = #{email}"})
    boolean existEmail(@Param("email") String email);

    @Select({"select count(id) from `daav_user` where `username` = #{username}"})
    boolean existUsername(@Param("username") String username);

    /**
     * only for test
     * @param id
     * @return
     */
    @Delete({"delete from `daav_user` where id = #{id}"})
    int deleteById(@Param("id") Long id);
}