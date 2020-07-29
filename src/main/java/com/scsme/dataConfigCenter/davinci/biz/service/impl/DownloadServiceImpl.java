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

package com.scsme.dataConfigCenter.davinci.biz.service.impl;

import com.alibaba.druid.util.StringUtils;
import com.scsme.dataConfigCenter.davinci.biz.dao.DownloadRecordMapper;
import com.scsme.dataConfigCenter.davinci.biz.dao.UserMapper;
import com.scsme.dataConfigCenter.davinci.biz.dto.viewDto.DownloadViewExecuteParam;
import com.scsme.dataConfigCenter.davinci.biz.model.DownloadRecord;
import com.scsme.dataConfigCenter.davinci.biz.model.User;
import com.scsme.dataConfigCenter.davinci.biz.service.DownloadService;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.ExecutorUtil;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.MsgWrapper;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.WidgetContext;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.WorkBookContext;
import com.scsme.dataConfigCenter.davinci.core.enums.ActionEnum;
import com.scsme.dataConfigCenter.davinci.core.enums.DownloadTaskStatus;
import com.scsme.dataConfigCenter.davinci.core.enums.DownloadType;
import com.scsme.dataConfigCenter.davinci.core.exception.UnAuthorizedExecption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


/**
 * Created by IntelliJ IDEA.
 *
 * @Author daemon
 * @Date 19/5/28 10:04
 * To change this template use File | Settings | File Templates.
 */
@Service
@Slf4j
public class DownloadServiceImpl extends DownloadCommonService implements DownloadService {

    @Autowired
    private DownloadRecordMapper downloadRecordMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    public List<DownloadRecord> queryDownloadRecordPage(Long userId) {
        return downloadRecordMapper.getDownloadRecordsByUser(userId);
    }

    @Override
    public DownloadRecord downloadById(Long id, String token) throws UnAuthorizedExecption {
        if (StringUtils.isEmpty(token)) {
            throw new UnAuthorizedExecption();
        }

        String username = tokenUtils.getUsername(token);
        if (StringUtils.isEmpty(username)) {
            throw new UnAuthorizedExecption();
        }

        User user = userMapper.selectByUsername(username);
        if (null == user) {
            throw new UnAuthorizedExecption();
        }

        DownloadRecord record = downloadRecordMapper.getById(id);

        if (!record.getUserId().equals(user.getId())) {
            throw new UnAuthorizedExecption();
        }

        record.setLastDownloadTime(new Date());
        record.setStatus(DownloadTaskStatus.DOWNLOADED.getStatus());
        downloadRecordMapper.updateById(record);
        return record;
    }

    @Override
    public Boolean submit(DownloadType type, Long id, User user, List<DownloadViewExecuteParam> params) {
        try {
            List<WidgetContext> widgetList = getWidgetContexts(type, id, user, params);
            DownloadRecord record = new DownloadRecord();
            record.setName(getDownloadFileName(type, id));
            record.setUserId(user.getId());
            record.setCreateTime(new Date());
            record.setStatus(DownloadTaskStatus.PROCESSING.getStatus());
            downloadRecordMapper.insert(record);
            MsgWrapper wrapper = new MsgWrapper(record, ActionEnum.DOWNLOAD, record.getId());

            WorkBookContext workBookContext = WorkBookContext.WorkBookContextBuilder.newBuildder()
                    .withWrapper(wrapper)
                    .withWidgets(widgetList)
                    .withUser(user)
                    .withResultLimit(resultLimit)
                    .withTaskKey("DownloadTask_" + id)
                    .build();

            ExecutorUtil.submitWorkbookTask(workBookContext, null);

            log.info("Download task submit: {}", wrapper);
        } catch (Exception e) {
            log.error("submit download task error,e=", e);
            return false;
        }
        return true;
    }
}
