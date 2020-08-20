//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('gauge_style_form', {
    template:`<el-dialog
            title="仪表盘属性配置"
            :visible.sync="visible"
            width="30%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-form-item label="底部数值颜色">
                <el-color-picker v-model="style.series.detail.textStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="底部数值字体大小">
                <el-input v-model="style.series.detail.textStyle.fontSize" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="指标文字颜色">
                <el-color-picker v-model="style.series.title.textStyle.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="指标文字大小">
                <el-input v-model="style.series.title.textStyle.fontSize" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="仪表盘色带厚度">
                <el-input v-model="style.series.axisLine.lineStyle.width" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="仪表盘刻度数字大小">
                <el-input v-model="style.series.axisLabel.fontSize" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
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
                series: {
                    detail: {
                        //设置仪表盘下方显示内容位置
                        textStyle: {
                            color: '#ffffff',
                            fontSize: null
                        },
                    },
                    title: { //设置仪表盘中间显示文字样式
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontSize: null,
                            color: "#ffffff"
                        }
                    },
                    axisLine: {
                        show: true,
                        // 是否显示仪表盘轴线(轮廓线),默认 true。
                        lineStyle: { // 属性lineStyle控制线条样式
                            width: null //表盘宽度
                        }
                    },
                    axisLabel: { //文字样式（及“10”、“20”等文字样式）
                        fontSize: null
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
                series: {
                    detail: {
                        //设置仪表盘下方显示内容位置
                        textStyle: {
                            color: '#ffffff',
                            fontSize: null
                        },
                    },
                    title: { //设置仪表盘中间显示文字样式
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontSize: null,
                            color: "#ffffff"
                        }
                    },
                    axisLine: {
                        show: true,
                        // 是否显示仪表盘轴线(轮廓线),默认 true。
                        lineStyle: { // 属性lineStyle控制线条样式
                            width: null //表盘宽度
                        }
                    },
                    axisLabel: { //文字样式（及“10”、“20”等文字样式）
                        fontSize: null
                    }
                }
            };
        }
    }
});