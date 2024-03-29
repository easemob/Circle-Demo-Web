import React, { memo, useEffect, useMemo, useState } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import SettingItemTitle from "@/components/SettingItemTitle";
import SettingDefaultContent from "@/components/SettingDefaultContent"
import SettingEditContent from "@/components/SettingEditContent";
import SettingBtnGroup from "@/components/SettingBtnGroup";
import WebIM from "@/utils/WebIM";
import { message } from "antd";
import { updateLocalChannelDetail, deleteLocalChannel, insertChannelList } from "@/utils/common"
import { useParams } from "react-router-dom";


const getCategoryInfo = ({ serverId = "", categoryMap = new Map() }) => {
    return categoryMap.get(serverId);
};
const ChannelOverView = (props) => {
    const { currentSettingChannelInfo, categoryMap, setCurrentChannelInfo, currentChannelInfo, setSettingChannelInfo } = props;
    const { serverId, channelId } = useParams();
    const Header = () => {
        return (<div className={s.header}>
            <span className={s.icon}><Icon name="info-01" size="24px" /></span>
            <span className={s.title}>频道概览</span>
        </div>)
    }
    const [isEditName, setIsEditName] = useState(false);
    const [isEditDesc, setIsEditDesc] = useState(false);
    const [isEditCategory, setIsEditCategory] = useState(false);

    const editChannel = (type, value) => {
        WebIM.conn
            .updateChannel({
                [type]: value,
                serverId,
                channelId,
            })
            .then((res) => {
                message.success("编辑频道成功");
                setSettingChannelInfo({ ...res.data })
                if (currentChannelInfo.channelId === currentSettingChannelInfo.channelId) {
                    setCurrentChannelInfo({ ...res.data })
                }
                updateLocalChannelDetail("edit", serverId, currentSettingChannelInfo.categoryId, { ...res.data, id: channelId });
                switch (type) {
                    case "name":
                        setIsEditName(false);
                        break;
                    case "description":
                        setIsEditDesc(false);
                        break;
                    default:
                        break;
                }
            })
            .catch(() => {
                message.error("编辑频道失败");
            });
    }
    const getName = (data) => {
        //根据分组id获取分组 在内存里存储当前server下的分组信息(全量)
        const item = categoryInfo?.list.find(item => item.id === data) || {};
        return item?.defaultCategory ? "不属于任何分组" : item.name
    }
    //分组信息
    const categoryInfo = useMemo(() => {
        return getCategoryInfo({ serverId, categoryMap });
    }, [categoryMap, serverId]);
    const [curCategoryId, setCurCategoryId] = useState("");
    useEffect(() => {
        setCurCategoryId(currentSettingChannelInfo.categoryId)
    }, [currentSettingChannelInfo])
    const changeChannelCategoryId = () => {
        WebIM.conn.transferChannel({
            serverId,
            channelId,
            newCategoryId: curCategoryId,
        }).then(() => {
            message.success("移动频道到其他分组成功");
            setIsEditCategory(false)
            const info = { ...currentSettingChannelInfo, categoryId: curCategoryId };
            //被移动前的分组删除channel
            deleteLocalChannel({
                serverId,
                categoryId: currentSettingChannelInfo.categoryId,
                channelId,
                isDestroy: true,
                isTransfer: true,
            })
            //移动到的分组增加channel
            insertChannelList(serverId, channelId, info);
            setSettingChannelInfo({ ...info })
            if (currentChannelInfo.channelId === currentSettingChannelInfo.channelId) {
                setCurrentChannelInfo({ ...info })
            }
        }).catch(() => {
            setIsEditCategory(false)
            message.error("移动频道到其他分组失败，请重试！");
        })
    }
    return (
        <div className={s.layout}>
            <HeaderWrap children={Header()} />
            <div className={s.main}>
                <div className={s.settingItem}>
                    <div className={`${s.default} ${s.serverName}`}>
                        <SettingItemTitle title="频道名称" />
                        <div className={s.content}>
                            {!isEditName ?
                                <SettingDefaultContent
                                    content={currentSettingChannelInfo.name}
                                    onEdit={() => { setIsEditName(true) }}
                                />
                                :
                                <SettingEditContent
                                    placeholder="编辑频道名称，不超过16字符"
                                    defaultValue={currentSettingChannelInfo.name||""}
                                    rows="1"
                                    maxLength="16"
                                    onCancel={() => { setIsEditName(false) }}
                                    onSave={(data) => editChannel('name', data)}
                                />
                            }
                        </div>
                    </div>
                </div>
                {currentSettingChannelInfo.mode === 0 && <div className={s.settingItem}>
                    <div className={`${s.default}`}>
                        <SettingItemTitle title="频道简介" />
                        <div className={s.content}>
                            {!isEditDesc ?
                                <SettingDefaultContent
                                    contentIsEmpty={!Boolean(currentSettingChannelInfo.description)}
                                    content={currentSettingChannelInfo.description || "您还未编辑频道简介"}
                                    onEdit={() => { setIsEditDesc(true) }}
                                />
                                :
                                <SettingEditContent
                                    placeholder="编辑频道简介，不超过120字符"
                                    defaultValue={currentSettingChannelInfo.description || ""}
                                    rows="3"
                                    maxLength="120"
                                    onCancel={() => { setIsEditDesc(false) }}
                                    onSave={(data) => editChannel('description', data)}
                                />}
                        </div>
                    </div>
                </div>}

                <div className={s.settingItem}>
                    <div className={`${s.default} ${isEditCategory ? s.channelCategory : null}`}>
                        <SettingItemTitle title="频道分组" />
                        <div className={s.content}>
                            {!isEditCategory ?
                                <SettingDefaultContent
                                    contentIsEmpty={!Boolean(currentSettingChannelInfo.description)}
                                    content={getName(currentSettingChannelInfo.categoryId)}
                                    onEdit={() => { setIsEditCategory(true) }}
                                />
                                :
                                <div className={s.categoryList}>
                                    <div className={s.listCon}>
                                        {categoryInfo?.list.map(item => {
                                            return (<div key={item.id} className={s.category} onClick={() => setCurCategoryId(item.id)}>
                                                <div className={s.categoryName}>{item?.defaultCategory ? "不属于任何分组" : item.name}</div>
                                                <div className={s.radioInput}>
                                                    {curCategoryId !== item.id && <Icon name="circle" color="#fff" size="18px"></Icon>}
                                                    {curCategoryId === item.id && <Icon name="radio-01" color="#27AE60" size="18px"></Icon>}
                                                </div>
                                            </div>)
                                        })}
                                    </div>
                                    <div className={s.buttonLayout}>
                                        <SettingBtnGroup onSave={changeChannelCategoryId} onCancel={() => { setCurCategoryId(currentSettingChannelInfo.categoryId);setIsEditCategory(false) }} />
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = ({ server, app }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        categoryMap: server.categoryMap,
        currentChannelInfo: app.currentChannelInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentChannelInfo: (params) => {
            return dispatch({
                type: "app/setCurrentChannelInfo",
                payload: params,
            })
        },
        setSettingChannelInfo: (params) => {
            return dispatch({
                type: "channel/setSettingChannelInfo",
                payload: params,
            })
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ChannelOverView));

