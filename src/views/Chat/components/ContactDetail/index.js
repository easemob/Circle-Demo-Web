import React, { memo } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import { connect } from "react-redux";
import { Modal, Dropdown, Menu } from 'antd';
import { useNavigate } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import Icon from "@/components/Icon";


const ContactDetail = (props) => {
    const { visible, userId, appUserInfo, contactsList, hasSentApply, handleCancel, setHasSentApply } = props;
    const navigate = useNavigate();
    const renderButton = () => {
        if (hasSentApply.indexOf(userId) > -1) {
            return (
                <div className={`circleBtn152 circleBtnGray disable`}>好友请求待确认</div>
            )
        } else if (contactsList.indexOf(userId) < 0) {
            return (
                <div className={`circleBtn106 circleBtnGray }`} onClick={addContact}>加为好友</div>
            )
        }
    }
    //私聊
    const toChat = () => {
        handleCancel();
        navigate(`/main/contacts/chat/${userId}`);
    };
    //加为好友
    const addContact = () => {
        WebIM.conn.addContact(userId);
        setHasSentApply([...hasSentApply, userId]);
    }

    const menu = (uid, onDelete) => {
        return (
            <Menu
                onClick={() => { onDelete(uid) }}
                items={[
                    {
                        key: '1',
                        label: (
                            <div className="circleDropItem">
                                <Icon name="trash" size="22px" iconClass="circleDropMenuIcon" />
                                <span className="circleDropMenuOp">删除好友</span>
                            </div>
                        ),
                    },
                ]}
            />
        )
    }
    //删除联系人
    const deleteContact = (uid) => {
        WebIM.conn.deleteContact(uid);
    }
    return (
        <Modal
            visible={visible}
            width="545px"
            wrapClassName={s.detailWrap}
            footer={null}
            onCancel={handleCancel}
        >
            <div className={s.bg}>
                {contactsList.indexOf(userId) > -1 && <Dropdown overlay={menu(userId, deleteContact)} placement="bottomRight" trigger={['click']} overlayClassName="circleDropDown">
                    <div className={s.contactOp}>
                        <Icon size="26px" name="ellipsis" color="#fff" />
                    </div>
                </Dropdown>}
            </div>
            <div className={s.infoCon}>
                <div className={s.userInfo}>
                    <div className={s.avatar}>
                        <AvatarInfo size={90} src={appUserInfo[userId]?.avatarurl} online={appUserInfo[userId]?.online} />
                    </div>
                    <div className={s.nickname}>{appUserInfo[userId]?.nickname || userId}</div>
                    <div className={s.idInfo}>环信ID：{userId}</div>
                </div>
                <div className={s.buttonCon}>
                    {renderButton()}
                    <div className={`circleBtn106 circleBtn ${s.private}`} onClick={toChat}>私聊ta</div>
                </div>
            </div>
        </Modal>
    );
};
const mapStateToProps = ({ app, contact }) => {
    return {
        appUserInfo: app.appUserInfo,
        contactsList: contact.contactsList,
        hasSentApply: contact.hasSentApply
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setHasSentApply: (params) => {
            return dispatch({
                type: "contact/setHasSentApply",
                payload: params
            });
        }
    };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(ContactDetail));