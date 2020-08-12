    //此组件自定义配置，请参照http://datav.jiaminghi.com/guide/scrollBoard.html
    component_${vo.getLocationIndex()}() {
        axios.post("/statistics/common", {componentId: ${vo.getId()}}).then((res) => {
            if (res.data.success) {
                let config = {header: [], data: []};
                let result = res.data.result;
                if (result.legendData) {
                    config.header = result.legendData;
                }
                if (result.seriesData) {
                    config.data = result.seriesData;
                }
                if (result.configJson) {
                    mergeRecursive(config, result.configJson);
                }
                if (result.extData) {
                    this.tableExtData = result.extData;
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
    <#if vo.getLinkEnabled()!"N"=="Y">
    rowClick(event) {
        forwardUrl(this.tableExtData[event.rowIndex], "${vo.getLinkUrl()}")
    },
    </#if>