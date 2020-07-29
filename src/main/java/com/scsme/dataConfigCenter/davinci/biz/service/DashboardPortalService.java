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

package com.scsme.dataConfigCenter.davinci.biz.service;



import com.scsme.dataConfigCenter.davinci.core.exception.NotFoundException;


import com.scsme.dataConfigCenter.davinci.core.exception.ServerException;
import com.scsme.dataConfigCenter.davinci.core.exception.UnAuthorizedExecption;
import com.scsme.dataConfigCenter.davinci.core.service.CheckEntityService;
import com.scsme.dataConfigCenter.davinci.biz.dto.dashboardDto.DashboardPortalCreate;
import com.scsme.dataConfigCenter.davinci.biz.dto.dashboardDto.DashboardPortalUpdate;
import com.scsme.dataConfigCenter.davinci.biz.dto.roleDto.VizVisibility;
import com.scsme.dataConfigCenter.davinci.biz.model.DashboardPortal;
import com.scsme.dataConfigCenter.davinci.biz.model.Role;
import com.scsme.dataConfigCenter.davinci.biz.model.User;

import java.util.List;

public interface DashboardPortalService extends CheckEntityService {
    List<DashboardPortal> getDashboardPortals(Long projectId, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    DashboardPortal createDashboardPortal(DashboardPortalCreate dashboardPortalCreate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    DashboardPortal updateDashboardPortal(DashboardPortalUpdate dashboardPortalUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean deleteDashboardPortal(Long id, User user) throws NotFoundException, UnAuthorizedExecption;

    List<Long> getExcludeRoles(Long id);

    boolean postPortalVisibility(Role role, VizVisibility vizVisibility, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;
}
