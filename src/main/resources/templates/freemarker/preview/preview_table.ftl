    //此组件自定义配置，请参照http://datav.jiaminghi.com/guide/scrollBoard.html
    component_${vo.getLocationIndex()}(){
        axios.post("/statistics/preview", {componentId: ${vo.getId()}}).then((res) => {
            if (res.data.success) {
                let config = {
                    header: ['第1列', '第2列', '第3列'],
                    data: [
                        ['预览数据A1', '预览数据A2', '预览数据A3'],
                        ['预览数据B1', '预览数据B2', '预览数据B3'],
                        ['预览数据C1', '预览数据C2', '预览数据C3'],
                        ['预览数据D1', '预览数据D2', '预览数据D3'],
                        ['预览数据E1', '预览数据E2', '预览数据E3'],
                        ['预览数据F1', '预览数据F2', '预览数据F3'],
                        ['预览数据G1', '预览数据G2', '预览数据G3']
                    ]
                };
                let result = res.data.result;
                if (result.configJson) {
                    mergeRecursive(config, result.configJson);
                }
                this.tableConfig = config;
                this.tableKey = 'changed';
                $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
                $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
            } else {
                //获取数据失败
            }
        });
    },