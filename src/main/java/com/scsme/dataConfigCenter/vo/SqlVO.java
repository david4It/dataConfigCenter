package com.scsme.dataConfigCenter.vo;

import lombok.Data;

@Data
public class SqlVO {
    private String sql;
    private String[] params;
}
