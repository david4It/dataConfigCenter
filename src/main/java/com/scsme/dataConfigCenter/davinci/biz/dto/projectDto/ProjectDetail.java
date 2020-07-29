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

package com.scsme.dataConfigCenter.davinci.biz.dto.projectDto;

import com.scsme.dataConfigCenter.davinci.biz.dto.userDto.UserBaseInfo;
import com.scsme.dataConfigCenter.davinci.biz.model.Organization;
import com.scsme.dataConfigCenter.davinci.biz.model.Project;
import lombok.Data;

@Data
public class ProjectDetail extends Project {
    private Organization organization;

    private UserBaseInfo createBy;


    @Override
    public String toString() {
        return "Project{" +
                "id=" + getId() +
                ", name='" + getName() + '\'' +
                ", description='" + getDescription() + '\'' +
                ", pic='" + getPic() + '\'' +
                ", orgId=" + getOrgId() +
                ", userId=" + getUserId() +
                ", starNum=" + getStarNum() +
                ", visibility=" + getVisibility() +
                ", isTransfer=" + getIsTransfer() +
                ", initialOrgId=" + getInitialOrgId() +
                '}';
    }
}
