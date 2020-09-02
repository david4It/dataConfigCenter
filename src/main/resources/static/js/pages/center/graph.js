Vue.component('graph', {
    template: `<grid-layout
            :layout.sync="components"
            :col-num="100"
            :row-height="50"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10]"
            :use-css-transforms="true"
    ><grid-item :style="'background-color: #778899;' + (!item.sqlValid ? 'border: solid 4px red;' : '')" v-for="item in components"
                   :minW="25"
                   :minH="5"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i">
            <div style="border-bottom: solid 1px #DCDCDC; position: absolute; width: 100%; height: 40px; left: 0; top: 0">
                <div style="padding-top: 6px; text-align: center">
                   <span style="color: white;font-weight: bold;">{{item.title}}</span>
                </div>
            </div>
            <div style="position: absolute; width: 100%; height: calc(100% - 80px); top: 40px; 
                        display: flex; display: -webkit-flex; justify-content: center;align-items:center;">
                <img :src="'/img/center/type/' + item.type + '.png'">
            </div>
            <div style="border-top: solid 1px #DCDCDC; position: absolute; width: 100%; height: 40px; left: 0; bottom: 0">
                <div style="padding-top: 6px; text-align: center">
                   <el-button size="mini" type="primary" icon="el-icon-edit" @click="editComponent(item)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteComponent(item.i)">删除</el-button>
                   <el-button size="mini" type="warning" icon="el-icon-setting" @click="editComponentStyle(item)">样式</el-button>
                   <el-button v-if="item.link" title="子页面" size="mini" type="success" icon="el-icon-link" circle @click="loadSubLayout(item.link)"></el-button>
                </div>
            </div>
        </grid-item>
        <div v-show="layout_id" style="z-index: 1; position:fixed; right: 40px; top: 60%;" title="新增">
           <el-button type="primary" icon="el-icon-plus" circle @click="addComponent"></el-button>
        </div>        
        <div v-show="layout_id && components.length > 0" style="z-index: 1; position:fixed; right: 40px; top: 66%;" title="保存">
           <el-button type="success" icon="el-icon-check" circle @click="checkAndSaveComponents"></el-button>
        </div>
        
        <el-dialog 
            title="新增子页面"
            :visible.sync="subDialogVisible"
            width="30%"
            :show-close="false">
            <el-form ref="subDataForm" :model="subLayout" label-width="140px">
                <el-form-item label="标题" prop="title"
                            :rules="[{required: true, validator: validateTitle, trigger: 'blur'}]">
                    <el-input v-model="subLayout.title"></el-input>
                 </el-form-item>
                <el-form-item label="模板" prop="templateName"
                          :rules="[{required: true, validator: validateCheckbox}]">
                    <div style="overflow: hidden; height: 150px; overflow-y:scroll;">
                        <el-checkbox v-model="thumb.checked" v-for="thumb in thumbnails" :key="thumb.value" @change="checkboxChanged(thumb.value)" bordar>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img style="width: 400px" :src="'/img/center/template/' + thumb.value"/>
                                <img slot="reference" :src="'/img/center/template/' + thumb.value"  style="width: 200px">
                            </el-popover>
                        </el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="URL" prop="url" :rules="[{required: true, validator: validateUrl, trigger: 'blur'}]">
                    <el-input v-model="subLayout.url"  onkeyup="value=value.replace(/[^\\w_]/g,'')"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSubLayout">取 消</el-button>
                <el-button type="primary" @click="createSubLayout">创 建</el-button>
            </span>
        </el-dialog>
        
        <el-dialog
            :title="isUpdate ? '编辑' : '新增'"
            :visible.sync="dialogVisible"
            width="30%"
            :show-close="false">
        <el-form ref="dataForm" :model="component" label-width="140px" :rules="rules">
            <el-form-item label="标题" prop="title">
                <el-input v-model="component.title"></el-input>
            </el-form-item>
            <el-form-item label="图表类型" prop="type">
                <el-select v-model="component.type" placeholder="请选择" @change="typeChanged">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item v-if="component.type === 'map'" label="地区选择" prop="area"
                :rules="[{required: true, validator: validateArea, trigger: 'blur'}]">
                <el-select v-model="component.area" placeholder="请选择">
                    <el-option
                      key="cdArea"
                      label="成都"
                      value="cdArea">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="component.type !== 'map' && sql_params.length > 0" label="页面参数">
                <el-tag v-for="param in sql_params" :key="param">{{param}}</el-tag>
                <el-tooltip class="item" effect="dark" :content="tips" placement="top-start">
                    <i class="el-icon-info" style="font-size: 18px;"></i>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-if="component.type !== 'map'" label="SQL语句" prop="query"
                :rules="[{required: true, validator: validateSql, trigger: 'blur'}]">
                <el-input type="textarea"
                 :autosize="{ minRows: 3, maxRows: 6}"
                 v-model="component.query"></el-input>
            </el-form-item>
            <el-form-item label="页面跳转" prop="redirect">
                <el-select v-model="component.redirect" placeholder="请选择" @change="redirectChanged">
                    <el-option
                      key="N"
                      label="禁用"
                      value="N">
                    </el-option>
                    <el-option
                      key="Y"
                      label="启用"
                      value="Y">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="displayDesField()" label="维度字段" prop="desField"
                :rules="[{required: true, validator: validateDesField, trigger: 'blur'}]">
                <el-select v-model="component.desField" placeholder="请选择">
                    <el-option
                      v-for="item in selections"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item v-if="displaySingleValueField()" label="数值字段" prop="valueField"
                :rules="[{required: true, validator: validateValueField, trigger: 'blur'}]">
                <el-select v-model="component.valueField" placeholder="请选择">
                    <el-option
                      v-for="item in selections"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item v-if="displayLegendField()" label="类别字段" prop="valueField"
                :rules="[{required: true, validator: validateLegendField, trigger: 'blur'}]">
                <el-select v-model="component.legendField" placeholder="请选择">
                    <el-option
                      v-for="item in selections"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>            
            <el-form-item v-if="displayMultiValueField()" label="数值字段" prop="multiValueFields"
                :rules="[{required: true, validator: validateMultiValueField, trigger: 'blur'}]">
                <el-checkbox-group v-model="multiValueFields">
                    <el-checkbox v-for="item in selections" :key="item.value" :label="item.label"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="selections.length > 0 && component.hasSubLayout && component.type !== 'map'" label="页面传参">
                <el-checkbox-group v-model="params">
                    <el-checkbox v-for="item in selections" :key="item.value" :label="item.label"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="component.hasSubLayout && component.type === 'map'" label="页面传参">
                <el-checkbox v-model="component.params" true-label="areaCode" checked disabled>areaCode</el-checkbox>
            </el-form-item>
            <el-form-item v-if="component.hasSubLayout" label="子页面名称">
                <el-input v-model="subLayout.title" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="component.hasSubLayout" label="子页面Url">
                <el-input v-model="subLayout.url" disabled></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmComponent">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    <gauge_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'gauge'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></gauge_style_form>
    <map_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'map'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></map_style_form>      
    <radar_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'radar'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></radar_style_form>    
    <table_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'table'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></table_style_form>
    <line_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'line'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></line_style_form>
    <bar_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'bar'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></bar_style_form>
    <pie_style_form :config="component.configJson" :visible="styleDialogVisible && component.type === 'pie'" 
                        @cancel="cancelStyleEdit" @save_component_style="saveComponentStyle"></pie_style_form>
    </grid-layout>`,
    data: function () {
        return {
            components: [],
            component: {},
            params: [],
            multiValueFields: [],
            subLayout: {},
            thumbnails: [],
            isUpdate: false,
            selections: [],
            currentSql: null,
            options:[
                {label: '折线图', value: 'line'},
                {label: '饼状图', value: 'pie'},
                {label: '柱状图', value: 'bar'},
                {label: '表格图', value: 'table'},
                {label: '雷达图', value: 'radar'},
                {label: '仪表盘', value: 'gauge'},
                {label: '地图', value: 'map'}
            ],
            tips: '页面参数可以直接在SQL中进行使用，使用方式为${}，如${param}',
            styleDialogVisible: false,
            dialogVisible: false,
            subDialogVisible: false,
            rules: {
                title :[{required: true, message: '标题不能为空！', trigger: 'blur'},
                    {max: 255, message: '长度超过255个字符限制！'}],
                type :[{required: true, message: '请选择图表类型！', trigger: 'blur'}],
                redirect :[{required: true, message: '该选项不能为空！', trigger: 'blur'}],
            }
        }
    },
    props: {
        layout_id: {
          type: Number,
          default: null
      },
        sql_params: {
            type: Array,
            default: ()=>[]
        }
    },
    watch: {
        layout_id(val) {
           if (val) {
               this.loadComponents(val);
               this.getThumbnails();
           } else {
               this.components.length = 0;
           }
        },
        subDialogVisible(val) {
            if (!val) {
                //重置选中框以及表单验证
                this.resetCheckbox();
                this.$refs["subDataForm"].clearValidate();
            }
        },
        dialogVisible(val) {
            if (!val) {
                //使用setTimeout避免显示问题
                setTimeout(()=> {
                    //清空对应属性的值，确保渲染的正确性
                    this.currentSql = null;
                    this.component = {};
                    this.params = [];
                    this.multiValueFields = [];
                    this.subLayout = {};
                    this.isUpdate = false;
                    this.$refs["dataForm"].clearValidate();
                    this.selections = [];
                }, 500);
            } else {
                //编辑操作，若sql存在，需要获取到selections相关数据
                if (this.isUpdate && !this.component.sqlValid) {
                    this.$nextTick(() => {
                        this.$refs["dataForm"].validate((valid) => {});
                    });
                    return;
                }
                if (this.component.query) {
                    service.post('/sql/selections', {
                        sql: this.component.query,
                        params: this.sql_params
                    }).then(res => {
                        if (!res.data.success) {
                            this.$message({
                                type: 'danger',
                                message: res.data.message
                            });
                            //将SQL对应的input设置为invalid

                        } else {
                            res.data.result.forEach(f => {
                                this.selections.push({label: f, value: f});
                            })
                        }
                    })
                }
            }
        }
    },
    methods: {
        loadComponents(id) {
            let me = this;
            me.components.length = 0;
            service.get('/component/list', {
                params: {
                    layoutId: id
                }
            }).then(res => {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                res.data.result.forEach(item => {
                    if (item.link) {
                        //展示已配置的子页面信息
                        item.redirect = 'Y';
                        item.hasSubLayout = true;
                    } else {
                        item.redirect = 'N';
                        item.hasSubLayout = false;
                    }
                    item.i = item.locationIndex;
                    item.w = item.width;
                    item.h = item.height;
                    item.configJson = JSON.parse(item.configJson);
                    me.components.push(deepCopy(item));
                });
                me.validatePageSql(id);
            }).catch(err => {
                me.$message.error("获取组件列表数据失败！");
            })
        },
        validatePageSql(id, callback = null) {
            let me = this;
            service.get('/component/validatePageSql', {
                params: {
                    layoutId: id
                }
            }).then(res => {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                if (res.data.result.length > 0) {
                    let msg = "检测到页面SQL存在问题，请进行修正：<br>";
                    res.data.result.forEach((name) => {
                       msg = msg + "<strong><span style='color: red'>" + name + "</span></strong><br>";
                    });
                    me.$notify({
                        dangerouslyUseHTMLString: true,
                        title: '警告',
                        message: msg
                    });
                    return;
                }
                if (callback) callback();
            }).catch(err => {
                me.$message.error("校验页面SQL失败！");
            })
        },
        editComponent(c) {
            let me = this;
            me.isUpdate = true;
            if (c.link) {
                //展示已配置的子页面信息
                me.subLayout.url = c.linkUrl;
                me.subLayout.title = c.linkTitle;
                me.params = c.params ? c.params.split(",") : [];
            }
            //根据不同图表类型，对数据进行预处理
            switch (c.type) {
                case 'bar':
                case 'line':
                    c.desField = c.categoryValuePattern.split(":")[0];
                    c.valueField = c.categoryValuePattern.split(":")[1];
                    c.legendField = c.categoryValuePattern.split(":")[2];
                    me.component = deepCopy(c);
                    break;
                case 'pie':
                case 'gauge':
                    c.desField = c.categoryValuePattern.split(":")[0];
                    c.valueField = c.categoryValuePattern.split(":")[1];
                    me.component = deepCopy(c);
                    break;
                case 'radar':
                    c.desField = c.categoryValuePattern.split(":")[0];
                    me.multiValueFields = c.categoryValuePattern.split(":")[1].split(",");
                    me.component = deepCopy(c);
                    break;
                case 'table':
                    me.multiValueFields = c.categoryValuePattern.split(",");
                    me.component = deepCopy(c);
                    break;
                case 'map':
                    c.area = c.query;
                    me.component = deepCopy(c);
                    me.component.query = null;
                    break;
            }
            me.currentSql = c.query;
            me.dialogVisible = true;
        },
        validateArea(rule, value, callback) {
          let me = this;
            if (!value || value.trim() === '') {
                me.selections = [];
                callback(new Error("请选择地区！"));
            } else {
                callback();
            }
        },
        validateSql(rule, value, callback) {
            let me = this;
            if (!value || value.trim() === '') {
                me.selections = [];
                callback(new Error("SQL不能为空！"));
            } else {
                //sql语句发生变化或者sqlValid为false的时候，才重新获取相关的select字段信息
                if (me.currentSql !== me.component.query || !me.component.sqlValid) {
                    service.post('/sql/selections', {
                        sql: value,
                        params: me.sql_params
                    }).then(res => {
                        if (!res.data.success) {
                            me.component.sqlValid = false;
                            callback(new Error(res.data.message));
                        } else {
                            if (res.data.result.length === 0) {
                                me.component.sqlValid = false;
                                callback(new Error("请明确SQL中查询字段，不要使用SELECT * 语句！"));
                            } else {
                                //SQL变化导致下拉选项发生变化，需清空数据重新选择
                                me.params = [];
                                me.multiValueFields = [];
                                me.selections = [];
                                me.currentSql = value;
                                me.component.sqlValid = true;
                                if (me.component.desField) {
                                    me.component.desField = null;
                                }
                                if (me.component.valueField) {
                                    me.component.valueField = null;
                                }
                                if (me.component.legendField) {
                                    me.component.legendField = null;
                                }
                                res.data.result.forEach(f => {
                                    me.selections.push({label: f, value: f});
                                });
                                callback();
                            }
                        }
                    })
                } else {
                    callback();
                }
            }
        },
        validateMultiValueField(rule, value, callback) {
            let me = this;
            if (me.multiValueFields.length === 0) {
                callback(new Error("数值字段不能为空！"));
            } else {
                callback();
            }
        },
        resetCheckbox() {
            let me = this;
            //重置模板选择项
            me.thumbnails.forEach((item) => {
                item.checked = false;
            });
        },
        validateTitle(rule, value, callback) {
            if (!value || value.trim() === '') {
                callback(new Error("标题不能为空！"));
            } else if (value.length > 255) {
                callback(new Error("长度超过255个字符限制"));
            } else {
                callback();
            }
        },
        validateUrl(rule, value, callback) {
            if (!value || value.trim() === '') {
                callback(new Error("Url不能为空！"));
            } else if (value.length > 255) {
                callback(new Error("长度超过255个字符限制"));
            } else {
                //url的唯一性校验
                service.get('/layout/checkUrl', {
                    params: {
                        url: value,
                        id: this.subLayout.id
                    }
                }).then(res => {
                    if (!res.data.success) {
                        callback(new Error("Url校验失败！"));
                    } else {
                        if (res.data.result) {
                            callback();
                        } else {
                            callback(new Error("Url重复！"));
                        }
                    }
                })
            }
        },
        validateCheckbox(rule, value, callback) {
            if (this.subLayout.templateName || !this.subDialogVisible) {
                callback();
            } else {
                callback(new Error("请选择模板！"))
            }
        },
        validateDesField(rule, value, callback) {
            if (!value) {
                callback(new Error("维度字段不能为空"));
            } else {
                callback();
            }
        },
        validateLegendField(rule, value, callback) {
            if (!value) {
                callback(new Error("类别字段不能为空"));
            } else {
                callback();
            }
        },
        validateValueField(rule, value, callback) {
            if (!value) {
                callback(new Error("数值字段不能为空"));
            } else {
                callback();
            }
        },
        displayDesField() {
            let me = this;
            return me.selections.length > 0 && (me.component.type === 'line'
                || me.component.type === 'bar' || me.component.type === 'pie'
                || me.component.type === 'radar' || me.component.type === 'gauge');
        },
        displaySingleValueField() {
            let me = this;
            return me.selections.length > 0 && (me.component.type === 'line'
                || me.component.type === 'bar' || me.component.type === 'pie'|| me.component.type === 'gauge');
        },
        displayLegendField() {
            let me = this;
            return me.selections.length > 0 && (me.component.type === 'bar' || me.component.type === 'line');
        },
        displayMultiValueField() {
            let me = this;
            return me.selections.length > 0 && (me.component.type === 'table'
                || me.component.type === 'radar');
        },
        getThumbnails() {
            //缩略图获取
            let me = this;
            service.get('/layout/template/thumbnails').then(function (res) {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.thumbnails.length = 0;
                res.data.result.forEach((name) => {
                    me.thumbnails.push({checked: false, value: name})
                });
            }).catch(err => {
                me.$message.error("获取缩略图数据失败！");
            })
        },
        deleteComponent(i) {
            let me = this;
            let index = me.components.findIndex(c => {
                return c.i === i;
            });
            let component = me.components[index];
            let message = component.link !== null ? '此组件包含跳转的子页面，若删除此组件，则子页面也将被删除，是否继续？'
                : '是否删除此组件？';
            me.$confirm(message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.delete('/component/delete', {
                    params: {
                        id: component.id
                    }
                }).then(res => {
                    if (!res.data.success) {
                        me.$message.error(res.data.message);
                        return;
                    }
                    me.components.splice(index, 1);
                    me.saveComponents();
                }).catch(err => {
                    me.$message.error("删除组件失败！");
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        checkAndSaveComponents() {
            let me = this;
            for (let i = 0; i < me.components.length; i++) {
                if (!me.components[i].sqlValid) {
                    me.$message.error("检测到页面SQL存在问题，请修改后再保存！");
                    return;
                }
            }
            me.saveComponents();
        },
        saveComponents() {
            let me = this;
            //组件按x,y排序
            let result = [];
            //使用deepCopy方法深拷贝component对象，避免直接修改component对象造成的显示问题
            me.components.forEach((ele) => {
                result.push(deepCopy(ele));
            });
            result.sort((v1,v2) => {
                return v1.x - v2.x;
            });
            result.sort((v1,v2) => {
                return v1.y - v2.y;
            });
            result.forEach((ele, index) => {
               ele.locationIndex = index;
               ele.layoutId = me.layout_id;
               ele.width = ele.w;
               ele.height = ele.h;
                if (ele.configJson) {
                    ele.configJson = JSON.stringify(ele.configJson);
                }
            });
            service.post('/component/save', result).then(res => {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.successMsg(res.data.message);
                if (me.dialogVisible) {
                    me.dialogVisible = false;
                }
                // me.loadComponents(me.layout_id);
                // me.loadComponents(me.layout_id);
                //因为可能存在新建子页面的情况，故需要刷新layout列表，确保展示的正确性
                me.$emit('refresh_layout_list');
                me.validatePageSql(me.layout_id);
            }).catch(err => {
                console.log(err);
            })
        },
        confirmComponent() {
            let me = this;
            me.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    let result = null;
                    me.component.sqlValid = true;
                    if (me.component.type !== 'map') {
                        //当component.type!='map'并且component.link!=null的情况下，需要手动将params的值封装到component.params中
                        //当component.type='map'并且component.link!=null的情况下，component.params的值已经存在了，无需赋值
                        me.component.params = me.params.length > 0 ? me.params.toString() : null;
                    }
                    switch (me.component.type) {
                        case 'bar':
                        case 'line':
                            me.component.categoryValuePattern = me.component.desField + ":" + me.component.valueField
                                + ":" + me.component.legendField;
                            break;
                        case 'pie':
                        case 'gauge':
                            me.component.categoryValuePattern = me.component.desField + ":" + me.component.valueField;
                            break;
                        case 'radar':
                            me.component.categoryValuePattern = me.component.desField + ":" + me.multiValueFields.toString();
                            break;
                        case 'table':
                            me.component.categoryValuePattern = me.multiValueFields.toString();
                            break;
                        case 'map':
                            me.component.query = me.component.area;
                            me.component.categoryValuePattern = null;
                            break;
                    }
                    if (!me.isUpdate) {
                        //新增组件位置默认在第一个位置
                        let baseInfo = {x: 0, y: 0, w: 25, h: 5, i: me.components.length};
                        let component = mergeRecursive(baseInfo, me.component);
                        me.components.push(component);
                        result = component;
                    } else {
                        //更新操作则直接在components中查找
                        let index = me.components.findIndex(c => {
                            return c.i === me.component.i;
                        });
                        me.components[index] = me.component;
                        result = me.component;
                    }
                    if (JSON.stringify(me.subLayout) !== "{}" && !me.component.link) {
                        //新增子页面
                        service.post("/layout/createSubLayout", me.subLayout).then(res => {
                            if (!res.data.success) {
                                me.$message.error(res.data.message);
                                return;
                            }
                            result.link = res.data.result;
                            me.saveComponents();
                        }).catch(err => {
                            me.$message.error("保存子页面失败！");
                        })
                    } else if (me.component.link && me.component.redirect === 'N') {
                        //删除子页面
                        me.$confirm('此组件包含跳转的子页面，禁用页面跳转会删除子页面以及其对应的组件，是否继续？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            service.delete("/layout/delete", {
                                params: {
                                    id: me.component.link
                                }
                            }).then(res => {
                                if (!res.data.success) {
                                    me.$message.error(res.data.message);
                                    return;
                                }
                                result.link = null;
                                result.params = null;
                                me.saveComponents();
                            }).catch(err => {
                                me.$message.error("删除子页面失败！");
                            })
                        }).catch(() => {
                            result.hasSubLayout = true;
                            result.redirect = 'Y';
                            this.$message({
                                type: 'info',
                                message: '已取消操作'
                            });
                        });
                    } else {
                        me.saveComponents();
                    }
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        cancelSubLayout() {
            let me = this;
            //清除子页面相关信息
            me.subDialogVisible = false;
            me.component.hasSubLayout = false;
            me.component.redirect = 'N';
            me.subLayout = {}
        },
        createSubLayout() {
            let me = this;
            me.$refs["subDataForm"].validate((valid) => {
                if (valid) {
                    //保存在内存中，并不提交到后台
                    me.subDialogVisible = false;
                    me.component.hasSubLayout = true;
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        checkboxChanged(value) {
            //最多只能选择一个
            let me = this;
            me.thumbnails.forEach((item) => {
                item.checked = item.value === value;
            });
            me.subLayout.templateName = value.split(".")[0];
            if (me.$refs["subDataForm"]) {
                me.$refs["subDataForm"].$children[1].clearValidate();
            }
        },
        typeChanged(val) {
            let me = this;
            me.$refs["dataForm"].clearValidate();
        },
        redirectChanged(val) {
            let me = this;
            if (val === 'N') {
                //当component.link为空时，需要清除掉相关的值，让用户重新选择；
                // 反之则保留，以确保来回切换时，已存在数据库中的值能正确显示。
                if (!me.component.link) {
                    me.params = [];
                    me.multiValueFields = [];
                    me.subLayout = {};
                }
                me.component.hasSubLayout = false;
            } else {
                //若link无值的情况下，需要弹出子页面添加窗口，以便用户添加子页面
                if (!me.component.link) {
                    me.subDialogVisible = true;
                }
                //更新操作且link有值的情况下，则直接将原始的值显示出来即可
                if (me.isUpdate && me.component.link) {
                    me.component.hasSubLayout = true;
                }
            }
        },
        loadSubLayout(layoutId) {
            let me = this;
            me.$emit('load_sub_layout', layoutId);
        },
        editComponentStyle(component) {
          let me = this;
          me.component = component;
          me.styleDialogVisible = true;
        },
        cancelStyleEdit() {
          let me = this;
          me.styleDialogVisible = false;
        },
        saveComponentStyle(style) {
            let me = this;
            me.component.configJson = style;
            me.styleDialogVisible = false;
            me.saveComponents();
        },
        addComponent() {
          let me = this;
          me.component = {};
          me.dialogVisible = true;
        },
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    }
});