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
            <el-form-item label="展示类型聚合">
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
                    tooltip: {
                        position: 'right',
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