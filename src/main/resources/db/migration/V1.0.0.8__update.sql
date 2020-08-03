
alter table daav_data_source change column `foldered` `is_folder` tinyint(1) comment '是否目录';
alter table daav_data_source change column `index2` `index` int comment '序号';
