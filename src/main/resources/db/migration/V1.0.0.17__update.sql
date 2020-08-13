
alter table daav_display add column `url` varchar(255) comment '页面路径(新增）';
alter table daav_display add column `file` longblob comment '页面文件（新增）';

alter table daav_widget add column `link` int(0) NULL DEFAULT NULL COMMENT '下钻对应的布局表主键id';
alter table daav_widget add column  `params` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '下钻传递的参数';
alter table daav_widget add column `width` int(0) NULL COMMENT '宽度（比例）';
alter table daav_widget add column  `height` int(0) NULL COMMENT '高度偏移量';
alter table daav_widget add column  `x` int(0) NULL COMMENT 'x轴偏移（比例）';
alter table daav_widget add column  `y` int(0) NULL DEFAULT NULL COMMENT 'y轴偏移量';
alter table daav_widget add column `location_index` int(0) NULL COMMENT '位置索引：从左到右，从上到下，起始为0';
