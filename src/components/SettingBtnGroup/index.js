import s from "./index.module.less";
import React, { memo } from "react";

const SettingBtnGroup = (props) => {
    const { onSave, onCancel } = props;
    return (
        <div className={s.buttonCon}>
            <span className={`${s.btn} circleBtnGray`} onClick={onCancel}>取消</span>
            <span className={`${s.btn} circleBtn`} onClick={onSave}>保存</span>
        </div>
    );
};

export default memo(SettingBtnGroup);
