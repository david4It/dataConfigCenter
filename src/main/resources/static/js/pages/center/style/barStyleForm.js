//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('bar_style_form', {
    template:`<el-dialog
            title="柱状图属性配置"
            :visible.sync="visible"
            width="30%" 
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-form-item label="柱状颜色">
                <el-color-picker v-model="style.color[0]"></el-color-picker>
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
<!--            <el-form-item label="显示柱状背景色">-->
<!--                <el-select v-model="style.series.showBackground" placeholder="请选择">-->
<!--                    <el-option-->
<!--                      key="true"-->
<!--                      label="是"-->
<!--                      :value="true">-->
<!--                    </el-option>-->
<!--                    <el-option-->
<!--                      key="false"-->
<!--                      label="否"-->
<!--                      :value="false">-->
<!--                    </el-option>-->
<!--                </el-select>-->
<!--            </el-form-item>-->
<!--            <el-form-item label="柱状背景色" v-if="style.series.showBackground">-->
<!--                <el-color-picker v-model="style.series.backgroundStyle.color"></el-color-picker>-->
<!--            </el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmStyle">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>`,
    data: function() {
        return {
            style: {
                //柱状颜色
                color: ['#3297db'],
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
                // series: {
                //     //柱状背景色
                //     showBackground: false,
                //     backgroundStyle: {
                //         color: null,
                //     }
                // }
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
                //柱状颜色
                color: ['#3297db'],
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
                // series: {
                //     //柱状背景色
                //     showBackground: false,
                //     backgroundStyle: {
                //         color: null,
                //     }
                // }
            };
        }
    }
});