import React, { memo, useState, useRef, useEffect, useCallback } from "react";
import s from "./index.module.less";
import { Modal } from "antd";
import CloseIcon from "@/components/CloseIcon";

const EnterKeyCode = 13;

const NameModal = (props) => {
    const { title, inputName, defaultName, size, open, placeholder, handleCancel, handleOk } = props;
    const nameRef = useRef();
    const [nameValue, setNameValue] = useState(defaultName);
    const cancel = () => {
        setNameValue("");
        handleCancel();
    }
    useEffect(() => {
        setTimeout(() => {
            nameRef?.current && nameRef.current.focus();
        }, 0)
    }, [nameRef])
    const submit = useCallback(() => {
        handleOk(nameValue);
        setNameValue("")
    }, [handleOk, nameValue]);
    //键盘enter事件
    const onKeyDown = useCallback(
        (e) => {
            if (e.keyCode === EnterKeyCode) {
                e.preventDefault();
                submit();
            }
        },
        [submit]
    );
    //事件绑定
    useEffect(() => {
        nameRef.current.addEventListener("keydown", onKeyDown);
        return function cleanup() {
            let _inputRef = nameRef;
            _inputRef &&
                _inputRef?.current?.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);


    return (
        <Modal className={`userInfoModal`} destroyOnClose={true} open={open} title={title} onCancel={cancel} footer={null} closeIcon={<CloseIcon />}>
            <div className={s.updateNickname}>
                <span className={s.title}>{inputName}</span>
                <div className={s.updateCon}>
                    <input ref={nameRef} className={s.input} value={nameValue} maxLength={size} onChange={(e) => setNameValue(e.target.value)} placeholder={placeholder}></input>
                    <span className={s.count}>{nameValue.length}/{size}</span>
                </div>
                <div className={`circleBtn circleBtn106 ${s.confirm} ${nameValue === "" ? "disable" : null}`} onClick={submit}>确认</div>
            </div>
        </Modal>
    );
};

export default memo(NameModal);
