import React, { memo, useCallback, useMemo, useEffect, useState } from "react";
import { List, message } from "antd";
import ChannelItem from "../channelItem";
import s from "./index.module.less";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import WebIM from "@/utils/WebIM";
import { filterData } from "@/utils/common";

// const LIMIT = 20;
const LIMIT = 5;

const getChannelInfo = ({ channelCategoryId = "", channelMap = new Map() }) => {
    return channelMap.get(channelCategoryId);
};

const CategoryItem = (props) => {
    const {
        categoryId,
        channelMap,
        setServerChannelMap,
        categoryInfo,
    } = props;
    const { serverId, channelId, threadId } = useParams();
    const [hasMorePublic, setHasMorePublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const channelInfo = useMemo(() => {
        return getChannelInfo({ channelCategoryId: categoryId, channelMap });
    }, [channelMap, categoryId]);
    const dataSource = channelInfo
        ? [...channelInfo?.public, ...channelInfo?.private]
        : [];
    const loadMoreData = () => {
        if (!hasMorePublic) {
            getCategoryVisiblePrivateChannels({ serverId, cursor: channelInfo?.privateCursor, channelCategoryId: categoryId });
        } else {
            getCategoryPublicChannels({ channelCategoryId: categoryId, cursor: channelInfo?.publicCursor });
        }
    };

    const getCategoryPublicChannels = useCallback(
        ({ cursor = "", channelCategoryId }) => {
            setLoading(true);
            WebIM.conn
                .getCategoryPublicChannels({
                    serverId,
                    channelCategoryId,
                    pageSize: LIMIT,
                    cursor
                })
                .then((res) => {
                    setLoading(false);
                    let ls = [];
                    if (!channelInfo?.public) {
                        ls = res.data.list;
                    } else {
                        const resList = filterData(
                            channelInfo?.public,
                            res.data.list,
                            "channelId"
                        );
                        ls = [...channelInfo?.public, ...resList];
                    }
                    const dt = {
                        public: ls,
                        publicCursor: res.data.cursor,
                        private: [],
                        privateCursor: "",
                        loadCount: res.data.list.length
                    };
                    if (res.data.list.length < LIMIT) {
                        setHasMorePublic(false);
                        setLoading(true);
                        WebIM.conn
                            .getCategoryVisiblePrivateChannels({
                                serverId,
                                channelCategoryId,
                                pageSize: LIMIT,
                                cursor: ""
                            })
                            .then((privateRes) => {
                                setLoading(false);
                                const privateList = channelInfo?.private || [];
                                const resList = filterData(
                                    privateList,
                                    privateRes.data.list,
                                    "channelId"
                                );
                                let ls = [...privateList, ...resList];
                                setServerChannelMap({
                                    channelCategoryId,
                                    channelInfo: {
                                        ...dt,
                                        private: ls,
                                        privateCursor: privateRes?.data?.cursor,
                                        loadCount: privateRes.data.list.length
                                    }
                                });
                            });
                    } else {
                        setServerChannelMap({
                            channelCategoryId,
                            channelInfo: dt
                        });
                    }
                }).catch(() => {
                    message.error(`频道加载失败，请重试！`);
                    setLoading(false);
                })
        },
        [channelInfo?.private, channelInfo?.public, serverId, setServerChannelMap]
    );

    const getCategoryVisiblePrivateChannels = ({ cursor = "", channelCategoryId }) => {
        setLoading(true);
        WebIM.conn
            .getCategoryVisiblePrivateChannels({
                serverId,
                channelCategoryId,
                pageSize: LIMIT,
                cursor,
            })
            .then((res) => {
                setLoading(false);
                const privateList = channelInfo?.private || [];
                const resList = filterData(privateList, res.data.list, "channelId");
                let ls = [...privateList, ...resList];
                setServerChannelMap({
                    channelCategoryId,
                    channelInfo: {
                        ...channelInfo,
                        private: ls,
                        privateCursor: res.data.cursor,
                        loadCount: res.data.list.length
                    }
                });
            }).catch(() => {
                message.error(`频道加载失败，请重试！`);
                setLoading(false);
            })
    };
    useEffect(() => {
        if (!channelMap.has(categoryId) && categoryId) {
            getCategoryPublicChannels({ cursor: "", channelCategoryId: categoryId });
        }
    }, [categoryId, channelMap]);
    const LoadBtn = ({ onClick }) => {
        return (
            <div className={s.loadBtn} onClick={onClick}>
                加载更多频道
                <DownOutlined
                    style={{ color: "#767676", fontSize: "12px", marginLeft: "2px" }}
                />
            </div>
        );
    };
    return (
        <div>
            <div className={s.channelContentWrap}>
                {dataSource.length > 0 && <List
                    dataSource={dataSource}
                    renderItem={(item) => (
                        <List.Item>
                            <ChannelItem
                                {...item}
                                channelInfo={item}
                                key={item.channelId}
                                active={!threadId && channelId === item.channelId}
                                categoryInfo={categoryInfo}
                            />
                        </List.Item>
                    )}
                />}
                {channelInfo?.loadCount === LIMIT ? (
                    <LoadBtn
                        onClick={loadMoreData}
                    />
                ) : (
                    <></>
                )}
                {loading && <div className={s.loading}>加载中...</div>}
            </div>
        </div>
    );
};

const mapStateToProps = ({ server, app }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        channelMap: server.channelMap,
        tags: server.currentServerTag,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setServerChannelMap: (params) => {
            return dispatch({
                type: "server/setChannelMap",
                payload: params
            });
        },
    };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(CategoryItem));
