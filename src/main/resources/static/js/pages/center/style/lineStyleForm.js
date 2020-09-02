//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('line_style_form', {
    template:`<el-dialog
            title="折线图属性配置"
            :visible.sync="visible"
            width="30%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-form-item label="类别文字颜色">
                <el-color-picker v-model="style.legend.textStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="X轴文字颜色">
                <el-color-picker v-model="style.xAxis.axisLine.lineStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="Y轴文字颜色">
                <el-color-picker v-model="style.yAxis.axisLine.lineStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="Y轴描述名称">
                <el-input v-model="style.yAxis.name"></el-input>
            </el-form-item>
            <el-form-item label="折线平滑">
                <el-select v-model="style.series.smooth" placeholder="请选择">
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
            <el-form-item label="折线区域填充">
                <el-color-picker v-model="style.series.areaStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="动画效果">
                <el-select v-model="style.cusAnimation.enable" placeholder="请选择">
                    <el-option
                      key="Y"
                      label="开启"
                      value="Y">
                    </el-option>
                    <el-option
                      key="N"
                      label="关闭"
                      value="N">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="style.cusAnimation.enable === 'Y'" label="间隔时长（秒）">
                <el-input v-model="style.cusAnimation.duration" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmStyle">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>`,
    data: function() {
        return {
            style: {
                xAxis: {
                    axisLine: {
                        //X轴文字颜色
                        lineStyle: {
                            color: '#ffffff'
                        }
                    }
                },
                yAxis: {
                    //y轴文字颜色
                    axisLine: {
                        lineStyle: {
                            color: '#ffffff'
                        }
                    },
                    name: null
                },
                legend: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: {
                    //平滑折线
                    smooth: false,
                    //折线区域颜色
                    areaStyle: {
                        color: null
                    }
                },
                cusAnimation: {
                    enable: 'N',
                    duration: 5
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
        visible(val) {
            if (val) {
                this.resetStyle();
                mergeRecursive(this.style, this.config);
            }
        }
    },
    methods: {
        confirmStyle() {
            let me = this;
            //值为空的配置项，则直接剔除
            clearDeep(me.style);
            me.$emit('save_component_style', me.style);
            //clearDeep方法可能会清除部分属性，导致vue绑定值为undefined，需调用resetStyle方法重置对象
            me.resetStyle();
        },
        cancel() {
            let me = this;
            me.$emit('cancel');
        },
        resetStyle() {
            let me = this;
            me.style = {
                xAxis: {
                    axisLine: {
                        //X轴文字颜色
                        lineStyle: {
                            color: null
                        }
                    }
                },
                yAxis: {
                    //y轴文字颜色
                    axisLine: {
                        lineStyle: {
                            color: null
                        }
                    },
                    name: null
                },
                legend: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                series: {
                    //平滑折线
                    smooth: false,
                    //折线区域颜色
                    areaStyle: {
                        color: null
                    }
                },
                cusAnimation: {
                    enable: 'N',
                    duration: 5
                }
            };
        }
    }
});