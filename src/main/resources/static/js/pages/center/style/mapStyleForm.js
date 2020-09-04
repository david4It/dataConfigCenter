//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('map_style_form', {
    template:`<el-dialog
            title="地图属性配置"
            :visible.sync="visible"
            width="30%"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-divider content-position="center">未选中状态</el-divider>
            <el-form-item label="区域边框颜色">
                <el-color-picker v-model="style.series.itemStyle.normal.borderColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="区域背景色">
                <el-color-picker v-model="style.series.itemStyle.normal.areaColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="显示区域名称">
                <el-select v-model="style.series.itemStyle.normal.label.show" placeholder="请选择">
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
            <el-form-item label="区域名称颜色">
                <el-color-picker v-model="style.series.itemStyle.normal.label.textStyle.color"></el-color-picker>
            </el-form-item>
            
            <el-divider content-position="center">选中状态</el-divider>
            <el-form-item label="区域边框颜色">
                <el-color-picker v-model="style.series.itemStyle.emphasis.borderColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="区域背景色">
                <el-color-picker v-model="style.series.itemStyle.emphasis.areaColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="显示区域名称">
                <el-select v-model="style.series.itemStyle.emphasis.label.show" placeholder="请选择">
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
            <el-form-item label="区域名称颜色">
                <el-color-picker v-model="style.series.itemStyle.emphasis.label.textStyle.color"></el-color-picker>
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
                    itemStyle: {
                        normal: { //未选中状态
                            borderColor: '#2c2c2c',
                            areaColor: '#fff',//背景颜色
                            label: {
                                show: false,//显示名称
                                textStyle: {
                                    color: '#2c2c2c'
                                }
                            }
                        },
                        emphasis: {// 也是选中样式
                            borderColor: '#fff',
                            areaColor: '#FF8C00',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#2c2c2c'
                                }
                            }
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
                    itemStyle: {
                        normal: { //未选中状态
                            borderColor: '#2c2c2c',
                            areaColor: '#fff',//背景颜色
                            label: {
                                show: false,//显示名称
                                textStyle: {
                                    color: '#2c2c2c'
                                }
                            }
                        },
                        emphasis: {// 也是选中样式
                            borderColor: '#fff',
                            areaColor: '#FF8C00',
                            label: {
                                show: true,
                                textStyle: {
                                    color: '#2c2c2c'
                                }
                            }
                        }
                    }
                }
            };
        }
    }
});