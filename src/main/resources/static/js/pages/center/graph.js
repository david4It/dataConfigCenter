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
        <div style="z-index: 9999; position:fixed; right: 40px; top: 60%;" title="新增">
           <el-button type="primary" icon="el-icon-plus" circle @click="addComponent"></el-button>
        </div>        
        <div style="z-index: 9999; position:fixed; right: 40px; top: 66%;" title="保存">
           <el-button type="success" icon="el-icon-check" circle @click="saveComponents"></el-button>
        </div>
    </grid-layout>`,
    data: function () {
        return {
            components: [
            ]
        }
    },
    methods: {
        addComponent() {
            let me = this;
            let component = {"x":0,"y":0,"w":25,"h":5,"i":"0", title: ""};
            component.i = me.components.length;
            me.components.push(component);
        },
        deleteComponent(i) {
          let me = this;
          me.components.splice(parseInt(i), 1);
        },
        saveComponents() {
            
        }
    }
});