
alter table daav_data_source add column `parent_id` int comment '父节点ID';
alter table daav_data_source add column `full_parent_id` int comment '节点路径';
