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

package com.scsme.dataConfigCenter.davinci.biz.dto.displayDto;

import com.scsme.dataConfigCenter.davinci.biz.model.Display;
import com.scsme.dataConfigCenter.davinci.biz.model.DisplaySlide;

import com.scsme.dataConfigCenter.davinci.biz.model.DaavProject;
import lombok.Data;

@Data
public class SlideWithDisplayAndProject extends DisplaySlide {

    private Display display;

    private DaavProject project;

    @Override
    public String toString() {
        return super.toString();
    }
}
