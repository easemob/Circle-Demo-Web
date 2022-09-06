import React, { memo, useEffect, useState, useRef, useCallback } from "react";
import s from "./index.module.less";
import WebIM from "@/utils/WebIM";
import { Card, List, message, Modal } from 'antd';
import AvatarInfo from "@/components/AvatarInfo";
import InviteModal from "@/components/InviteModal"
import Icon from "@/components/Icon";
import http from "@/utils/axios"
import { getConfirmModalConf, insertServerList, getServerCover } from "@/utils/common";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
const EnterKeyCode = 13;

const ServerSquare = (props) => {
    const { setServerRole } = props;
    const navigate = useNavigate();
    const searchEl = useRef("");
    const [serverList, setServerList] = useState([]);
    const [showList, setShowList] = useState([]);
    const [searchVal, setSearchVal] = useState('');
    useEffect(() => {
        if (searchVal === "") {
            setShowList(serverList)
        }
    }, [serverList, searchVal])
    useEffect(() => {
        const { apiUrl, orgName, appName } = WebIM.conn;
        http("get", `${apiUrl}/${orgName}/${appName}/circle/server/recommend/list`).then(res => {
            res.servers.length > 0 && res.servers.forEach((item) => {
                item.id = item.server_id
                item.tags.forEach((tag) => {
                    tag.tagId = tag.server_tag_id;
                    tag.tagName = tag.tag_name;
                })
            })
            setServerList(res.servers);
        }).catch((err) => {
            console.log("获取社区推荐列表失败", err)
        })
    }, [])
    //搜索社区
    const setSearchServer = (e) => {
        setSearchVal(e.target.value)
    }
    const emptyVal = () => {
        setSearchVal("");
    }
    const search = useCallback(() => {
        if (searchVal === "") {
            setServerList()
            return
        }
        WebIM.conn.getServers({ keyword: searchVal }).then((res) => {
            setShowList(res.data.list);
        }).catch((err) => {
            console.log("根据Server名称搜索失败", err)
        })
    }, [searchVal])
    //加入社区
    const joinServer = (info) => {
        const server_id = info.id || info.server_id;
        const default_channel_id = info.defaultChannelId || info.default_channel_id;
        //查询是否在server中
        WebIM.conn.isInServer({ serverId: server_id }).then((res) => {
            if (res.data.result) {
                //路由跳转
                navigate(`/main/channel/${server_id}/${default_channel_id}`);
            } else {
                const confirmJoinServer = (serverId) => {
                    WebIM.conn.joinServer({ serverId }).then((res) => {
                        console.log("加入Server成功", res);
                        //插入数据
                        insertServerList(serverId, res.data)
                        navigate(`/main/channel/${server_id}/${default_channel_id}`);
                        WebIM.conn.getServerRole({ serverId }).then((res) => {
                            setServerRole({ serverId, role: res.data.role });
                        });
                    }).catch((err) => {
                        if (err.message === "User is already in server.") {
                            message.warn({ content: "已经在server了！" });
                        } else {
                            message.warn({ content: "加入失败，请重试！" });
                        }
                    })
                }
                const conf = getConfirmModalConf({
                    title: '',
                    okText: "立即加入",
                    cancelText: "暂不加入",
                    content: <InviteModal serverId={server_id} isServerInvite={true} />,
                    onOk: () => confirmJoinServer(server_id),
                    onCancel: () => {
                        console.log("close")
                    }
                });
                Modal.confirm(conf);
            }
        }).catch(() => {
            message.warn({ content: "查询失败，请重试！" });
        })

    }

    //键盘enter事件
    const onKeyDown = useCallback(
        (e) => {
            if (e.keyCode === EnterKeyCode) {
                e.preventDefault();
                search();
            }
        },
        [search]
    );

    //事件绑定
    useEffect(() => {
        searchEl.current.addEventListener("keydown", onKeyDown);
        return function cleanup() {
            let _inputRef = searchEl;
            _inputRef &&
                _inputRef?.current?.removeEventListener("keydown", onKeyDown);
        };
    }, [onKeyDown]);

    return (
        <div className={s.container}>
            <div className={s.title}>
                <div className={s.welcome}>
                    <span className={s.text}>欢迎来到</span>
                    <span className={s.text}>环信超级社区</span>
                </div>
                <div className={s.search}>
                    <div className={s.searchInputCon}>
                        <input ref={searchEl} className={s.searchInput} placeholder="搜索社区" value={searchVal} onChange={setSearchServer} />
                        {searchVal !== "" && <span className={s.empty} onClick={emptyVal}>
                            <Icon name="xmark_in_circle" size="20px" color="#e4e4e4" />
                        </span>}
                    </div>
                    <div className={`circleBtn66 circleBtn ${s.searchBtn}`} onClick={search}>搜索</div>
                </div>
            </div>
            <div className={s.main}>
                <List className={s.serverList}
                    grid={{
                        gutter: 12,
                        xs: 2,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                    }}
                    dataSource={showList}
                    renderItem={item => (
                        <List.Item >
                            <Card key={item.server_id} className={`${s.serverItem}`} style={{ backgroundImage: `url(${getServerCover(item.id)})` }} onClick={() => { joinServer(item) }}>
                                <div className={s.serverInfo}>
                                    <div className={s.avatar}>
                                        <AvatarInfo size={48} isServer={true} src={item.icon_url} />
                                    </div>
                                    <div className={s.name}>{item.name}</div>
                                    <div className={s.des}>{item.description || "群主有点懒，就不写介绍。"}</div>
                                    <div className={s.tags}>
                                        {item.tags && item.tags.length > 0 && item.tags.map((tag) => {
                                            return (
                                                <div className={s.tag} key={tag.tagId}>
                                                    <Icon name="label" color="rgba(255,255,255,.74)" size="12px" />
                                                    <span className={s.tagText}>{tag.tagName}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};
const mapStateToProps = ({ server }) => {
    return {
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setServerRole: (params) => {
            return dispatch({
                type: "app/setServerRole",
                payload: params,
            })
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ServerSquare));
