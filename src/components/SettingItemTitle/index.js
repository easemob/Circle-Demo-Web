import s from "./index.module.less";
import React, { memo } from "react";

const SettingItemTitle = (props) => {
    const { title } = props;
    return (
        <div className={s.main}>{title}</div>
    );
};

export default memo(SettingItemTitle);
