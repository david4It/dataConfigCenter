//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('pie_style_form', {
    template:`<el-dialog
            title="饼状图属性配置"
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
             <el-form-item label="提示文本位置">
                <el-select v-model="style.tooltip.position" placeholder="请选择">
                    <el-option
                      key="top"
                      label="上"
                      value="top">
                    </el-option>
                    <el-option
                      key="bottom"
                      label="下"
                      value="bottom">
                    </el-option>
                    <el-option
                      key="left"
                      label="左"
                      value="left">
                    </el-option>
                    <el-option
                      key="right"
                      label="右"
                      value="right">
                    </el-option>
                </el-select>
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
                legend: {
                    show: true
                },
                tooltip: {
                    position: 'right',
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
            if (me.style.cusAnimation.enable === 'Y') {
                if (!me.style.cusAnimation.duration) {
                    //启用默认值
                    me.style.cusAnimation.duration = 5;
                }
            } else {
                me.style.cusAnimation.duration = null;
            }
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
                legend: {
                    show: true
                },
                tooltip: {
                    position: 'right',
                },
                cusAnimation: {
                    enable: 'N',
                    duration: 5
                }
            };
        }
    }
});