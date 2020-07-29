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

package com.scsme.dataConfigCenter.davinci.core.common.quartz;

import com.alibaba.druid.util.StringUtils;

import com.scsme.dataConfigCenter.davinci.core.model.core.ScheduleJob;
import com.scsme.dataConfigCenter.davinci.core.utils.DateUtils;
import com.scsme.dataConfigCenter.davinci.core.utils.QuartzHandler;
import com.scsme.dataConfigCenter.davinci.core.config.SpringContextHolder;
import com.scsme.dataConfigCenter.davinci.core.enums.LogNameEnum;
import com.scsme.dataConfigCenter.davinci.biz.service.excel.ExecutorUtil;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
public class QuartzJobExecutor implements Job {

    private static final Logger scheduleLogger = LoggerFactory.getLogger(LogNameEnum.BUSINESS_SCHEDULE.getName());

    public static final ExecutorService executorService = Executors.newFixedThreadPool(4);

    @Override
    public void execute(JobExecutionContext jobExecutionContext) {
        ExecutorUtil.printThreadPoolStatusLog(executorService, "Cronjob_Executor", scheduleLogger);
        executorService.submit(() -> {
            TriggerKey triggerKey = jobExecutionContext.getTrigger().getKey();
            ScheduleJob scheduleJob = (ScheduleJob) jobExecutionContext.getMergedJobDataMap().get(QuartzHandler.getJobDataKey(triggerKey));
            if (scheduleJob == null) {
            	scheduleLogger.warn("ScheduleJob({}) is not found", triggerKey.getName());
                return;
            }

            if (scheduleJob.getStartDate().getTime() <= System.currentTimeMillis()
                    && scheduleJob.getEndDate().getTime() >= System.currentTimeMillis()) {
                String jobType = scheduleJob.getJobType().trim();

                if (!StringUtils.isEmpty(jobType)) {
                    ScheduleService scheduleService = (ScheduleService) SpringContextHolder.getBean(jobType + "ScheduleService");
                    try {
                        scheduleService.execute(scheduleJob.getId());
                    } catch (Exception e) {
                        scheduleLogger.error("ScheduleJob({}) execute error:{}", scheduleJob.getId(), e.getMessage());
                        scheduleLogger.error(e.getMessage(), e);
                    }
                } else {
                    scheduleLogger.warn("Unknown job type [{}], jobId(:{})", jobType, scheduleJob.getId());
                }
            } else {
                Object[] args = {
                        scheduleJob.getId(),
                        DateUtils.toyyyyMMddHHmmss(System.currentTimeMillis()),
                        DateUtils.toyyyyMMddHHmmss(scheduleJob.getStartDate()),
                        DateUtils.toyyyyMMddHHmmss(scheduleJob.getEndDate()),
                        scheduleJob.getCronExpression()
                };
                scheduleLogger.warn("ScheduleJob (:{}), current time [{}] is not within the planned execution time, StartTime: [{}], EndTime: [{}], Cron Expression: [{}]", args);
            }
        });
    }
}
