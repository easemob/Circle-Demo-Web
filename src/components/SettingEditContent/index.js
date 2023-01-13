import s from "./index.module.less";
import React, { memo, useRef, useState } from "react";
import SettingBtnGroup from "@/components/SettingBtnGroup"

const SettingEditContent = (props) => {
    const { placeholder, maxLength, rows, onCancel, onSave } = props;
    const editInput = useRef()
    const [inputCount, setInputCount] = useState(0);
    const count = () => {
        setInputCount(editInput.current.value.length);
    }
    return (
        <div className={s.editItem}>
            <div className={s.inputWrap}>
                <textarea ref={editInput} rows={rows} className={s.wrap} placeholder={placeholder} maxLength={maxLength} onChange={count} />
                <span className={s.inputCount}>{inputCount}/{maxLength}</span>
            </div>
            <div className={s.buttonLayout}>
                <SettingBtnGroup onSave={() => onSave(editInput.current.value)} onCancel={onCancel} />
            </div>
        </div>
    );
};

export default memo(SettingEditContent);
