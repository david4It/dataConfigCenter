<#list components as vo>
<div style="width: ${vo.getWidth()?c}%; height: ${(vo.getHeight() * 80)?c}px; position: absolute; top: ${(vo.getY() * 80)?c}px; left: ${(vo.getX())?c}%; padding: 15px;">
    <dv-border-box-8 v-show="false">
        <div style="height: 40px; width: 100%; text-align: center; font-size: 20px; font-weight: bold; color: whitesmoke; padding: 5px 0 5px 0">${vo.title}</div>
        <#if vo.getType() == 'table'>
            <dv-scroll-board :key="tableKey" id="${'component_' + vo.getLocationIndex()}" :config="tableConfig" <#if vo.getLinkUrl()??>@click="rowClick"</#if> style="width:100%;height: ${(vo.getHeight() * 80 - 80)?c}px; padding: 5px;" />
        <#else>
            <div id="${'component_' + vo.getLocationIndex()}" class="chart" style="width:100%;height: ${(vo.getHeight() * 80 - 70)?c}px;"></div>
        </#if>
    </dv-border-box-8>
    <dv-loading><span style="font-size: 16px;color: white">Loading...</span></dv-loading>
</div>
</#list>