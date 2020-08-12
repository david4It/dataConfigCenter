
alter table daav_display change column `published` `publish` tinyint(1) comment '是否发布';
alter table daav_display add column `avatar` varchar(255) comment '图标';
