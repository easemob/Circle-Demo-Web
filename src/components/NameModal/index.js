import React, { memo, useState, createRef, useEffect } from "react";
import s from "./index.module.less";
import { Modal } from "antd";
import CloseIcon from "@/components/CloseIcon";

const NameModal = ({ title, inputName, size, open, placeholder, handleCancel, handleOk }) => {
    const nameRef = createRef();
    const [nameValue, setNameValue] = useState("");
    const cancel = () => {
        setNameValue("");
        handleCancel();
    }
    useEffect(()=>{
        setTimeout(()=>{
            nameRef?.current && nameRef.current.focus();
        },0)
    },[nameRef])

    return (
        <Modal className={`userInfoModal`} destroyOnClose={true} open={open} title={title} onCancel={cancel} footer={null} closeIcon={<CloseIcon />}>
            <div className={s.updateNickname}>
                <span className={s.title}>{inputName}</span>
                <div className={s.updateCon}>
                    <input ref={nameRef} className={s.input} value={nameValue} maxLength={size} onChange={(e) => setNameValue(e.target.value)} placeholder={placeholder}></input>
                    <span className={s.count}>{nameValue.length}/{size}</span>
                </div>
                <div className={`circleBtn circleBtn106 ${s.confirm} ${nameValue === "" ? "disable" : null}`} onClick={() => {handleOk(nameValue);setNameValue("")}}>确认</div>
            </div>
        </Modal>
    );
};

export default memo(NameModal);
