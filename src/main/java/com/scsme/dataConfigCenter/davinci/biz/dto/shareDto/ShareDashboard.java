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

package com.scsme.dataConfigCenter.davinci.biz.dto.shareDto;

import com.scsme.dataConfigCenter.davinci.biz.dto.projectDto.ProjectInfoShare;
import com.scsme.dataConfigCenter.davinci.biz.model.MemDashboardWidget;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class ShareDashboard {
    private Long id;

    private String name;

    private String config;

    private Set<ShareWidget> widgets;

    private List<MemDashboardWidget> relations;

    private ProjectInfoShare project;
}
