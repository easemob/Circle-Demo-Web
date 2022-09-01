import style from "./index.module.less";
import React, { memo } from "react";

const BasicInfo = (props) => {
    const { online, name, showOnline } = props
    return (
        <div className={style.info}>
            <span className={`${style.defaultStyle} ${showOnline ? style.name : style.all}`}>{name}</span>
            {showOnline && <span className={`${style.online} ${online ? null : style.offline}`}>{online ? '在线' : '离线'}</span>}
        </div>
    );
};

export default memo(BasicInfo);
