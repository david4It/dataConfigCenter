//使用:close-on-press-escape="false"和:close-on-click-modal="false"，禁用点击Esc按钮和点击空白处关闭弹窗
Vue.component('table_style_form', {
    template:`<el-dialog
            title="表格图属性配置"
            :visible.sync="visible"
            width="30%" 
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            :show-close="false">
        <el-form ref="dataForm" :model="style" label-width="140px">
            <el-form-item label="表行数">
                <el-input v-model="style.rowNum" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="表头背景色">
                <el-color-picker v-model="style.headerBGC"></el-color-picker>
            </el-form-item>            
            <el-form-item label="奇数行背景色">
                <el-color-picker v-model="style.oddRowBGC"></el-color-picker>
            </el-form-item>            
            <el-form-item label="偶数行背景色">
                <el-color-picker v-model="style.evenRowBGC"></el-color-picker>
            </el-form-item>
            <el-form-item label="轮播间隔（ms）">
                <el-input v-model="style.waitTime" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>            
            <el-form-item label="表头高度">
                <el-input v-model="style.headerHeight" onkeyup="value=value.replace(/[^\\d]/g,'')"></el-input>
            </el-form-item>
            <el-form-item label="列对齐方式">
                <el-select v-model="style.align" placeholder="请选择">
                    <el-option
                      key="left"
                      label="左对齐"
                      value="left">
                    </el-option>
                    <el-option
                      key="center"
                      label="居中对齐"
                      value="center">
                    </el-option>
                    <el-option
                      key="right"
                      label="右对齐"
                      value="right">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="轮播方式">
                <el-select v-model="style.carousel" placeholder="请选择">
                    <el-option
                      key="single"
                      label="单行滚动"
                      value="single">
                    </el-option>
                    <el-option
                      key="page"
                      label="整页滚动"
                      value="page">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="悬浮暂停轮播">
                <el-select v-model="style.hoverPause" placeholder="请选择">
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
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmStyle">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </span>
    </el-dialog>`,
    data: function() {
        return {
            style: {
                rowNum: 5,
                headerBGC: '#00BAFF',
                oddRowBGC: '#003B51',
                evenRowBGC: '#0A2732',
                waitTime: 2000,
                headerHeight: 35,
                align: 'center',
                carousel: 'single',
                hoverPause: true
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
                    rowNum: 5,
                    headerBGC: '#00BAFF',
                    oddRowBGC: '#003B51',
                    evenRowBGC: '#0A2732',
                    waitTime: 2000,
                    headerHeight: 35,
                    align: 'center',
                    carousel: 'single',
                    hoverPause: true
                });
                mergeRecursive(this.style, val);
            }
        },
    },
    methods: {
        confirmStyle() {
            let me = this;
            me.$emit('save_component_style', me.style);
        },
        cancel() {
            let me = this;
            me.$emit('cancel');
        }
    }
});