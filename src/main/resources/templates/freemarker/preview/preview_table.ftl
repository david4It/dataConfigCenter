    //此组件自定义配置，请参照http://datav.jiaminghi.com/guide/scrollBoard.html
    component_${vo.getLocationIndex()}(){
    setTimeout(() => {
        let config = {
            header: ['预览字段A', '预览字段B', '预览字段C', '预览字段D'], data: ["1111","2222","3333","4444","5555","6666","7777","8888"]
        };
        this.tableConfig = config;
        this.tableKey = 'changed';
        $('${'#component_' + vo.getLocationIndex()}').parent().parent().css("display", "block");
        $('${'#component_' + vo.getLocationIndex()}').parent().parent().next().css("display", "none");
        <#if vo.getLinkEnabled()?? && vo.getLinkEnabled()=="Y">
        rowClick(event){
            forwardUrl(this.tableExtData[event.rowIndex], "${vo.getLinkUrl()}")
        },
        </#if>
    }, 500);
    },