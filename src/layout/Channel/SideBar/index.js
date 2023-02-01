import React, { memo, useMemo, useState } from "react";
import { Collapse, message, Dropdown } from "antd";
import Desc from "./components/serverDesc";
import CategoryItem from "./components/Category";
import ChannelItem from "./components/channelItem"
import s from "./index.module.less";
import { Menu, Modal } from "antd";
import { getServerMenuChildren, SERVER_MENU_TYPES, CATEGORY_MENU_TYPES, getCategoryMenu } from "../const";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { SERVER_OPT_TYPE, INVITE_TYPE, USER_ROLE } from "@/consts";
import WebIM from "@/utils/WebIM";
import { useEffect } from "react";
import InviteUser from "../InviteUser";
import {
    getConfirmModalConf,
    filterData,
    deleteServer,
    getServerCover,
    getDefaultCategoryInfo,
    updateCategoryMap,
    leaveRtcChannel,
} from "@/utils/common";
import InfiniteScroll from "react-infinite-scroll-component";
import NameModal from "@/components/NameModal";
import TagList from "@/components/TagList";
import RtcRoom from "./components/RtcRoom"

const SCROLL_CATEGORY_WARP_ID = "categoryScrollWrap";
const CATEGORY_LIMIT = 20;
const { Panel } = Collapse;

const ServerMenuItems = (role) => {
    return [
        {
            label: (
                <div className={`${s.icon}`}>
                    <Icon name="ellipsis" color="#fff" size="28px" />
                </div>
            ),
            key: "SubMenu",
            children: getServerMenuChildren(role)
        }
    ];
};

const getServerInfoById = ({ serverId = "", serverList = [] }) => {
    let ls = serverList.filter((item) => {
        return item.id === serverId;
    });
    if (ls.length) {
        return ls[0];
    } else {
        return {};
    }
};

const getCategoryInfo = ({ serverId = "", categoryMap = new Map() }) => {
    return categoryMap.get(serverId);
};

const SideBar = (props) => {
    const {
        setVisible,
        setChannelVisible,
        setInviteVisible,
        setServerFormVisible,
        joinedServerInfo,
        currentChannelInfo,
        serverRole,
        tags,
        setTags,
        categoryMap,
        setCategoryMap,
        updateCreateChannelCategoryId,
        channelMap,
        setChannelInfo,
        inviteChannelInfo,
        curRtcChannelInfo,
        setInviteChannelInfo,
    } = props;

    const [activeKeys, setActiveKeys] = useState([]);
    const navigate = useNavigate();
    const { serverId, channelId, threadId } = useParams();
    const selfRole = serverRole && serverRole[serverId];
    const serverInfo = useMemo(() => {
        return getServerInfoById({ serverId, serverList: joinedServerInfo.list });
    }, [serverId, joinedServerInfo]);
   
    //分组信息
    const categoryInfo = useMemo(() => {
        return getCategoryInfo({ serverId, categoryMap });
    }, [categoryMap, serverId]);
    const { name, description = "" } = serverInfo;
    //加载更多
    const loadMoreData = () => {
        getChannelCategory({ cursor: categoryInfo.cursor });
    };
    //社区操作菜单点击
    const onMenuClick = (e) => {
        if (e.key === SERVER_MENU_TYPES.create) {
            setChannelVisible(true);
            updateCreateChannelCategoryId({ categoryId: getDefaultCategoryInfo(categoryInfo).id })
        } else if (e.key === SERVER_MENU_TYPES.createChannelCategory) {
            setShowCreateCategory(true);
        } else if (e.key === SERVER_MENU_TYPES.viewMember) {
            //路由跳转
            navigate(`/main/channel/${serverId}/${channelId}`);
            if (threadId) {
                setTimeout(() => {
                    setVisible(true);
                }, 0)
            } else {
                setVisible(true);
            }
        } else if (e.key === SERVER_MENU_TYPES.editServer) {
            setServerFormVisible(SERVER_OPT_TYPE.edit);
        } else if (e.key === SERVER_MENU_TYPES.leaveServer) {
            const conf = getConfirmModalConf({
                title: <div style={{ color: "#fff" }}>退出社区</div>,
                content: (
                    <div style={{ color: "#fff" }}>
                        {`确认退出社区 `}&nbsp;<span style={{ fontWeight: 700 }}>{name}</span>{`？`}
                    </div>
                ),
                onOk: () => {
                    WebIM.conn
                        .leaveServer({
                            serverId
                        })
                        .then((res) => {
                            message.success("退出社区成功");
                            deleteServer(serverId).then((res) => {
                                if (res.length > 0) {
                                    const { id, defaultChannelId } = res[0];
                                    navigate(`/main/channel/${id}/${defaultChannelId}`);
                                } else {
                                    navigate(`/main/contacts/index`);
                                }
                            });
                        });
                }
            });
            Modal.confirm(conf);
        } else if (e.key === "serverSetting") {
            navigate(`/main/server/${serverId}/setting`);
        }
    };
    const getChannelCategory = (({ cursor = "" }) => {
        WebIM.conn
            .getChannelCategorylist({
                serverId,
                pageSize: CATEGORY_LIMIT,
                cursor
            })
            .then((res) => {
                const categoryList = categoryInfo?.list || [];
                const resList = filterData(categoryList, res.data.list, "id");
                let ls = [...categoryList, ...resList];
                setCategoryMap({
                    serverId,
                    categoryInfo: {
                        ...categoryInfo,
                        list: ls,
                        cursor: res.data.cursor,
                        loadCount: res.data.list.length,
                    }
                })
            });
    })
    //加载分组信息
    useEffect(() => {
        getChannelCategory({ cursor: "" });
    }, [serverId]);

    //获取社区tag
    useEffect(() => {
        WebIM.conn.getServerTags({ serverId }).then((res) => {
            setTags(res.data.tags);
        });
    }, [serverId, setTags]);
    //获取channelInfo
    const getChannelInfo = ({ serverId, channelId }) => {
        WebIM.conn.getChannelDetail({ serverId, channelId }).then((res) => {
            setChannelInfo(res.data);
            if (activeKeys.indexOf(res.data.channelCategoryId) < 0) {
                setActiveKeys([...activeKeys, res.data.channelCategoryId])
            }
        });
    };
    //选中channel变化设置选中channel信息
    useEffect(() => {
        getChannelInfo({
            serverId,
            channelId
        });
    }, [serverId, channelId])

    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showUpdateCategory, setShowUpdateCategory] = useState(false);
    const [curEditCategoryId, setCurEditCategoryId] = useState("");
    //创建分组
    const createChannelCategory = (data) => {
        WebIM.conn.createChannelCategory({
            serverId,
            name: data
        }).then((res) => {
            message.success("创建分组成功");
            setShowCreateCategory(false);
            updateCategoryMap(
                {
                    type: "add",
                    categoryInfo: {
                        id: res.data.id,
                        name: data,
                        serverId,
                        defaultChannelCategory: 0,
                    }
                }
            )
        }).catch(() => {
            message.error("创建分组失败，请重试！");
        })
    }
    //更新分组
    const updateChannelCategory = (data) => {
        setShowUpdateCategory(false)
        WebIM.conn.updateChannelCategory({
            serverId,
            name: data,
            channelCategoryId: curEditCategoryId,
        }).then((res) => {
            message.success("编辑分组成功");
            setShowCreateCategory(false);
            updateCategoryMap(
                {
                    type: "update",
                    categoryInfo: {
                        id: res.data.id,
                        name: data,
                        serverId,
                        defaultChannelCategory: 0,
                    }
                }
            )
        }).catch(() => {
            message.error("编辑分组失败，请重试！");
        })
    }
    //是否在语音频道
    const isInRtcRoom = useMemo(() => {
        return JSON.stringify(curRtcChannelInfo) === "{}" ? false : true;
    }, [curRtcChannelInfo])
    // 退出语音频道
    const leaveRtcRoom = () => {
        const { serverId, channelId } = curRtcChannelInfo;
        leaveRtcChannel({ needLeave: true, serverId, channelId }).then(() => {
            message.success({ content: "退出频道成功" });
        }).catch(() => {
            message.error({ content: "操作失败，请重试！" });
        })
    }
    //邀请用户加入语音频道
    const inviteUser = () => {
        setInviteChannelInfo({ inviteChannelInfo: curRtcChannelInfo });
        setInviteVisible(INVITE_TYPE.inviteChannel);
    }
    //分组折叠面板
    const onChange = (e) => {
        if (activeKeys.indexOf('default') > -1) {
            //选中的channel所在分组是否被收起
            let keys = activeKeys.filter((item) => e.indexOf(item) < 0);
            if (keys.length === 1 && keys[0] === "default") {
                //展开 收起的、选中的channel所在分组
                setActiveKeys([...e, currentChannelInfo.channelCategoryId])
            } else {
                setActiveKeys(e)
            }
        } else {
            //选中的channel所在分组没有收起
            let flag = false;//选中的channel所在分组是否被收起
            e.forEach(item => {
                if (item !== "" && hasSelectedChannel(item)) {
                    flag = true;
                }
            })
            if (flag) {
                setActiveKeys(e)
            } else {
                setActiveKeys([...e, 'default'])
            }
        }
    };
    //分组操作
    const genExtra = (selfRole, categoryId) => {
        return selfRole === USER_ROLE.owner ? (
            <Icon iconClass={s.plusIcon} name="plus" color="rgba(255,255,255,.74)" size="16px" onClick={(event) => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
                //创建频道
                setChannelVisible(true);
                updateCreateChannelCategoryId({ categoryId })
            }} />
        ) : (<></>);
    }
    //判断是否包含选中的频道
    const hasSelectedChannel = (categoryId) => {
        const channelInfo = channelMap.get(categoryId);
        if (!channelInfo) return false;
        const channelList = [...channelInfo?.public, ...channelInfo?.private] || [];
        const findIndex = channelList.findIndex(item => item.channelId === channelId);
        if (findIndex > -1) {
            return true
        }
        return false;
    }
    //分组菜单操作
    const editCategory = (e, item) => {
        e.domEvent.stopPropagation()
        switch (e.key) {
            case CATEGORY_MENU_TYPES.edit:
                setShowUpdateCategory(true);
                setCurEditCategoryId(item.id);
                break;
            case CATEGORY_MENU_TYPES.delete:
                const conf = getConfirmModalConf({
                    title: <div style={{ color: "#fff" }}>删除分组</div>,
                    content: (
                        <div style={{ color: "#fff" }}>
                            {`确认删除分组`}&nbsp;<span style={{ fontWeight: 700 }}>{item?.name}</span>{`？本操作不可恢复`}。
                        </div>
                    ),
                    onOk: () => {
                        WebIM.conn
                            .deleteChannelCategory({
                                serverId,
                                channelCategoryId: item.id
                            })
                            .then(() => {
                                message.success("删除分组成功");
                                //删除分组列表数据
                                updateCategoryMap(
                                    {
                                        type: "delete",
                                        categoryInfo: item,
                                    }
                                )
                            }).catch(() => {
                                message.error("删除分组失败，请重试！");
                            })
                    }
                });
                Modal.confirm(conf);
                break;
            default:
                break;
        }
    }
    const getHeader = (item) => {
        if (selfRole === USER_ROLE.user) {
            return (
                <div className={s.headerWrap}>
                    <div className={s.textHeader}>{item.name}</div>
                </div>
            )
        } else {
            return (
                <Dropdown
                    menu={{
                        items: getCategoryMenu(selfRole),
                        onClick: (e) => {editCategory(e, item)},
                        triggerSubMenuAction: "click"
                    }}
                    overlayClassName="circleDropDown"
                    trigger={['contextMenu']}>
                    <div className={s.headerWrap}>
                        <div className={s.textHeader}>{item.name}</div>
                    </div>
                </Dropdown>
            )
        }
    };
    return (
        <div className={`${s.sideBarWrap} ${isInRtcRoom ? s.hasBottom : null}`}>
            <div className={s.serverWrap}>
                <div
                    className={s.serverCover}
                    style={{
                        backgroundImage: serverInfo.backgroundUrl ? `url(${serverInfo.backgroundUrl})` :`url(${getServerCover(serverId)})`
                    }}
                >
                    <div className={s.shadow}></div>
                    <div className={s.infoWrap}>
                        <div className={s.serverName}>{name}</div>
                        <div className={s.iconWarp}>
                            <div
                                className={`${s.icon}`}
                                onClick={() => {
                                    setInviteVisible(INVITE_TYPE.inviteServer);
                                }}
                            >
                                <Icon
                                    name="person_plus"
                                    size="28px"
                                    color="#fff"
                                    style={{ marginRight: "8px" }}
                                />
                            </div>
                            <InviteUser
                                serverName={name}
                                channelName={inviteChannelInfo?.name}
                                inviteChannelInfo={inviteChannelInfo}
                            />
                            <Menu
                                onClick={onMenuClick}
                                style={{ padding: 0 }}
                                theme={"dark"}
                                selectable={false}
                                triggerSubMenuAction="click"
                                mode="horizontal"
                                items={ServerMenuItems(selfRole)}
                            ></Menu>
                        </div>
                    </div>
                    <div className={s.tagWrap}>
                        <TagList tags={tags} isBar={true} />
                    </div>
                </div>
                {description && <Desc desc={description} />}
            </div>
            <div className={`${s.channelWrap} ${s.channelContentWrap}`} id={SCROLL_CATEGORY_WARP_ID}>
                <InfiniteScroll
                    dataLength={categoryInfo?.list?.length || 0}
                    next={loadMoreData}
                    hasMore={categoryInfo?.loadCount === CATEGORY_LIMIT}
                    loader={<div className={s.loading}>加载中...</div>}
                    endMessage={<></>}
                    scrollableTarget={SCROLL_CATEGORY_WARP_ID}
                >
                    <CategoryItem
                        categoryInfo={categoryInfo}
                        categoryId={getDefaultCategoryInfo(categoryInfo)?.id}
                    />
                    <Collapse
                        className={s.customCollapse}
                        bordered={false}
                        activeKey={activeKeys}
                        expandIcon={({ isActive, className }) => {
                            return (
                                <Icon
                                    iconClass={isActive && className.indexOf("default") < 0 ? s.expand : s.fold}
                                    name={"shevron_down"}
                                    color="#c7c7c7"
                                    size="14px"
                                />
                            );
                        }}
                        onChange={onChange}
                    >
                        {categoryInfo?.list.map((item) => {
                            if (item.defaultChannelCategory === 0) {
                                if (activeKeys.indexOf(item.id) < 0 && hasSelectedChannel(item.id)) {
                                    return (
                                        <Panel className={s.default} header={getHeader(item)} key={"default"} extra={genExtra(selfRole, item.id)}>
                                            <ChannelItem
                                                {...currentChannelInfo}
                                                channelInfo={currentChannelInfo}
                                                key={currentChannelInfo.channelId}
                                                active={!threadId}
                                                categoryInfo={categoryInfo}
                                            />
                                        </Panel>
                                    )
                                } else {
                                    return (
                                        <Panel className={s.customCollapsePanel} header={getHeader(item)} key={item.id} extra={genExtra(selfRole, item.id)}>
                                            <CategoryItem
                                                categoryInfo={categoryInfo}
                                                categoryId={item.id}
                                            />
                                        </Panel>
                                    )
                                }
                            }
                            return null;
                        })}
                    </Collapse>
                </InfiniteScroll>
            </div>
            {isInRtcRoom && <div className={s.rtcWrap}>
                <RtcRoom leave={leaveRtcRoom} invite={inviteUser} serverInfo={serverInfo}/></div>}
            <NameModal
                title={showUpdateCategory ? "编辑分组" : "创建频道分组"}
                inputName="分组名称"
                open={showCreateCategory || showUpdateCategory}
                size={50}
                placeholder="输入分组名称"
                handleCancel={() => showUpdateCategory ? setShowUpdateCategory(false) : setShowCreateCategory(false)}
                handleOk={(name) => showUpdateCategory ? updateChannelCategory(name) : createChannelCategory(name)}
            />
        </div>
    );
};

const mapStateToProps = ({ server, app, channel }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        categoryMap: server.categoryMap,
        currentChannelInfo: app.currentChannelInfo,
        serverRole: app.serverRole,
        tags: server.currentServerTag,
        channelMap: server.channelMap,
        inviteChannelInfo: channel.inviteChannelInfo,
        curRtcChannelInfo: channel.curRtcChannelInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setVisible: (params) => {
            return dispatch({
                type: "channel/setVisible",
                payload: params
            });
        },
        setChannelVisible: (params) => {
            return dispatch({
                type: "channel/setChannelVisible",
                payload: params
            });
        },
        setInviteVisible: (params) => {
            return dispatch({
                type: "channel/setInviteVisible",
                payload: params
            });
        },
        setServerFormVisible: (params) => {
            return dispatch({
                type: "app/setVisible",
                payload: params
            });
        },
        setTags: (params) => {
            return dispatch({
                type: "server/setCurrentServerTag",
                payload: params
            });
        },
        setCategoryMap: (params) => {
            return dispatch({
                type: "server/setCategoryMap",
                payload: params
            });
        },
        updateCreateChannelCategoryId: (params) => {
            return dispatch({
                type: "channel/updateCreateChannelCategoryId",
                payload: params
            });
        },
        setChannelInfo: (params) => {
            return dispatch({
                type: "app/setCurrentChannelInfo",
                payload: params
            });
        },
        setInviteChannelInfo: (params) => {
            return dispatch({
                type: "channel/setInviteChannelInfo",
                payload: params
            });
        },
    };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(SideBar));
