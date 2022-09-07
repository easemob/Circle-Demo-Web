import React, { memo, useState, useRef, useEffect } from "react";
import s from "./index.module.less";
import Icon from "@/components/Icon";
import { connect } from "react-redux";

const ThreadName = (props) => {
    const { isCreatingThread, currentThreadInfo, setName } = props;
    const nameEle = useRef();
    const [inputVal, setInputVal] = useState(isCreatingThread ? "" : currentThreadInfo?.name);
    useEffect(() => {
        isCreatingThread && inputVal === "" && nameEle.current && nameEle.current.focus();
    }, [inputVal, isCreatingThread])
    useEffect(() => {
        setInputVal(currentThreadInfo?.name || "");
    }, [currentThreadInfo])
    return (
        <div className={s.layout}>
            {isCreatingThread ? <div className={s.inputCon}>
                <div className={s.t}>
                    <input ref={nameEle} maxLength="64" className={s.input} placeholder="子区名（必填项）" value={inputVal} onChange={(e) => { setInputVal(e.target.value); setName(e.target.value) }} />
                    {inputVal.length !== 0 && <span className={s.del} onClick={() => { setInputVal(""); setName("") }}>
                        <Icon name="xmark_in_circle" size="20px" color="#666" />
                    </span>}
                </div>
                <div className={`${s.b} ${inputVal !== "" ? s.light : ""}`}>发送一条消息创建子区</div>
            </div> : <div className={s.nameCon}>
                <span className={s.icon1}><Icon name="hashtag_message" size="26px" color="#fff" /></span>
                <span className={s.name}>{currentThreadInfo?.name}</span>
            </div>}
        </div>
    );
};
const mapStateToProps = ({ channel, thread }) => {
    return {
        currentThreadInfo: thread.currentThreadInfo,
        isCreatingThread: thread.isCreatingThread
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleThreadPanel: (params) => {
            return dispatch({
                type: "thread/setThreadPanelStatus",
                payload: params
            })
        }
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ThreadName));
