package com.scsme.dataConfigCenter.pojo;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@TableName("component")
public class Component {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long layoutId;
    private String type;
    private String title;
    private String query;
    private Long link;
    private String params;
    private String categoryValuePattern;
    private Integer locationIndex;
    private Integer x;
    private Integer y;
    private Integer width;
    private Integer height;
    private String configJson;
    @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss")
    @JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createTime;
}
