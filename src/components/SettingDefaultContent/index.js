import s from "./index.module.less";
import React, { memo } from "react";

const SettingDefaultContent = (props) => {
    const { contentIsEmpty = false, content, onEdit, } = props;
    return (
        <div className={s.main}>
            <div className={`${s.item} ${contentIsEmpty ? s.empty : null} `}>{content}</div>
            <span className={s.operation} onClick={() => onEdit(true)}>编辑</span>
        </div>
    );
};

export default memo(SettingDefaultContent);
