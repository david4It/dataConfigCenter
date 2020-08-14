new Vue({
    el: '#main',
    data: {
        defaultExpandKeys: [],
        isUpdate: false,
        dialogVisible: false,
        layout: {},
        graphLayoutId: null,
        sqlParams: [],
        graphLayoutTitle: null,
        layoutList: [],
        thumbnails: [],
        defaultProps: {
            children: 'children',
            label: 'title'
        },
        rules: {
            title :[{required: true, message: '标题不能为空！', trigger: 'blur'},
                {max: 255, message: '长度超过255个字符限制！'}]
        }
   },
    watch: {
        dialogVisible(val) {
            if (!val) {
                this.clearForm();
            }
        }
    },
    created(){
        this.getLayoutList();
        this.getThumbnails();
    },
    methods: {
        getLayoutList() {
            let me = this;
            service.get('/layout/treeList').then(function (res) {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.layoutList = res.data.result;
                if (me.graphLayoutId) {
                    //若已经选中了layout进行更新，则数据重新load完成之后，要默认选中
                    me.defaultExpandKeys.push(me.graphLayoutId);
                    me.$nextTick(function(){
                        me.$refs.tree.setCurrentKey(me.graphLayoutId);
                    })
                }
            }).catch(err => {
                me.$message.error("获取布局列表数据失败！");
            })
        },
        getThumbnails() {
            let me = this;
            service.get('/layout/template/thumbnails').then(function (res) {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                res.data.result.forEach((name) => {
                    me.thumbnails.push({checked: false, value: name})
                });
            }).catch(err => {
                me.$message.error("获取缩略图数据失败！");
            })
        },
        resetCheckbox() {
            let me = this;
            me.thumbnails.forEach((item) => {
                item.checked = false;
            });
        },
        checkboxChanged(value) {
            //最多只能选择一个
            let me = this;
            me.thumbnails.forEach((item) => {
                item.checked = item.value === value;
            });
            me.layout.templateName = value.split(".")[0];
            if (me.$refs["dataForm"]) {
                me.$refs["dataForm"].$children[1].clearValidate();
            }
        },
        clearForm() {
            //清除验证以及初始化相关值
            this.resetCheckbox();
            this.$refs["dataForm"].clearValidate();
            this.layout = { enabled: 'N'};
        },
        validateUrl(rule, value, callback) {
            if (!value || value.trim() === '') {
                callback(new Error("Url不能为空！"));
            } else if (value.length > 255) {
                callback(new Error("长度超过255个字符限制"));
            } else {
                //url的唯一性校验
                service.get('/layout/checkUrl', {
                    params: {
                        url: value,
                        id: this.layout.id
                    }
                }).then(res => {
                    if (!res.data.success) {
                        callback(new Error("Url校验失败！"));
                    } else {
                        if (res.data.result) {
                            callback();
                        } else {
                            callback(new Error("Url重复！"));
                        }
                    }
                })
            }
        },
        validateCheckbox(rule, value, callback) {
            if (this.layout.templateName || !this.dialogVisible) {
                callback();
            } else {
                callback(new Error("请选择模板！"))
            }
        },
        createLayout() {
            let me = this;
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    service.post('/layout/create', me.layout).then(res => {
                        if (!res.data.success) {
                            me.$message.error(res.data.message);
                            return;
                        }
                        me.dialogVisible = false;
                        me.successMsg(res.data.message);
                        me.getLayoutList();
                    }).catch(err => {
                        me.$message.error("创建布局失败！");
                    })
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        updateLayout() {
            let me = this;
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    service.post('/layout/update', me.layout).then(res => {
                        if (!res.data.success) {
                            me.$message.error(res.data.message);
                            return;
                        }
                        me.dialogVisible = false;
                        me.successMsg(res.data.message);
                        me.getLayoutList();
                    }).catch(err => {
                        me.$message.error("更新布局失败！");
                    })
                } else {
                    this.$message.error('请完善表单后再次提交！');
                }
            });
        },
        handleEdit(row) {
            let me = this;
            me.dialogVisible = true;
            me.isUpdate = true;
            //更新操作时，显示的对象要使用Object.assign复制一份，避免内存对象污染
            me.layout = Object.assign({}, row);
            me.checkboxChanged(me.layout.templateName + ".png");
        },
        handleDelete(row) {
            let me = this;
            me.$confirm('删除布局会级联删除此布局对应子页面的布局数据，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                service.delete("/layout/delete", {
                    params: {
                        id: row.id
                    }
                }).then(function(res){
                    if (!res.data.success) {
                        me.$message.error(res.data.message);
                        return;
                    }
                    me.dialogVisible = false;
                    me.graphLayoutId = null;
                    me.sqlParams = [];
                    me.graphLayoutTitle = null;
                    me.successMsg(res.data.message);
                    me.getLayoutList();
                }).catch(err => {
                    me.$message.error("删除布局数据失败！");
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        handleStatusChange(row, status) {
            let me = this;
            let result = Object.assign({}, row);
            let msg = status === 'Y' ? '是否发布此布局页面？' : '是否禁用此布局页面？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                result.enabled = status;
                service.post("/layout/enabled", result).then(function(res){
                    if (!res.data.success) {
                        me.$message.error(res.data.message);
                        return;
                    }
                    me.dialogVisible = false;
                    me.successMsg(res.data.message);
                    me.getLayoutList();
                }).catch(err => {
                    me.$message.error("更新布局状态失败！");
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
            });
        },
        preview(row) {
            let me = this;
            let result = Object.assign({}, row);
            service.post("/layout/preview", result).then(function(res){
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.$confirm('预览页面已经生成，点击确定按钮进行查看', '提示', {
                    confirmButtonText: '确定',
                    type: 'success'
                }).then(()=> {
                    window.open(window.location.origin + "/preview/" + row.url,"_blank");
                })
            }).catch(err => {
                me.$message.error("生成预览页面失败！");
            });
        },
        handleClose() {
            this.dialogVisible = false;
        },
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        },
        loadSubLayout(layoutId) {
            let me = this;
            me.graphLayoutId = layoutId;
            me.defaultExpandKeys.length = 0;
            me.defaultExpandKeys.push(me.graphLayoutId);
            let subLayout = me.recursionFindLayout(me.layoutList, layoutId);
            me.sqlParams = subLayout.sqlParams;
            me.graphLayoutTitle = subLayout.title + ' (' + subLayout.url + ')';
            me.$nextTick(function(){
                me.$refs.tree.setCurrentKey(me.graphLayoutId);
            })
        },
        recursionFindLayout(list, layoutId) {
            let me = this;
            let index = list.findIndex((i) => {
                return i.id === layoutId;
            });
            if (index !== -1) {
                return list[index];
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].children.length > 0) {
                    let result = me.recursionFindLayout(list[i].children, layoutId);
                    if (result) {
                        return result;
                    }
                }
            }
        },
        handleNodeClick(data) {
            this.graphLayoutId = data.id;
            this.sqlParams = data.sqlParams;
            this.graphLayoutTitle = data.title + ' (' + data.url + ')';
        }
    }
});