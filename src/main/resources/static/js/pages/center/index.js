new Vue({
   el: '#main',
   data: {
       isUpdate: false,
       dialogVisible: false,
       thumbnails: [],
       layoutList: [],
       pageInfo: {total: 10, pageNo: 1, pageSize: 10},
       layout: { enabled: 'Y'},
       rules: {
           title :[{required: true, message: '标题不能为空！', trigger: 'blur'},
               {max: 255, message: '长度超过255个字符限制！'}],
           url :[{required: true, message: 'url不能为空！', trigger: 'blur'},
               {max: 255, message: '长度超过255个字符限制'}],
           enabled :[{required: true, message: '请选择状态！'}]
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
            service.get('/layout/list', {
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
                me.layoutList.forEach((schedule) => {
                    if (schedule.createTime) {
                        schedule.createTime = new Date(schedule.createTime);
                    }
                    if (schedule.updateTime) {
                        schedule.updateTime = new Date(schedule.updateTime);
                    }
                });
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
        getPageLayoutList(pageNo) {
            let me = this;
            me.pageInfo.pageNo = pageNo;
            me.getLayoutList(pageNo);
        },
        dateFormat(row, column) {
            let date = row[column.property];
            return date ? dateFormat("yyyy-MM-dd hh:mm:ss", date) : null;
        },
        statusFormat(val) {
            return val === 'N' ? '<span style="color: red">禁用</span>' : '<span style="color: green">启用</span>'
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
            me.$refs["dataForm"].$children[1].clearValidate();
        },
        clearForm() {
            this.resetCheckbox();
            this.$refs["dataForm"].clearValidate();
            this.layout = { enabled: 'Y'};
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
        handleEdit(index, row) {
            let me = this;
            me.dialogVisible = true;
            me.isUpdate = true;
            me.layout = row;
            me.checkboxChanged(me.layout.templateName + ".png");
        },
        handleDelete(index, row) {
            let me = this;
            this.$confirm('是否删除此布局数据?', '提示', {
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
        handleClose() {
            this.dialogVisible = false;
        },
        successMsg(msg) {
            this.$message({
                message: msg,
                type: 'success'
            });
        }
    }
});