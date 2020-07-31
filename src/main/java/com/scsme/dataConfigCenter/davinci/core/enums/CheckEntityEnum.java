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

package com.scsme.dataConfigCenter.davinci.core.enums;

public enum CheckEntityEnum {
    USER("user", "userService", "com.scsme.dataConfigCenter.davinci.biz.model.User"),
    PROJECT("project", "projectService", "com.scsme.dataConfigCenter.davinci.biz.model.DaavProject"),
    ORGANIZATION("organization", "organizationService", "com.scsme.dataConfigCenter.davinci.biz.model.Organization"),
    SOURCE("source", "sourceService", "com.scsme.dataConfigCenter.davinci.biz.model.Source"),
    VIEW("view", "viewService", "com.scsme.dataConfigCenter.davinci.biz.model.View"),
    WIDGET("widget", "widgetService", "com.scsme.dataConfigCenter.davinci.biz.model.Widget"),
    DISPLAY("display", "displayService", "com.scsme.dataConfigCenter.davinci.biz.model.Display"),
    DISPLAYSLIDE("displaySlide", "displaySlideService", "com.scsme.dataConfigCenter.davinci.biz.model.DisplaySlide"),
    DASHBOARD("dashboard", "dashboardService", "com.scsme.dataConfigCenter.davinci.biz.model.Dashboard"),
    DASHBOARDPORTAL("dashboardPortal", "dashboardPortalService", "com.scsme.dataConfigCenter.davinci.biz.model.DashboardPortal"),
    CRONJOB("cronJob", "cronJobService", "com.scsme.dataConfigCenter.davinci.biz.model.CronJob");

    private String source;
    private String service;
    private String clazz;


    CheckEntityEnum(String source, String service, String clazz) {
        this.source = source;
        this.service = service;
        this.clazz = clazz;
    }

    public static CheckEntityEnum sourceOf(String source) {
        for (CheckEntityEnum sourceEnum : values()) {
            if (sourceEnum.source.equals(source)) {
                return sourceEnum;
            }
        }
        return null;
    }

    public String getService() {
        return service;
    }

    public String getClazz() {
        return clazz;
    }

    public String getSource() {
        return source;
    }
}
