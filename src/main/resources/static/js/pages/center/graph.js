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
                <div style="padding-top: 6px">
                   <el-button size="mini" type="primary" icon="el-icon-setting">编辑</el-button>
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
    </grid-layout>`,
    data: function () {
        return {
            components: []
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
        deleteComponent(i) {
            let me = this;
            this.$confirm('若此组件包含跳转页面，则该页面也会一并被删除，是否继续此操作？', '提示', {
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
               ele.locationIndex = index;
               ele.layoutId = me.layout_id;
               ele.type = 'pie';
               ele.title = '未命名';
               ele.query = 'select * from plan';
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
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
    }
});