import s from "./index.module.less";
import React, { memo, useState } from "react";
import Icon from "@/components/Icon";

const SearchMenu = (props) => {
    const { onClick } = props;
    const [typeList, setTypeList] = useState([
        { type: "serverName", text: "社区名称" },
        { type: "tagName", text: "社区标签" }
    ])
    const [openMenu, setOpenMenu] = useState(false);
    const handleClick = (index, type) => {
        if (index === 0) return;
        onClick(type.type);
        setOpenMenu(false)
        setTypeList([typeList[1], typeList[0]]);
    }
    return (
        <div className={`${s.searchMenu} ${openMenu ? s.openMenu : null}`} onClick={() => { setOpenMenu(!openMenu) }}>
            {typeList.map((item, index) => {
                return (
                    <div key={item.type} onClick={() => handleClick(index, item)} className={`${s.typeItem} ${index === 0 ? s.firstItem : s.secondItem}`} >
                        <span className={s.typeName}>{item.text}</span>
                        {index === 0 && !openMenu && <Icon name="shevron_down" size="14px" color="rgba(255,255,255,.74)" style={{ cursor: "pointer" }} />}
                        {index === 0 && openMenu && <Icon name="shevron_down" size="14px" color="rgba(255,255,255,.74)" style={{ cursor: "pointer" }} />}
                    </div>
                )
            })}
        </div>
    );
};

export default memo(SearchMenu);
