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
    ><grid-item style="background-color: #778899" v-for="item in components"
                   :minW="25"
                   :minH="5"
                   :x="item.x"
                   :y="item.y"
                   :w="item.w"
                   :h="item.h"
                   :i="item.i"
                   :key="item.i">
            <div style="border-top: solid 1px #DCDCDC; position: absolute; width: 100%; height: 40px; left: 0; bottom: 0">
                <div style="padding-top: 6px; text-align: center">
                   <el-button size="mini" type="primary" icon="el-icon-setting" @click="editComponent(item)">编辑</el-button>
                   <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteComponent(item.i)">删除</el-button>
                </div>
            </div>
        </grid-item>
        <div v-show="layout_id" style="z-index: 1; position:fixed; right: 40px; top: 60%;" title="新增">
           <el-button type="primary" icon="el-icon-plus" circle @click="dialogVisible = true"></el-button>
        </div>        
        <div v-show="layout_id && components.length > 0" style="z-index: 1; position:fixed; right: 40px; top: 66%;" title="保存">
           <el-button type="success" icon="el-icon-check" circle @click="saveComponents"></el-button>
        </div>
        
        <el-dialog 
            title="新增子页面"
            :visible.sync="subDialogVisible"
            width="30%"
            :show-close="false">
            <el-form ref="subDataForm" :model="subLayout" label-width="140px">
                <el-form-item label="标题" prop="title"
                            :rules="[{required: true, validator: validateTitle}]">
                    <el-input v-model="subLayout.title"></el-input>
                 </el-form-item>
                <el-form-item label="模板" prop="templateName"
                          :rules="[{required: true, validator: validateCheckbox}]">
                    <div style="overflow: hidden; height: 150px; overflow-y:scroll;">
                        <el-checkbox v-model="thumb.checked" v-for="thumb in thumbnails" :key="thumb.value" @change="checkboxChanged(thumb.value)" bordar>
                            <el-popover
                                    placement="right"
                                    trigger="hover">
                                <img style="width: 800px" :src="'/img/center/template/' + thumb.value"/>
                                <img slot="reference" :src="'/img/center/template/' + thumb.value"  style="width: 200px">
                            </el-popover>
                        </el-checkbox>
                    </div>
                </el-form-item>
                <el-form-item label="URL" prop="url" :rules="[{required: true, validator: validateUrl, trigger: 'blur'}]">
                    <el-input v-model="subLayout.url"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="subDialogVisible = false; subLayout = {}">取 消</el-button>
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
                <el-select v-model="component.type" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="SQL语句" prop="query"
                :rules="[{required: true, validator: validateSql, trigger: 'blur'}]">
                <el-input type="textarea"
                 :autosize="{ minRows: 3, maxRows: 6}"
                 v-model="component.query"></el-input>
            </el-form-item>
            <el-form-item v-if="selections.length > 0" label="描述字段" prop="desField"
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
            <el-form-item v-if="selections.length > 0" label="数值字段" prop="valueField"
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
            <el-form-item label="页面跳转" prop="redirect">
                <el-select v-model="component.redirect" placeholder="请选择" @change="redirectChanged">
                    <el-option
                      key="N"
                      label="否"
                      value="N">
                    </el-option>
                    <el-option
                      key="Y"
                      label="是"
                      value="Y">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="selections.length > 0 && component.redirect === 'Y'" label="页面传参">
                <el-checkbox-group v-model="params">
                    <el-checkbox v-for="item in selections" :key="item.value" :label="item.label"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="subLayout.title" label="子页面名称">
                <el-input v-model="subLayout.title" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="subLayout.url" label="子页面Url">
                <el-input v-model="subLayout.url" disabled></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmComponent">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
    </el-dialog>
    </grid-layout>`,
    data: function () {
        return {
            components: [],
            component: {},
            params: [],
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
                {label: '地图', value: 'map'}
            ],
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
                this.resetCheckbox();
                this.$refs["subDataForm"].clearValidate();
                this.subLayout = {};
                if (JSON.stringify(this.subLayout) === '{}') {
                    this.component.redirect = 'N';
                }
            }
        },
        dialogVisible(val) {
            if (!val) {
                this.currentSql = null;
                this.component = {};
                this.params = [];
                this.subLayout = {};
                this.isUpdate = false;
                this.$refs["dataForm"].clearValidate();
                this.selections = [];
            } else {
                //编辑操作，若sql存在，需要获取到selections相关数据
                if (this.component.query) {
                    service.post('/sql/selections', {
                        sql: this.component.query
                    }).then(res => {
                        if (!res.data.success) {
                            this.$message({
                                type: 'danger',
                                message: res.data.message
                            });
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
                    me.components.push(item);
                    if (item.link) {
                        item.redirect = 'Y';
                    } else {
                        item.redirect = 'N';
                    }
                    item.desField = item.categoryValuePattern.split(":")[0];
                    item.valueField = item.categoryValuePattern.split(":")[1];
                    item.i = item.locationIndex;
                    item.w = item.width;
                    item.h = item.height;
                });
            }).catch(err => {
                me.$message.error("获取组件列表数据失败！");
            })
        },
        editComponent(c) {
            let me = this;
            me.isUpdate = true;
            if (c.link) {
                me.subLayout.url = c.linkUrl;
                me.subLayout.title = c.linkTitle;
                me.params = c.params.split(",");
            }
            me.component = Object.assign({}, c);
            me.currentSql = c.query;
            me.dialogVisible = true;
        },
        validateSql(rule, value, callback) {
            let me = this;
            if (!value || value.trim() === '') {
                me.selections = [];
                callback(new Error("SQL不能为空！"));
            } else {
                if (me.currentSql !== me.component.query) {
                    service.post('/sql/selections', {
                        sql: value
                    }).then(res => {
                        if (!res.data.success) {
                            callback(new Error(res.data.message));
                        } else {
                            if (res.data.result.length === 0) {
                                callback(new Error("请明确SQL中查询字段，不要使用SELECT * 语句！"));
                            } else {
                                //SQL变化导致下拉选项发生变化，需清空数据重新选择
                                me.params = [];
                                me.selections = [];
                                me.currentSql = value;
                                if (me.component.desField) {
                                    me.component.desField = null;
                                }
                                if (me.component.valueField) {
                                    me.component.valueField = null;
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
        resetCheckbox() {
            let me = this;
            me.thumbnails.forEach((item) => {
                item.checked = false;
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
                callback(new Error("描述字段不能为空"));
            } else {
                callback();
            }
        },
        validateValueField(rule, value, callback) {
            if (!value) {
                callback(new Error("值字段不能为空"));
            } else {
                callback();
            }
        },
        getThumbnails() {
            let me = this;
            service.get('/layout/template/thumbnails').then(function (res) {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                res.data.result.forEach((name) => {
                    me.thumbnails.push({checked: false, value: name})
                });
            }).catch(err => {
                me.$message.error("获取缩略图数据失败！");
            })
        },
        deleteComponent(i) {
            let me = this;
            this.$confirm('若此组件包含跳转的子页面，则子页面也会一并被删除，是否继续此操作？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let index = me.components.findIndex(c => {
                    return c.i === i;
                });
                me.components.splice(index, 1);
                me.saveComponents();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        saveComponents() {
            let me = this;
            me.components.sort((v1,v2) => {
                return v1.x - v2.x;
            });
            me.components.sort((v1,v2) => {
                return v1.y - v2.y;
            });
            me.components.forEach((ele, index) => {
               ele.locationIndex = index;
               ele.layoutId = me.layout_id;
               ele.categoryValuePattern = ele.desField + ":" + ele.valueField;
               ele.width = ele.w;
               ele.height = ele.h;
            });
            service.post('/component/save', me.components).then(res => {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.successMsg(res.data.message);
                if (me.dialogVisible) {
                    me.dialogVisible = false;
                }
            }).catch(err => {
                console.log(err);
            })
        },
        confirmComponent() {
            let me = this;
            me.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    me.component.params = me.params.length > 0 ? me.params.toString() : null;
                    if (!me.isUpdate) {
                        //新增组件位置默认在第一个位置
                        let baseInfo = {x: 0, y: 0, w: 25, h: 5, i: me.components.length};
                        let result = Object.assign(baseInfo, me.component);
                        me.components.push(result);
                        if (JSON.stringify(me.subLayout) !== "{}") {
                            service.post("/layout/createSubLayout", me.subLayout).then(res => {
                                if (!res.data.success) {
                                    me.$message.error(res.data.message);
                                    return;
                                }
                                beSaved.link = res.data.result;
                                me.saveComponents();
                            }).catch(err => {
                                me.$message.error("保存子页面失败！");
                            })
                        }
                    } else {
                        let index = me.components.findIndex(c => {
                            return c.i === me.component.i;
                        });
                        me.components[index] = me.component;
                        me.saveComponents();
                    }
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        createSubLayout() {
            let me = this;
            me.$refs["subDataForm"].validate((valid) => {
                if (valid) {
                    //保存在内存中，并不提交到后台
                    me.subDialogVisible = false;
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        redirectChanged(val) {
            let me = this;
            me.subDialogVisible = val === 'Y';
            if (val === 'N') {
                me.subLayout = {};
            }
        },
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    }
});