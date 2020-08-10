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
        <div v-show="layout_id" style="z-index: 9999; position:fixed; right: 40px; top: 60%;" title="新增">
           <el-button type="primary" icon="el-icon-plus" circle @click="addComponent"></el-button>
        </div>        
        <div v-show="layout_id" style="z-index: 9999; position:fixed; right: 40px; top: 66%;" title="保存">
           <el-button type="success" icon="el-icon-check" circle @click="saveComponents"></el-button>
        </div>
            <el-dialog
                title="编辑"
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
            rules: {
                title :[{required: true, message: '标题不能为空！', trigger: 'blur'},
                    {max: 255, message: '长度超过255个字符限制！'}],
                type :[{required: true, message: '类型不能为空！', trigger: 'blur'}]
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
           } else {
               this.components.length = 0;
           }
        },
        dialogVisible(val) {
            if (!val) {
                this.component = {};
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
        addComponent() {
            let me = this;
            let component = {x: 0, y: 0, w: 25, h: 5, i: 0};
            //新增组件位置始终保证在左下方第一个
            component.i = me.components.length;
            if (component.i > 0) {
                let last = me.components[component.i-1];
                component.y = last.y + last.h;
            }
            me.components.push(component);
        },
        editComponent(c) {
            let me = this;
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
                debugger
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
            }).catch(err => {
                console.log(err);
            })
        },
        confirmComponent() {
            let me = this;
            me.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    let index = me.components.findIndex(c => {
                        return c.i === this.component.i;
                    });
                    me.components[index] = me.component;
                    me.dialogVisible = false;
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    }
});