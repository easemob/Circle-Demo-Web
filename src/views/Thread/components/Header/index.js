import React, { memo, useState, useEffect, createRef } from "react";
import s from "./index.module.less";
import Icon from "@/components/Icon";
import { Dropdown, Popover, Modal, message } from 'antd';
import { getOperationEl } from "../../utils"
import ThreadMember from "../ThreadMember";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import { USER_ROLE } from "@/consts"
import { getThreadParentMsg, deleteLocalThread } from "@/utils/common"
import CloseIcon from "@/components/CloseIcon";


const ThreadHeader = (props) => {
    let navigate = useNavigate();
    const { isCreatingThread, currentThreadInfo, handleThreadPanel, serverRole, setThreadInfo, channelInfo, setChannelInfo } = props;
    const { serverId, channelId, threadId } = useParams();
    const role = serverRole[serverId];
    const menu = (role) => {
        let opList = [];
        switch (role) {
            case USER_ROLE.owner:
                opList = ["threadMember", "editThread", "leaveThread", "destroyThread"];
                break;
            case USER_ROLE.moderator:
                //第一期没有channel的权限，thread删除需要判断parentId的权限，和当前服务不是一套，无法处理，暂不能编辑、删除thread
                //等二期channel有权限后，管理员可以编辑、删除thread
                // opList = ["threadMember", "editThread", "leaveThread", "destroyThread"];
                opList = ["threadMember", "leaveThread"];
                break;
            case USER_ROLE.user:
                opList = ["threadMember", "leaveThread"];
                break;
            default:
                break;
        }
        //thread owner可以编辑thread
        if (currentThreadInfo?.owner === WebIM.conn.user && role !== USER_ROLE.owner) {
            opList = ["threadMember", "editThread", "leaveThread"];
        }
        return getOperationEl(opList, handleOperation)
    }
    const handleOperation = ({ key }) => {
        switch (key) {
            case "threadMember":
                handleVisibleChange(true)
                break;
            case "editThread":
                showModal("editThread");
                break;
            case "leaveThread":
                showModal("leaveThread");
                break;
            case "destroyThread":
                showModal("destroyThread");
                break;
            default:
                break;
        }
    }
    //子区成员列表
    const [visible, setVisible] = useState(false);
    const hide = () => {
        setVisible(false);
    };
    const handleVisibleChange = (data) => {
        setVisible(data);
    };
    //修改子区名称
    const [isModalVisible, setIsModalVisible] = useState("");
    const showModal = (op) => {
        setIsModalVisible(op);
        if (op === "editThread") {
            setNameValue(currentThreadInfo.name);
        }
    };

    const handleOk = () => {
        switch (isModalVisible) {
            case "editThread":
                if (nameValue === "") return;
                WebIM.conn.changeChatThreadName({ chatThreadId: currentThreadInfo.id, name: nameValue }).then(res => {
                    setNameValue("");
                }).catch(e => {
                    message.warn({ content: "名称编辑失败，请重试！" });
                })
                break;
            case "leaveThread":
                WebIM.conn.leaveChatThread({ chatThreadId: currentThreadInfo.id }).then(() => {
                    setThreadInfo({});
                    handleThreadPanel(false);
                    if (threadId) {
                        navigate(`/main/channel/${serverId}/${channelId}`);
                    }
                }).catch(e => {
                    message.warn({ content: "离开子区失败，请重试！" });
                })
                break;
            case "destroyThread":
                WebIM.conn.destroyChatThread({ chatThreadId: currentThreadInfo.id }).then(() => {
                    deleteLocalThread(channelId, currentThreadInfo.id).then(() => {
                        setThreadInfo({});
                        handleThreadPanel(false);
                        if (threadId) {
                            navigate(`/main/channel/${serverId}/${channelId}`);
                        }
                    })
                }).catch(e => {
                    message.warn({ content: "删除子区失败，请重试！" });
                })
                break;
            default:
                break;
        }
        setIsModalVisible("");
    };

    const handleCancel = () => {
        setIsModalVisible("");
    };
    const [nameValue, setNameValue] = useState('');
    const changeNickname = (e) => {
        setNameValue(e.target.value);
    }

    const getChannelInfo = ({ serverId, channelId }) => {
        WebIM.conn.getChannelDetail({ serverId, channelId }).then((res) => {
            setChannelInfo(res.data);
        });
    };
    useEffect(() => {
        getChannelInfo({
            serverId,
            channelId
        });
    }, [channelId, serverId]);

    //thread信息
    const getThreadInfo = (chatThreadId) => {
        //get currentThreadInfo
        WebIM.conn.getChatThreadDetail({ chatThreadId }).then((res) => {
            //从thread列表点击，需要查询本地消息
            let findMsg = getThreadParentMsg(res.data.parentId, res.data.messageId)
            let parentMessage = findMsg ? { ...findMsg, chatThreadOverview: {} } : {};
            setThreadInfo({ ...res.data, parentMessage });
        });
    }
    useEffect(() => {
        threadId && getThreadInfo(threadId);
    }, []);

    //跳转到channel
    const goToChannel = () => {
        navigate(`/main/channel/${serverId}/${channelId}`);
        const tempInfo = { ...currentThreadInfo }
        setTimeout(() => {
            setThreadInfo(tempInfo)
            handleThreadPanel(true);
        }, 500);
    }
    const nameRef = createRef();
    useEffect(() => {
        if (isModalVisible && isModalVisible === "editThread") {
            setTimeout(() => {
                nameRef && nameRef.current.focus();
            }, 500)
        }
    }, [isModalVisible])
    return (
        <div className={s.layout}>
            {isCreatingThread ? <div className={s.createCon}>创建子区</div> : <div className={s.threadBar}>
                <div className={s.nameCon}>
                    {threadId && <div className={s.channelInfo} onClick={goToChannel}>
                        <span className={s.iconCon}>
                            <Icon name={channelInfo?.isPublic ? "hashtag" : "hashtag_lock"} size="26px" color="rgba(255, 255, 255, 0.74)" />
                        </span>
                        <span className={s.name}>{channelInfo?.name}</span>
                        <hr className={s.line} />
                    </div>}
                    <div className={s.threadInfo}>
                        <span className={s.iconCon}>
                            <Icon name="hashtag_message" size="26px" color={threadId ? "#fff" : "rgba(255, 255, 255, 0.74)"} />
                        </span>
                        <span className={s.name}>{currentThreadInfo?.name}</span>
                    </div>

                </div>
                <Dropdown overlay={menu(role)} placement="bottomLeft" trigger={['click']} overlayClassName="circleDropDown">
                    <div className={s.editIcon}>
                        <Icon name="ellipsis" size="22px" color="rgba(255, 255, 255, 0.74)" />
                    </div>
                </Dropdown>

            </div>}
            {!threadId && <span className={s.close} onClick={() => { handleThreadPanel(false); setThreadInfo({}) }}>
                <Icon name="xmark" size="18px" color="rgba(255, 255, 255, 0.74)"></Icon>
            </span>}
            <div className={s.membersCon}>
                <Popover content={<ThreadMember close={hide} visible={visible} />} placement="bottomRight" trigger="click" visible={visible} onVisibleChange={handleVisibleChange} overlayClassName={s.threadMember}>
                </Popover>
            </div>
            <Modal className={`userInfoModal`} destroyOnClose={true} title="编辑子区" visible={isModalVisible === "editThread"} onCancel={handleCancel} footer={null} closeIcon={<CloseIcon />}>
                <div className={s.updateNickname}>
                    <span className={s.title}>子区名称</span>
                    <div className={s.updateCon}>
                        <input ref={nameRef} className={s.input} value={nameValue} maxLength={64} onChange={(e) => changeNickname(e)} placeholder={currentThreadInfo?.name}></input>
                        <span className={s.count}>{nameValue.length}/64</span>

                    </div>
                    <div className={`circleBtn circleBtn106 ${s.confirm} ${nameValue === "" ? "disable" : null}`} onClick={handleOk}>确认</div>
                </div>
            </Modal>
            <Modal className={`logoutModal`} title={isModalVisible === "leaveThread" ? "退出子区" : "删除子区"} width={546} destroyOnClose={true} visible={isModalVisible === "leaveThread" || isModalVisible === "destroyThread"} onCancel={handleCancel} footer={null} closeIcon={<CloseIcon />}>
                <div className={s.logoutCon}>
                    {isModalVisible === "leaveThread" ? <span className={s.content}>确认退出子区<span className={s.name}>&nbsp;{currentThreadInfo?.name}</span></span> : <span className={s.content}>确认删除子区&nbsp;<span className={s.name}>{currentThreadInfo?.name}？</span>本操作不可恢复。</span>}

                    <div className={s.buttons}>
                        <div className={`circleBtn106 circleBtnGray`} onClick={handleCancel}>取消</div>
                        <div className={`circleBtn106 circleBtn ${s.confirm}`} onClick={handleOk}>确认</div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
const mapStateToProps = ({ app, thread }) => {
    return {
        serverRole: app.serverRole,
        channelInfo: app.currentChannelInfo,
        currentThreadInfo: thread.currentThreadInfo,
        isCreatingThread: thread.isCreatingThread,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleThreadPanel: (params) => {
            return dispatch({
                type: "thread/setThreadPanelStatus",
                payload: params
            })
        },
        setThreadInfo: (params) => {
            return dispatch({
                type: "thread/setThreadInfo",
                payload: params
            })
        },
        setChannelInfo: (params) => {
            return dispatch({
                type: "app/setCurrentChannelInfo",
                payload: params
            })
        }
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ThreadHeader));
