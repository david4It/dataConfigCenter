//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('radar_style_form', {
    template:`<el-dialog
            title="雷达图属性配置"
            :visible.sync="visible"
            width="30%" 
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
         <el-form-item label="类别展示">
                <el-select v-model="style.legend.show" placeholder="请选择">
                    <el-option
                      key="true"
                      label="是"
                      :value="true">
                    </el-option>
                    <el-option
                      key="false"
                      label="否"
                      :value="false">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="范围填充">
                <el-select v-model="enabledAreaStyle" placeholder="请选择" @change="areaStyleChanged">
                    <el-option
                      key="true"
                      label="开启"
                      :value="true">
                    </el-option>
                    <el-option
                      key="false"
                      label="关闭"
                      :value="false">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="背景颜色显示">
                <el-select v-model="style.radar.splitArea.show" placeholder="请选择">
                    <el-option
                      key="true"
                      label="开启"
                      :value="true">
                    </el-option>
                    <el-option
                      key="false"
                      label="关闭"
                      :value="false">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="style.radar.splitArea.show" label="背景颜色">
                <el-color-picker v-model="style.radar.splitArea.areaStyle.color[0]"></el-color-picker>
            </el-form-item>
            <el-form-item label="网格线颜色调整">
                <el-select v-model="style.radar.splitLine.show" placeholder="请选择">
                    <el-option
                      key="true"
                      label="开启"
                      :value="true">
                    </el-option>
                    <el-option
                      key="false"
                      label="关闭"
                      :value="false">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="style.radar.splitLine.show"  label="网格线颜色">
                <el-color-picker v-model="style.radar.splitLine.lineStyle.color[0]"></el-color-picker>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmStyle">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>`,
    data: function() {
        return {
            enabledAreaStyle: false,
            style: {
                legend: {
                    show: true
                },
                radar: {
                    splitArea : {
                        show : false,
                        areaStyle : {
                            color: []  // 图表背景网格的颜色
                        }
                    },
                    splitLine : {
                        show : false,
                        lineStyle : {
                            width : 1,
                            color : [] // 图表背景网格线的颜色
                        }
                    }
                }
            }
        }
    },
    props: {
        config: {
            type: Object,
            default: () => {}
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        config(val) {
            if (val) {
                //每次赋值的时候，重新进行assign操作，防止因为值为空，属性被剔除掉，而导致整个form显示错误
                Object.assign(this.style, {
                    legend: {
                        show: true
                    },
                    radar: {
                        splitArea : {
                            show : false,
                            areaStyle : {
                                color: []  // 图表背景网格的颜色
                            }
                        },
                        splitLine : {
                            show : false,
                            lineStyle : {
                                width : 1,
                                color : [] // 图表背景网格线的颜色
                            }
                        }
                    }
                });
                if (val.series && val.series.areaStyle) {
                    this.enabledAreaStyle = true;
                }
                mergeRecursive(this.style, val);
            }
        },
    },
    methods: {
        areaStyleChanged(val) {
            let me = this;
            if (val) {
                me.style.series = { areaStyle: { show: true}};
            } else {
                if (me.style.series) {
                    delete me.style.series;
                }
            }
        },
        confirmStyle() {
            let me = this;
            if (!me.style.radar.splitArea.show) {
                delete me.style.radar.splitArea;
            }
            if (!me.style.radar.splitLine.show) {
                delete me.style.radar.splitLine;
            }
            //值为空的配置项，则直接剔除
            clearDeep(me.style);
            me.$emit('save_component_style', me.style);
        },
        cancel() {
            let me = this;
            me.$emit('cancel');
        }
    }
});