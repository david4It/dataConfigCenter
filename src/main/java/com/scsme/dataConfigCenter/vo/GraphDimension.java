package com.scsme.dataConfigCenter.vo;

import lombok.Data;

import java.io.Serializable;
@Data
public class GraphDimension  implements Serializable {
    private String name;
    private String visualType;
    private String type;
}
