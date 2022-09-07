import React, { memo, useState, useMemo, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import s from "./index.module.less";
import ThreadHeader from "./components/Header"
import ThreadName from "./components/Name"
import OriginalMsg from "./components/OriginalMsg"
import Input from "@/components/Input";
import MessageLeft from "@/components/MessageLeft";
import { CHAT_TYPE, MESSAGE_ITEM_SOURCE } from "@/consts";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { getThreadHistoryMessage } from "@/utils/common"
import InfiniteScroll from "react-infinite-scroll-component";
import { recallMessage } from "@/utils/common";

const SCROLL_WARP_ID = "threadMessageScrollId";
const ThreadPanel = (props) => {
    const { threadMessage, threadHasHistory, currentThreadInfo } = props;
    const { channelId } = useParams();
    const [threadName, setThreadName] = useState("");
    const messageList = useMemo(() => {
        return currentThreadInfo?.id && threadMessage.get(currentThreadInfo.id) ? threadMessage.get(currentThreadInfo.id) : []
    }, [currentThreadInfo, threadMessage]);
    useEffect(() => {
        if (currentThreadInfo && currentThreadInfo?.id) {
            setThreadName("");
            const dom = scrollThreadEl.current;
            if (!ReactDOM.findDOMNode(dom)) return;
            dom.scrollTop = 0;
        }
        if (currentThreadInfo?.id && currentThreadInfo.source !== 'notify') {
            getThreadHistoryMessage(currentThreadInfo.id)
        }
    }, [currentThreadInfo?.id])
    //滚动加载
    const scrollThreadEl = useRef(null);
    const loadMoreData = () => {
        getThreadHistoryMessage(currentThreadInfo.id, true)
    }
    //收到新消息滚动（滚动条滚动前提：没有历史记录）
    useEffect(() => {
        const dom = scrollThreadEl.current;
        if (!ReactDOM.findDOMNode(dom)) return;
        if (threadHasHistory === false && messageList.length !== 0 && dom.scrollHeight >= (dom.scrollTop + dom.clientHeight)) {
            setTimeout(() => {
                dom.scrollTop = dom.scrollHeight;
            }, 300)
        }
    }, [messageList.length])

    //消息操作
    const handleOperation = (op, isThreadMessage = false, data) => {
        switch (op) {
            case "recall":
                recallMessage(data, isThreadMessage);
                break;
            default:
                break;
        }
    };
    return (
        <div className={s.layout}>
            <ThreadHeader />
            <div className={s.contentWrap}>
                <div id={SCROLL_WARP_ID} className={s.messageWrap} ref={scrollThreadEl}>
                    <InfiniteScroll
                        dataLength={messageList.length || 0}
                        next={loadMoreData}
                        hasMore={threadHasHistory}
                        loader={<></>}
                        endMessage={<></>}
                        scrollableTarget={SCROLL_WARP_ID}
                    >
                        <ThreadName setName={(name) => { setThreadName(name) }} />
                        <OriginalMsg />
                        {messageList && messageList.length > 0 && messageList.map((item) => {
                            return (
                                <div key={item.id} className={s.messageItem}>
                                    <MessageLeft message={item} isThreadMessage={true} parentId={channelId} source={MESSAGE_ITEM_SOURCE.threadChat} onHandleOperation={handleOperation} />
                                </div>
                            );
                        })}
                    </InfiniteScroll>
                </div>
                <div className={s.iptWrap}>
                    <Input chatType={CHAT_TYPE.groupChat} isThread={true} fromId={channelId} threadName={threadName} />
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = ({ thread }) => {
    return {
        threadCursor: thread.threadCursor,
        threadMessage: thread.threadMessage,
        threadHasHistory: thread.threadHasHistory,
        currentThreadInfo: thread.currentThreadInfo
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
export default memo(connect(mapStateToProps, mapDispatchToProps)(ThreadPanel));

