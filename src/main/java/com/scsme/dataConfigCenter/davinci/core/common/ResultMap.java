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

package com.scsme.dataConfigCenter.davinci.core.common;

import com.scsme.dataConfigCenter.davinci.core.enums.HttpCodeEnum;
import com.scsme.dataConfigCenter.davinci.core.utils.TokenUtils;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import static com.scsme.dataConfigCenter.davinci.core.consts.Consts.EMPTY;


public class ResultMap extends HashMap<String, Object> {

    private HashMap<String, Object> header;

    private int code = HttpCodeEnum.OK.getCode();

    private TokenUtils tokenUtils;

    public ResultMap(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    public ResultMap() {
    }

    public ResultMap success() {
        this.code = HttpCodeEnum.OK.getCode();
        this.header = new HashMap<>();
        this.header.put("code", this.code);
        this.header.put("msg", "Success");
        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }

    public ResultMap success(String token) {
        this.code = HttpCodeEnum.OK.getCode();
        this.header = new HashMap<>();
        this.put("code", this.code);
        this.put("msg", "Success");
        this.put("token", token);
        //this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }

    public ResultMap successAndRefreshToken(HttpServletRequest request) {
        String token = request.getHeader(Constants.TOKEN_HEADER_STRING);
        this.code = HttpCodeEnum.OK.getCode();
        //this.header = new HashMap<>();
        this.put("code", this.code);
        this.put("msg", "Success");
        this.put("token", this.tokenUtils.refreshToken(token));
        //this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }


    public ResultMap fail() {
        this.code = HttpCodeEnum.FAIL.getCode();
        this.header = new HashMap<>();
        this.header.put("code", code);
        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }

    public ResultMap fail(int code) {
        this.code = code;
        this.header = new HashMap<>();
        this.header.put("code", code);
        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }


    public ResultMap failWithToken(String token) {
        this.code = HttpCodeEnum.FAIL.getCode();
        this.header = new HashMap<>();
        this.header.put("code", code);
        this.header.put("msg", HttpCodeEnum.FAIL.getMessage());
        this.header.put("token", tokenUtils.refreshToken(token));
        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }


    public ResultMap failAndRefreshToken(HttpServletRequest request) {
        this.code = HttpCodeEnum.FAIL.getCode();
        this.header = new HashMap<>();
        this.header.put("code", code);
        this.header.put("msg", HttpCodeEnum.FAIL.getMessage());

        String token = request.getHeader(Constants.TOKEN_HEADER_STRING);

        if (!StringUtils.isEmpty(token)) {
            this.header.put("token", this.tokenUtils.refreshToken(token));
        }
        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }

    public ResultMap failAndRefreshToken(HttpServletRequest request, HttpCodeEnum httpCodeEnum) {
        this.code = httpCodeEnum.getCode();
        this.header = new HashMap<>();
        this.header.put("code", code);
        this.header.put("msg", httpCodeEnum.getMessage());

        String token = request.getHeader(Constants.TOKEN_HEADER_STRING);
        if (!StringUtils.isEmpty(token)) {
            this.header.put("token", this.tokenUtils.refreshToken(token));
        }

        this.put("header", header);
        this.put("data", EMPTY);
        return this;
    }

    public ResultMap message(String message) {
        this.header.put("msg", message);
        this.put("header", header);
        return this;
    }

    public ResultMap payload(Object object) {
        this.put("data", null == object ? EMPTY : object);
        return this;
    }
    public ResultMap code(HttpCodeEnum httpCodeEnum) {
        this.code = httpCodeEnum.getCode();
        this.put("code", code);
        return this;
    }

    public ResultMap payloads(Collection list) {
        this.put("data", null == list ? new List[0] : list);
        this.put("count", list.size());
        return this;
    }

    public int getCode() {
        return code;
    }
}
