package com.scsme.dataConfigCenter.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 *
 */
@Data
public class WidgetDataModel implements Serializable {
    private List<GraphDimension> dimension;
    private List<GraphMetrics>  metrics;
    private List data;
    private List<GraphDimension> filters;
    private int selectedChart;
    private String jsonChartStyle;
    private String jsonModel;
    private String actionUrl;
    private boolean cached;
    private boolean autoReload;
    private boolean expired;
}
/**
 * 数据模型json样板
 {
 "data": [],
 "dimension": [{
 "name": "provinceName",
 "visualType": "geoProvince",
 "type": "category",
 "config": true,
 "field": {
 "alias": "",
 "desc": "",
 "useExpression": false
 },
 "format": {
 "formatType": "default"
 },
 "from": "cols"
 }, {
 "name": "cityName",
 "visualType": "geoCity",
 "type": "category",
 "config": true,
 "field": {
 "alias": "",
 "desc": "",
 "useExpression": false
 },
 "format": {
 "formatType": "default"
 },
 "from": "cols"
 }, {
 "name": "countyName",
 "visualType": "GeoArea",
 "type": "category",
 "config": true,
 "field": {
 "alias": "",
 "desc": "",
 "useExpression": false
 },
 "format": {
 "formatType": "default"
 },
 "from": "cols"
 }],
 "rows": [],
 "metrics": [{
 "name": "总计",
 "visualType": "number",
 "type": "value",
 "agg": "sum",
 "config": true,
 "chart": {
 "id": 1,
 "name": "table",
 "title": "表格",
 "icon": "icon-table",
 "coordinate": "other",
 "rules": [{
 "dimension": [0, 9999],
 "metric": [0, 9999]
 }],
 "data": {
 "cols": {
 "title": "列",
 "type": "category"
 },
 "rows": {
 "title": "行",
 "type": "category"
 },
 "metrics": {
 "title": "指标",
 "type": "value"
 },
 "filters": {
 "title": "筛选",
 "type": "all"
 }
 },
 "style": {
 "table": {
 "fontFamily": "PingFang SC",
 "fontSize": "12",
 "color": "#666",
 "lineStyle": "solid",
 "lineColor": "#D9D9D9",
 "headerBackgroundColor": "#f7f7f7",
 "headerConfig": [],
 "columnsConfig": [],
 "leftFixedColumns": [],
 "rightFixedColumns": [],
 "headerFixed": true,
 "autoMergeCell": true,
 "bordered": true,
 "size": "default",
 "withPaging": true,
 "pageSize": "20",
 "withNoAggregators": false
 },
 "spec": {}
 }
 },
 "field": {
 "alias": "",
 "desc": "",
 "useExpression": false
 },
 "format": {
 "formatType": "default"
 },
 "from": "metrics"
 }],
 "filters": [{
 "name": "cityName",
 "type": "category",
 "config": {
 "sqlModel": [{
 "name": "cityName",
 "type": "filter",
 "value": ["'巴中市'"],
 "operator": "in",
 "sqlType": "VARCHAR"
 }],
 "filterSource": ["巴中市"]
 }
 }],
 "chartStyles": {
 "label": {
 "showLabel": true,
 "labelPosition": "top",
 "labelFontFamily": "PingFang SC",
 "labelFontSize": "12",
 "labelColor": "#666"
 },
 "visualMap": {
 "showVisualMap": true,
 "visualMapPosition": "leftTop",
 "fontFamily": "PingFang SC",
 "fontSize": "12",
 "visualMapDirection": "horizontal",
 "visualMapWidth": 20,
 "visualMapHeight": 150,
 "startColor": "#509af2",
 "endColor": "#ffa223"
 },
 "legend": {
 "showLegend": true,
 "legendPosition": "right",
 "selectAll": true,
 "fontFamily": "PingFang SC",
 "fontSize": "12",
 "color": "#666"
 },
 "spec": {
 "layerType": "map",
 "mapinfo": "37",
 "roam": true,
 "is3D": true,
 "symbolType": "circle",
 "linesSpeed": "10"
 }
 },
 "selectedChart": 7,
 "pagination": {
 "pageNo": 0,
 "pageSize": 0,
 "withPaging": false,
 "totalCount": 0
 },
 "dimetionAxis": "col",
 "renderType": "clear",
 "orders": [],
 "mode": "chart",
 "model": {
 "provinceName": {
 "sqlType": "VARCHAR",
 "visualType": "geoProvince",
 "modelType": "category"
 },
 "cityName": {
 "sqlType": "VARCHAR",
 "visualType": "geoCity",
 "modelType": "category"
 },
 "countyName": {
 "sqlType": "VARCHAR",
 "visualType": "GeoArea",
 "modelType": "category"
 },
 "count(*)": {
 "sqlType": "BIGINT",
 "visualType": "number",
 "modelType": "value"
 }
 },
 "controls": [{
 "cache": false,
 "operator": "=",
 "expired": 300,
 "width": 0,
 "name": "新建控制器",
 "interactionType": "column",
 "fields": {
 "name": "provinceName",
 "type": "VARCHAR"
 },
 "type": "select",
 "key": "D1D543D2"
 }],
 "computed": [],
 "cache": false,
 "expired": 300,
 "autoLoadData": true
 }
 */
