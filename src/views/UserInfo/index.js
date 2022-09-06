import React, { memo, useEffect, useState, createRef } from "react";
import { connect } from "react-redux";
import s from "./index.module.less";
import { Modal, message } from 'antd';
import WebIM from "@/utils/WebIM";
import Icon from "@/components/Icon";
import CloseIcon from "@/components/CloseIcon";

const UserInfo = (props) => {
    const { userInfo, setUserInfo, appUserInfo, setAppUserInfo } = props
    const nicknameRef = createRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const showModal = () => {
        setIsModalVisible(true);
        setNameValue(userInfo?.nickname || '');
    };

    useEffect(() => {
        setTimeout(() => {
            isModalVisible && nicknameRef?.current && nicknameRef.current.focus();
        },0)
    }, [isModalVisible, nicknameRef])
    useEffect(() => {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }, [userInfo])

    const handleOk = () => {
        if (nameValue === "") return;
        WebIM.conn.updateUserInfo({ nickname: nameValue }).then(res => {
            setUserInfo(Object.assign({ ...userInfo }, res.data));
            setAppUserInfo({ ...appUserInfo, [userInfo.username]: { ...appUserInfo[userInfo.username], ...res.data } });
        }).catch(e => {
            message.warn({ content: "昵称修改失败，请重试！" });
        })
        setNameValue("");
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [nameValue, setNameValue] = useState('');
    const changeNickname = (e) => {
        setNameValue(e.target.value);
    }
    
    return (
        <div className={s.container}>
            <div className={s.header}>
                <span className={s.icon}>
                    <Icon name="person_normal" size="24px" />
                </span>
                <span className={s.text}>个人资料</span>
            </div>
            <div className={s.main}>
                <div className={s.item}>
                    <div className={s.info}>
                        <span className={s.nameLeft}>我的昵称</span>
                        <span className={s.nickname}>{userInfo.nickname || userInfo.username}</span>
                    </div>
                    <div className={s.edit} onClick={showModal}>编辑</div>
                </div>
            </div>

            <Modal className={`userInfoModal`} destroyOnClose={true} title="更改昵称" visible={isModalVisible} onCancel={handleCancel} footer={null} closeIcon={<CloseIcon />}>
                <div className={s.updateNickname}>
                    <span className={s.title}>昵称</span>
                    <div className={s.updateCon}>
                        <input ref={nicknameRef} className={s.input} value={nameValue} maxLength={16} onChange={(e) => changeNickname(e)} placeholder="请输入昵称"></input>
                        <span className={s.count}>{nameValue.length}/16</span>

                    </div>
                    <div className={`circleBtn circleBtn106 ${s.confirm} ${nameValue === "" ? "disable" : null}`} onClick={handleOk}>确认</div>
                </div>
            </Modal>
        </div>
    );
};
const mapStateToProps = ({ app }) => {
    return {
        userInfo: app.userInfo,
        appUserInfo: app.appUserInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (params) => {
            return dispatch({
                type: "app/setUserInfo",
                payload: params
            });
        },
        setAppUserInfo: (params) => {
            return dispatch({
                type: "app/setAppUserInfo",
                payload: params
            });
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(UserInfo));
