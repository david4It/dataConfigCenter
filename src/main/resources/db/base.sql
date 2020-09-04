SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
-- ----------------------------
-- Table structure for component
-- ----------------------------
DROP TABLE IF EXISTS `component`;
CREATE TABLE `component`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `layout_id` int(11) NOT NULL COMMENT '布局表的主键id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '组件类型：line,bar,pie',
  `query` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '数据查询语句',
  `link` int(11) NULL DEFAULT NULL COMMENT '下钻对应的布局表主键id',
  `params` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '下钻传递的参数',
  `category_value_pattern` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图表键值所对应的字段，使用:进行分割，如key_field:value_field\r\n雷达存在多维度，故值的形式为:key_field:value_field1,value_field2,value_field3...',
  `width` int(10) NOT NULL COMMENT '宽度（比例）',
  `height` int(10) NOT NULL COMMENT '高度偏移量',
  `x` int(11) NOT NULL COMMENT 'x轴偏移（比例）',
  `y` int(11) NULL DEFAULT NULL COMMENT 'y轴偏移量',
  `location_index` int(10) NOT NULL COMMENT '位置索引：从左到右，从上到下，起始为0',
  `config_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '组件定制化配置（json数据格式）',
  `create_time` datetime(0) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;


-- ----------------------------
-- Table structure for layout
-- ----------------------------
DROP TABLE IF EXISTS `layout`;
CREATE TABLE `layout`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `template_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '模板名称',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '页面路径',
  `file` longblob NULL COMMENT '页面文件',
  `enabled` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '是否启用（Y：启用，N：禁用）',
  `root` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '是否为根节点页面（Y：是，N：否）',
  `create_time` datetime(0) NOT NULL COMMENT '创建日期',
  `last_update_time` datetime(0) NULL DEFAULT NULL COMMENT '更新日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;