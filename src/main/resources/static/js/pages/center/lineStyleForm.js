Vue.component('line_style_form', {
    template:`<el-dialog
            title="编辑"
            :visible.sync="visible"
            width="30%"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-form-item label="折线颜色">
                <el-color-picker v-model="style.color[0]"></el-color-picker>
            </el-form-item>
            <el-form-item label="X轴文字颜色">
                <el-color-picker v-model="style.xAxis.axisLine.lineStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="Y轴文字颜色">
                <el-color-picker v-model="style.yAxis.axisLine.lineStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="Y轴描述名称">
                <el-input v-model="style.yAxis.name" placeholder="默认值：单位（元）"></el-input>
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
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmStyle">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>`,
    data: function() {
        return {
            style: {
                //折线颜色
                color: [],
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
                series: {
                    //平滑折线
                    smooth: false,
                    //折线区域颜色
                    areaStyle: {
                        color: null
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
                    //折线颜色
                    color: [],
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
                    series: {
                        //平滑折线
                        smooth: false,
                        //折线区域颜色
                        areaStyle: {
                            color: null
                        }
                    }
                });
                mergeRecursive(this.style, val);
            }
        },
    },
    methods: {
        confirmStyle() {
            let me = this;
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