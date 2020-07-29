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

package com.scsme.dataConfigCenter.davinci.biz.dto.userDto;

import com.scsme.dataConfigCenter.davinci.core.common.Constants;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Data
@NotNull(message = "user info cannot be null")
public class UserRegist {
    @NotBlank(message = "username cannot be EMPTY")
    private String username;

    @NotBlank(message = "email cannot be EMPTY")
    @Pattern(regexp = Constants.REG_EMAIL_FORMAT, message = "invalid email format")
    private String email;

    @NotBlank(message = "password cannot be EMPTY")
    @Pattern(regexp = Constants.REG_USER_PASSWORD, message = "密码长度为6-20位")
    private String password;

    @Override
    public String toString() {
        return "UserRegist{" +
                "username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
