<#list components as vo>
<div style="width: ${vo.getWidth()?c}%; height: ${(vo.getHeight() * 100)?c}px; position: absolute; top: ${(vo.getY() * 100)?c}px; left: ${(vo.getX())?c}%; padding: 15px;">
    <dv-border-box-8>
        <div style="height: 40px; width: 100%; text-align: center; font-size: 20px; font-weight: bold; color: whitesmoke; padding: 5px 0 5px 0">${vo.title}</div>
        <div id="${'component_' + vo.getLocationIndex()}" class="chart" style="width:100%;height: ${(vo.getHeight() * 100 - 70)?c}px;"></div>
    </dv-border-box-8>
</div>
</#list>