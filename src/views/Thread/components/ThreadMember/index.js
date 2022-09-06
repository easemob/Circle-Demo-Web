import React, { memo, useState, useEffect } from "react";
import s from "./index.module.less";
import MemberItem from "@/components/MemberItem";
import Icon from "@/components/Icon";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import WebIM from "@/utils/WebIM";
import { getUsersInfo } from "@/utils/common"
import CloseIcon from "@/components/CloseIcon"

const SCROLL_WARP_ID = "threadMemberScrollId";
const LIMIT = 20;
const ThreadMember = (props) => {
    const { close, appUserInfo, currentThreadInfo, visible } = props;
    const [memberList, setMemberList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [memberCursor, setMemberCursor] = useState('');
    const loadMoreData = () => {
        getThreadMember(currentThreadInfo?.id, memberCursor)
    }
    const getThreadMember = (id, cursor = "") => {
        id && WebIM.conn.getChatThreadMembers({ chatThreadId: id, cursor, pageSize: LIMIT }).then((res) => {
            setMemberCursor(res.properties.cursor);
            getUsersInfo(res.data.affiliations).then(() => {
                if (res.data.affiliations.length < LIMIT) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                if (cursor === "") {
                    setMemberList(res.data.affiliations)
                } else {
                    setMemberList([...memberList, ...res.data.affiliations])
                }
            })
        })
    };
    useEffect(() => {
        if (visible) {
            getThreadMember(currentThreadInfo?.id);
        } else {
            setMemberCursor("");
        }
    }, [visible])
    return (
        <div className={s.layout}>
            <div className={s.header}>
                <span className={s.title}>子区成员</span>
                <span onClick={close} className={s.closeIcon}><CloseIcon /></span>
            </div>
            <div id={SCROLL_WARP_ID} className={s.container}>
                <InfiniteScroll
                    dataLength={memberList.length || 0}
                    next={loadMoreData}
                    hasMore={hasMore}
                    loader={<></>}
                    endMessage={<></>}
                    scrollableTarget={SCROLL_WARP_ID}
                >
                    {memberList?.length > 0 && memberList.map((item, index) => {
                        return (
                            <MemberItem size={36} info={appUserInfo[item]} showLine={true} basicShowOnline={false} uid={item} key={index} borderType={2}/>
                        )
                    })}
                </InfiniteScroll>
            </div>
        </div>
    );
};
//
const mapStateToProps = ({ app, thread }) => {
    return {
        appUserInfo: app.appUserInfo,
        currentThreadInfo: thread.currentThreadInfo
    };
};



export default memo(connect(mapStateToProps, null)(ThreadMember));

