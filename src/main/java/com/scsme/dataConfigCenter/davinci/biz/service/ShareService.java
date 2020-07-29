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


import com.scsme.dataConfigCenter.davinci.core.exception.ForbiddenExecption;
import com.scsme.dataConfigCenter.davinci.core.exception.NotFoundException;
import com.scsme.dataConfigCenter.davinci.core.exception.ServerException;
import com.scsme.dataConfigCenter.davinci.core.exception.UnAuthorizedExecption;

import com.scsme.dataConfigCenter.davinci.core.model.core.Paginate;
import com.scsme.dataConfigCenter.davinci.core.common.ResultMap;
import com.scsme.dataConfigCenter.davinci.biz.dto.shareDto.ShareDashboard;
import com.scsme.dataConfigCenter.davinci.biz.dto.shareDto.ShareDisplay;
import com.scsme.dataConfigCenter.davinci.biz.dto.shareDto.ShareInfo;
import com.scsme.dataConfigCenter.davinci.biz.dto.shareDto.ShareWidget;
import com.scsme.dataConfigCenter.davinci.biz.dto.userDto.UserLogin;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.DistinctParam;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.ViewExecuteParam;
import com.scsme.dataConfigCenter.davinci.biz.model.User;

import javax.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import java.util.Map;

public interface ShareService {
    ShareWidget getShareWidget(String token, User user) throws NotFoundException, ServerException, ForbiddenExecption, UnAuthorizedExecption;

    String generateShareToken(Long shareEntityId, String username, Long userId) throws ServerException;

    User shareLogin(String token, UserLogin userLogin) throws NotFoundException, ServerException, UnAuthorizedExecption;

    ShareDisplay getShareDisplay(String token, User user) throws NotFoundException, ServerException, ForbiddenExecption, UnAuthorizedExecption;

    ShareDashboard getShareDashboard(String token, User user) throws NotFoundException, ServerException, ForbiddenExecption, UnAuthorizedExecption;

    Paginate<Map<String, Object>> getShareData(String token, ViewExecuteParam executeParam, User user) throws NotFoundException, ServerException, ForbiddenExecption, UnAuthorizedExecption, SQLException;

    String generationShareDataCsv(ViewExecuteParam executeParam, User user, String token) throws NotFoundException, ServerException, ForbiddenExecption, UnAuthorizedExecption;

    ResultMap getDistinctValue(String token, Long viewId, DistinctParam param, User user, HttpServletRequest request);

    ShareInfo getShareInfo(String token, User user) throws ServerException, ForbiddenExecption;
}
