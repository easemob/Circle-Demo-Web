import React, { memo, useState, useEffect } from "react";
import s from "./index.module.less";
import Icon from "@/components/Icon";
import { connect } from "react-redux";
import { getTimeDiff, renderTxt } from "@/utils/common";
import { useParams } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import AvatarInfo from "@/components/AvatarInfo";
import InfiniteScroll from "react-infinite-scroll-component";
import CloseIcon from "@/components/CloseIcon";

const SCROLL_WARP_ID = "threadListScrollId";
const LIMIT = 20;
const ThreadList = (props) => {
    const { serverRole, appUserInfo, onHandleOperation, onClose, visibleThread } = props;
    const { serverId, channelId } = useParams();
    const role = serverRole[serverId];
    const [threadList, setThreadList] = useState([])
    //滚动加载
    useEffect(() => {
        if (visibleThread) {
            getThreadsList(role);
        } else {
            setThreadListCursor("")
        }
    }, [role, visibleThread])
    const [hasMore, setHasMore] = useState(true);
    const [threadListCursor, setThreadListCursor] = useState(null);
    const loadMoreData = () => {
        getThreadsList(role, threadListCursor)
    }
    const getThreadsList = (role, cursor = "") => {
        const fetchFn = role !== "user" ? "getChatThreads" : "getJoinedChatThreads";
        let paramsData = {
            parentId: channelId,
            pageSize: LIMIT,
            cursor,
        }
        WebIM.conn[fetchFn](paramsData).then((res) => {
            const list = res.entities;
            if (list.length === 0) {
                if (!paramsData.isScroll) {
                    setThreadList(list)
                }
                return
            }
            if (LIMIT === list.length) {
                setHasMore(true);
            } else {
                setHasMore(false)
            }
            setThreadListCursor(res.properties.cursor);
            const chatThreadIds = list.map((item) => item.id);
            WebIM.conn.getChatThreadLastMessage({ chatThreadIds }).then((res) => {
                const msgList = res.entities;
                list.forEach((item) => {
                    let found = msgList.find(msgInfo => item.id === msgInfo.chatThreadId);
                    item.lastMessage = found && found.lastMessage ? found.lastMessage : {}
                })
                threadListCursor === "" ? setThreadList(list) : setThreadList([...threadList, ...list]);
            }).catch(() => {
                threadListCursor === "" ? setThreadList(list) : setThreadList([...threadList, ...list]);
            })
        })
    }
    const openThreadPanel = (option) => {
        onHandleOperation("openThreadPanel", true, option, "threadList");
        onClose();
    }

    const renderMessage = (message) => {
        switch (message.type) {
            case 'txt':
                return message.msg
            case 'file':
                return `文件`
            case 'img':
                return `图片`
            default:
                return ''
        }
    }
    return (
        <div className={s.layout}>
            <div className={s.headerThread}>
                <span className={s.headerTitle}>子区列表</span>
                <div className={s.HeaderIcon} onClick={() => onClose()}>
                    <CloseIcon />
                </div>
            </div>
            <ul id={SCROLL_WARP_ID} className={s.list}>
                {renderDefaultList(threadList)}
                <InfiniteScroll
                    dataLength={threadList.length || 0}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<></>}
                    endMessage={<></>}
                    scrollableTarget={SCROLL_WARP_ID}
                >
                    {threadList.length > 0 && threadList.map((option, index) => {
                        return (
                            <li className={s.item} key={index} onClick={(e) => openThreadPanel(option)}>
                                <div className={s.itemCon}>
                                    <div className={s.itemName}>{option.name}</div>
                                    {option.lastMessage && JSON.stringify(option.lastMessage) !== "{}" ?
                                        <div className={s.itemBottom}>
                                            <div className={s.leftCon}>
                                                <div className={s.avatar}><AvatarInfo size={16} src={appUserInfo[option.lastMessage?.from]?.avatarurl} /></div>
                                                <div className={s.ownerName}>
                                                    <span className={s.itemOwner}>{appUserInfo[option.lastMessage?.from]?.nickname ||
                                                        option.lastMessage.from}</span>
                                                </div>
                                                {option.lastMessage && <div className={s.message}><span className={s.itemMsg}>{renderTxt(renderMessage(option.lastMessage))}</span></div>}</div>
                                            <span className={s.itemTime}>{getTimeDiff(option.lastMessage?.time)}</span>
                                        </div> : <div className={s.itemBottom}>
                                            <span className={s.noMessage}>最新消息被撤回</span></div>}

                                </div>
                            </li>
                        );
                    })}
                </InfiniteScroll>
            </ul>
        </div>
    );
};
//The list is empty
const renderDefaultList = (threadList) => {
    if (threadList.length === 0) return (
        <div className={s.defaultTips}>
            <div className={s.tips1}><span className='tlp-tips1-img'></span>当前没有子区</div>
            {/* <div className={s.tips2}>请在频道消息下创建子区</div> */}
        </div>
    )
}
const mapStateToProps = ({ app }) => {
    return {
        serverRole: app.serverRole,
        appUserInfo: app.appUserInfo
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
                type: "thread/setThreadInfo"
            })
        }
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ThreadList));
