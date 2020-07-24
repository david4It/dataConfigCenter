<#list components as vo>
<div style="width: ${vo.getWidth()}%; height: ${vo.getHeight() * 100}px; position: absolute; top: ${vo.getY() * 100}px; left: ${vo.getX()}%; padding: 15px;">
    <dv-border-box-8></dv-border-box-8>
</div>
</#list>