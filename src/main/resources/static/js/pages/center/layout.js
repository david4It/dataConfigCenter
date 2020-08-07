new Vue({
    el: '#main',
    data: {
        pageInfo: {total: 10, pageNo: 1, pageSize: 10},
        isUpdate: false,
        dialogVisible: false,
        layout: { enabled: 'N' },
        graphLayoutId: null,
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
        getLayoutList(pageNo = 1) {
            let me = this;
            service.get('/layout/treeList', {
                params: {
                    pageNo: pageNo,
                    pageSize: this.pageInfo.pageSize
                }
            }).then(function (res) {
                if (!res.data.success) {
                    me.$message.error(res.data.message);
                    return;
                }
                me.layoutList = res.data.result;
                me.pageInfo.total = res.data.total;
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
            me.layout = Object.assign({}, row);
            me.checkboxChanged(me.layout.templateName + ".png");
        },
        handleDelete(row) {
            let me = this;
            this.$confirm('删除布局会级联删除此布局对应子页面的布局数据，请谨慎操作！', '提示', {
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
            let msg = status === 'Y' ? '是否发布此布局页面？' : '是否禁用此布局页面？';
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.enabled = status;
                service.post("/layout/update", row).then(function(res){
                    if (!res.data.success) {
                        me.$message.error(res.data.message);
                        return;
                    }
                    me.dialogVisible = false;
                    me.successMsg(res.data.message);
                    me.getLayoutList();
                }).catch(err => {
                    me.$message.error("更新布局数据失败！");
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                });
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
        getPageLayoutList(pageNo) {
            let me = this;
            me.pageInfo.pageNo = pageNo;
            me.getLayoutList(pageNo);
        },
        handleNodeClick(data) {
            this.graphLayoutId = data.id;
            this.graphLayoutTitle = data.title;
        }
    }
});