import s from "./index.module.less";
import React, { memo, useRef, useState, useEffect } from "react";
import SettingBtnGroup from "@/components/SettingBtnGroup"

const SettingEditContent = (props) => {
    const { defaultValue="", placeholder, maxLength, rows, onCancel, onSave } = props;
    const editInput = useRef()
    const [inputCount, setInputCount] = useState(0);
    const [value, setValue] = useState("")
    const count = () => {
        setValue(editInput.current.value)
        setInputCount(editInput.current.value.length);
    }
    useEffect(() => {
        setTimeout(() => {
            editInput && editInput.current.focus();
            setValue(defaultValue)
        }, 0)
    }, [])
    return (
        <div className={s.editItem}>
            <div className={s.inputWrap}>
                <textarea value={value} ref={editInput} rows={rows} className={s.wrap} placeholder={placeholder} maxLength={maxLength} onChange={count} />
                <span className={s.inputCount}>{inputCount}/{maxLength}</span>
            </div>
            <div className={s.buttonLayout}>
                <SettingBtnGroup onSave={() => onSave(editInput.current.value)} onCancel={onCancel} />
            </div>
        </div>
    );
};

export default memo(SettingEditContent);
