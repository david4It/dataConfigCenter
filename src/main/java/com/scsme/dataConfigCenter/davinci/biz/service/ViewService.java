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
import com.scsme.dataConfigCenter.davinci.core.model.core.Paginate;

import com.scsme.dataConfigCenter.davinci.core.model.core.PaginateWithQueryColumns;
import com.scsme.dataConfigCenter.davinci.core.service.CheckEntityService;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.*;
import com.scsme.dataConfigCenter.davinci.biz.model.User;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.SQLContext;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public interface ViewService extends CheckEntityService {

    List<ViewBaseInfo> getViews(Long projectId, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    ViewWithSourceBaseInfo createView(ViewCreate viewCreate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean updateView(ViewUpdate viewUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean deleteView(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    PaginateWithQueryColumns executeSql(ViewExecuteSql executeSql, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    Paginate<Map<String, Object>> getData(Long id, ViewExecuteParam executeParam, User user) throws NotFoundException, UnAuthorizedExecption, ServerException, SQLException;

    PaginateWithQueryColumns getResultDataList(boolean isMaintainer, ViewWithSource viewWithSource, ViewExecuteParam executeParam, User user) throws ServerException, SQLException;

    List<Map<String, Object>> getDistinctValue(Long id, DistinctParam param, User user) throws NotFoundException, ServerException, UnAuthorizedExecption;

    List getDistinctValueData(boolean isMaintainer, ViewWithSource viewWithSource, DistinctParam param, User user) throws ServerException;

    ViewWithSourceBaseInfo getView(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    SQLContext getSQLContext(boolean isMaintainer, ViewWithSource viewWithSource, ViewExecuteParam executeParam, User user);
}
