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

package com.scsme.dataConfigCenter.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@Controller
public class HomeController {

    @RequestMapping("swagger")
    public String swagger() {
        return "redirect:swagger-ui.html";
    }

    @RequestMapping(value = {"", "/"})
    public String index() {
        return "index";
    }

   /* @RequestMapping("share/")
    public String shareIndex() {
        return "share";
    }
    @RequestMapping("set-basic/")
    public String sbIndex() {
        return "set-basic";
    }
    @RequestMapping("set-upload/")
    public String suIndex() {
        return "set-upload";
    }
    @RequestMapping("set-watermark/")
    public String swIndex() {
        return "set-watermark";
    }
    @RequestMapping("admin-list/")
    public String adlIndex() {
        return "admin-list";
    }
    @RequestMapping("role-list/")
    public String rlIndex() {
        return "role-list";
    }
    @RequestMapping("auth-list/")
    public String alIndex() {
        return "auth-list";
    }
    @RequestMapping("enclosure-list/")
    public String elIndex() {
        return "enclosure-list";
    }
    @RequestMapping("cache-list/")
    public String clIndex() {
        return "cache-list";
    }
    @RequestMapping("article_category-list/")
    public String acIndex() {
        return "article_category-list";
    }
    @RequestMapping("article-list/")
    public String articleIndex() {
        return "article-list";
    }*/

}
