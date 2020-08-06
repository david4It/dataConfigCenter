
alter table daav_widget change column `foldered` `is_folder` tinyint(1)  DEFAULT NULL  comment '是否目录';
alter table daav_widget change column `widget_type` `type` bigint(0)  DEFAULT 1  comment '类型';
alter table daav_widget change column `published` `publish` tinyint(1) comment '是否发布';
