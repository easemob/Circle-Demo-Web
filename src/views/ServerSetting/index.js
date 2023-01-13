import React, { useMemo, memo, useState } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import Sidebar from "@/components/SettingSideBar";
import { useParams, useNavigate } from "react-router-dom";
import OverView from "./components/OverView";
import Setting from "./components/Setting"
import {
    getConfirmModalConf,
    deleteServer,
} from "@/utils/common";
import WebIM from "@/utils/WebIM";
import { Modal, message } from 'antd';
import { USER_ROLE } from "@/consts";


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
const operationList = [
    {
        op: "overView",
        title: "概览",
        iconName: "info-01"
    },
    {
        op: "setting",
        title: "设置",
        iconName: "gear"
    },
    {
        op: "destroyServer",
        title: "解散社区",
        iconName: "trash"
    }
];
const getList = (role) => {
    let items = []
    if (role === USER_ROLE.owner) {
        items = [...operationList];
    } else {
        items.push(operationList[0], operationList[1]);
    }
    return items
}
const ServerSetting = (props) => {
    const { joinedServerInfo, currentChannelInfo, serverRole } = props;
    const { serverId } = useParams();
    const selfRole = serverRole && serverRole[serverId];
    const [currentTab, setTab] = useState(0);
    const navigate = useNavigate();
    const onTabChange = (index) => {
        if (index !== 2) {
            setTab(index)
        } else {
            const conf = getConfirmModalConf({
                title: <div style={{ color: "#fff" }}>解散社区</div>,
                content: (
                    <div style={{ color: "#fff" }}>
                        {`确认解散社区`}&nbsp;<span style={{ fontWeight: 700 }}>{serverInfo.name}</span> {`？本操作不可恢复`}。
                    </div>
                ),
                onOk: () => {
                    WebIM.conn
                        .destroyServer({
                            serverId
                        })
                        .then(() => {
                            message.success("解散社区成功");
                            deleteServer(serverId).then((res) => {
                                if (res.length > 0) {
                                    const { id, defaultChannelId } = res[0];
                                    navigate(`/main/channel/${id}/${defaultChannelId}`);
                                } else {
                                    navigate(`/main/contacts/index`);
                                }
                            });
                        }).catch(e => {
                            message.error("解散社区失败，请重试！");
                        })
                }
            });
            Modal.confirm(conf);
        }
    }
    const goBack = () => {
        //路由跳转
        const channelId = currentChannelInfo.channelId || serverInfo.defaultChannelId;
        navigate(`/main/channel/${serverId}/${channelId}`);
    }

    const serverInfo = useMemo(() => {
        return getServerInfoById({ serverId, serverList: joinedServerInfo.list });
    }, [serverId, joinedServerInfo]);
    return (
        <div className={s.layout}>
            <Sidebar
                operationList={getList(selfRole)}
                onTabChange={onTabChange}
                currentTab={currentTab}
                context={serverInfo.name}
                goBack={goBack}
            />
            {currentTab === 0 && <OverView
                serverInfo={serverInfo}
            />}
            {currentTab === 1 && <Setting
                serverInfo={serverInfo}
            />}

        </div>
    );
};
const mapStateToProps = ({ server, app }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        currentChannelInfo: app.currentChannelInfo,
        serverRole: app.serverRole,
    };
};
export default memo(connect(mapStateToProps, null)(ServerSetting));

