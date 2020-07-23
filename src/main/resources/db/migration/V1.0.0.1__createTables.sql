/*==============================================================*/
/* DBMS `name`:      MySQL 5.0                                    */
/* Created on:     2020-07-23 15:25:15                          */
/*==============================================================*/


drop table if exists daav_dashboard;

drop table if exists daav_dashboard_portal;

drop table if exists daav_data_source;

drop table if exists daav_display;

drop table if exists daav_display_slide;

drop table if exists daav_download_record;

drop table if exists daav_mem_dashboard_widget;

drop table if exists daav_mem_display_slide_widget;

drop table if exists daav_project;

drop table if exists daav_rel_user_tenant;

drop table if exists daav_tenant;

drop table if exists daav_user;

drop table if exists daav_view;

drop table if exists daav_widget;

/*==============================================================*/
/* Table: daav_dashboard                                        */
/*==============================================================*/
create table daav_dashboard
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   dashboard_portal_id  bigint(0) not null comment '仪表盘入口ID',
   `type`                 smallint(0) not null comment '类型(1,文件夹；2. 仪表盘）',
   `index`                int(0) not null comment '序号',
   parent_id            bigint(0) not null default 0 comment '父节点ID',
   full_parent_id       varchar(100) character set utf8 comment '父节点全路径',
   config               text character set utf8 comment '样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_dashboard_id (dashboard_portal_id),
   key idx_parent_id (parent_id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_dashboard comment '仪表盘';

/*==============================================================*/
/* Table: daav_dashboard_portal                                 */
/*==============================================================*/
create table daav_dashboard_portal
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   project_id           bigint(0) not null comment '项目ID',
   pic                  varchar(255) character set utf8 comment '背景图',
   published            tinyint(1) not null default 0 comment '是否发布',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_project_id (project_id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_dashboard_portal comment '仪表盘入口表';

/*==============================================================*/
/* Table: daav_data_source                                      */
/*==============================================================*/
create table daav_data_source
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   project_id           bigint(0) not null comment '项目ID',
   `type`                 varchar(10) character set utf8 comment '数据源类型（jdbc)',
   config               text character set utf8 comment '数据源设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   foldered             tinyint(1) default null comment '是否文件夹',
   index2               int(2) default null comment '序号',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_data_source comment '数据源';

/*==============================================================*/
/* Table: daav_display                                          */
/*==============================================================*/
create table daav_display
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   project_id           bigint(0) not null comment '项目ID',
   published            tinyint(1) not null default 0 comment '是否发布',
   config               text character set utf8 comment '样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_display comment '数据大屏';

/*==============================================================*/
/* Table: daav_display_slide                                    */
/*==============================================================*/
create table daav_display_slide
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   display_id           bigint(0) not null comment '大屏ID',
   `index`                int(0) not null comment '序号',
   config               text character set utf8 comment '样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   key idx_display_id (display_id),
   key ak_kid (id),
   key ak_kid2 (id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_display_slide comment '大屏幻灯片';

/*==============================================================*/
/* Table: daav_download_record                                  */
/*==============================================================*/
create table daav_download_record
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   user_id              bigint(0) not null comment '用户ID',
   `path`                 varchar(255) comment '路径',
   status               smallint(0) not null comment '状态',
   last_download_time   datetime comment '最后下载日期',
   primary key (id),
   key idx_user (user_id)
)
engine = innodb auto_increment = 1 character set = utf8mb4 collate = utf8mb4_0900_ai_ci row_format = dynamic;

alter table daav_download_record comment '下载记录';

/*==============================================================*/
/* Table: daav_mem_dashboard_widget                             */
/*==============================================================*/
create table daav_mem_dashboard_widget
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   alias                varchar(30) character set utf8 comment '别名',
   dashboard_id         bigint(0) not null comment '仪表盘ID',
   widget_id            bigint(0) default null comment '微件ID',
   x                    int(0) not null comment 'x坐标',
   y                    int(0) not null comment 'y坐标',
   width                int(0) not null comment '宽度',
   height               int(0) not null comment '高度',
   polling              tinyint(1) not null default 0 comment '播放方式',
   frequency            int(0) default null comment '频率',
   parent_id            bigint(0) not null default 0 comment '父节点ID',
   full_parent_id       varchar(100) character set utf8 comment '父节点全路径',
   config               text character set utf8 comment '样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_protal_id (dashboard_id),
   key idx_widget_id (widget_id)
)
engine = innodb auto_increment = 3 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_mem_dashboard_widget comment '仪表盘微件记录表';

/*==============================================================*/
/* Table: daav_mem_display_slide_widget                         */
/*==============================================================*/
create table daav_mem_display_slide_widget
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   display_slide_id     bigint(0) not null comment '大屏幻灯片ID',
   widget_id            bigint(0) default null comment '微件ID',
   config               text character set utf8 comment '用户样式设置(json)',
   `type`                 smallint(0) not null comment '类型',
   sub_type             smallint(0) default null comment '子类型',
   `index`                int(0) not null default 0 comment '`index`',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_slide_id (display_slide_id),
   key idx_widget_id (widget_id)
)
engine = innodb auto_increment = 4 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_mem_display_slide_widget comment '大屏微件关联记录表';

/*==============================================================*/
/* Table: daav_project                                          */
/*==============================================================*/
create table daav_project
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   pic                  varchar(255) character set utf8 comment '项目图片',
   org_id               bigint(0) not null comment '组织ID',
   user_id              bigint(0) not null comment '租户ID',
   visibility           tinyint(1) default 1 comment '可见性',
   star_num             int(0) default 0 comment '评分',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_org_id (org_id),
   key idx_user_id (user_id),
   key idx_visibility (visibility)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_project comment 'project';

/*==============================================================*/
/* Table: daav_rel_user_tenant                                  */
/*==============================================================*/
create table daav_rel_user_tenant
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   tenant_id            bigint(0) not null comment '租户ID',
   user_id              bigint(0) not null comment '用户ID',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   primary key (id),
   unique key idx_org_user (tenant_id, user_id)
)
engine = innodb auto_increment = 2 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_rel_user_tenant comment '用户组织关联表';

/*==============================================================*/
/* Table: daav_tenant                                           */
/*==============================================================*/
create table daav_tenant
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   pic                  varchar(255) character set utf8 comment '背景图',
   user_id              bigint(0) not null comment '用户ID',
   project_num          int(0) default 0 comment '项目数',
   member_num           int(0) default 0 comment '成员数',
   allow_create_project tinyint(1) default 1 comment '是否允许创建项目',
   member_permission    smallint(0) not null default 0 comment '用户权限',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_allow_create_project (allow_create_project),
   key idx_member_permisson (member_permission)
)
auto_increment = 1;

alter table daav_tenant comment '租户信息';

/*==============================================================*/
/* Table: daav_user                                             */
/*==============================================================*/
create table daav_user
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   email                varchar(255) character set utf8 comment '邮箱',
   telephone            varchar(11) character set utf8 comment '手机号码',
   wx_open_id           varchar(255) character set utf8 comment '微信OpenId',
   user_name            varchar(255) character set utf8 comment '用户名',
   password             varchar(255) character set utf8 comment '密码',
   `admin`                tinyint(1) not null comment '是否admin',
   active               tinyint(1) default null comment '是否激活',
   `name`                 varchar(255) character set utf8 comment '姓名',
   remark               varchar(255) character set utf8 comment '备注',
   department           varchar(255) character set utf8 comment '部门名称',
   avatar               varchar(255) character set utf8 comment '头像',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id)
)
engine = innodb auto_increment = 4 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_user comment '注册用户';

/*==============================================================*/
/* Table: daav_view                                             */
/*==============================================================*/
create table daav_view
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   project_id           bigint(0) not null comment '项目ID',
   source_id            bigint(0) not null comment '数据源ID',
   `sql`                text character set utf8 comment 'sql语句',
   model                text character set utf8 comment '数据模型(json数据）',
   `variable`             text character set utf8 comment '参数（json)',
   parent_id            bigint(0) not null default 0 comment '父节点ID',
   full_parent_id       varchar(100) character set utf8 comment '父节点全路径',
   config               text character set utf8 comment '样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   foldered             tinyint(1) default null comment '是否文件夹',
   `index`                int(2) default null comment '序号',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id)
)
engine = innodb auto_increment = 3 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_view comment 'Sql视图';

/*==============================================================*/
/* Table: daav_widget                                           */
/*==============================================================*/
create table daav_widget
(
   id                   bigint(0) not null auto_increment comment '主键ID',
   `name`                 varchar(255) character set utf8 comment '名称',
   description          varchar(255) character set utf8 comment '备注',
   view_id              bigint(0) not null comment 'sql视图ID',
   project_id           bigint(0) not null comment '项目ID',
   widget_type          bigint(1) not null comment '类别',
   published            tinyint(1) not null comment '是否发布',
   parent_id            bigint(0) not null default 0 comment '父节点ID',
   full_parent_id       varchar(100) character set utf8 comment '父节点全路径',
   config               text character set utf8 comment '系统样式设置(json数据）',
   create_by            bigint(0) default null comment '创建人ID',
   create_time          datetime comment '创建时间',
   update_by            bigint(0) default null comment '更新人ID',
   update_time          datetime comment '更新时间',
   foldered             tinyint(1) default null comment '是否文件夹',
   `index`                int(2) default null comment '序号',
   deleted              int(1) default 0 comment '注销标识',
   primary key (id),
   key idx_project_id (project_id),
   key idx_view_id (view_id)
)
engine = innodb auto_increment = 4 character set = utf8 collate = utf8_general_ci row_format = dynamic;

alter table daav_widget comment '微件';

