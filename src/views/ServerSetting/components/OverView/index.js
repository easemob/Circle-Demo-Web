import React, { memo, useState, useRef } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import SettingItemTitle from "@/components/SettingItemTitle";
import SettingDefaultContent from "@/components/SettingDefaultContent"
import SettingEditContent from "@/components/SettingEditContent";
import SettingBtnGroup from "@/components/SettingBtnGroup";
import defaultCover from "@/assets/images/default_cover.png";
import AvatarInfo from "@/components/AvatarInfo";
import UploadImg from "@/components/UploadImg";
import WebIM from "@/utils/WebIM";
import { message } from "antd";
import { updateServerDetail } from "@/utils/common"

const warn = (err) => {
    if (err.message === "Server tag number exceeds the limit.") {
        message.error("社区标签数量超出限制!");
    } else {
        message.error("保存失败，请重试！");
    }
}
const ServerOverView = (props) => {
    const { serverInfo, tags, setTags } = props;
    const Header = () => {
        return (<div className={s.header}>
            <span className={s.icon}><Icon name="info-01" size="24px" /></span>
            <span className={s.title}>社区概览</span>
        </div>)
    }
    const TagItem = (props) => {
        const { tagInfo, isEditTag, removeTag } = props
        return (<div className={`${s.tagItem} ${isEditTag ? s.isEditTag : null}`}>
            <span className={s.iconCon}>
                <Icon name="label" color="rgba(255,255,255,.8)" size="14px" />
            </span>
            <span className={`${s.name}`}>{tagInfo.tagName}</span>
            {isEditTag && <span className={s.iconCon} onClick={() => { removeTag(tagInfo.tagName) }}>
                <Icon name="xmark_in_circle" color="rgba(255,255,255,.8)" size="16px" />
            </span>}
        </div>)
    }
    const [isEditName, setIsEditName] = useState(false);
    const [isEditDesc, setIsEditDesc] = useState(false);
    const [showTagList, setShowTagList] = useState(tags);
    const [isEditTag, setIsEditTag] = useState(false);
    const [removeTag, setRemoveTag] = useState([]);
    const [addTag, setAddTag] = useState([]);
    const tagRef = useRef();
    const [editTagName, setTagName] = useState("");

    const changeRemoveTag = (tagName) => {
        //存储一个数组
        const findIndex = showTagList.findIndex((item) => item.tagName === tagName);
        const index = addTag.indexOf(tagName)
        if (findIndex >= 0) {
            const find = showTagList[findIndex];
            if (find.tagId !== undefined) {
                setRemoveTag([...removeTag, find.tagId]);
            }else if(index>-1){
               addTag.splice(index, 1);
               setAddTag([...addTag])
            }
            showTagList.splice(findIndex, 1);
            setShowTagList([...showTagList])
        }
    }

    const inputTagChange = () => {
        setTagName(tagRef.current.value)
    }
    const changeAddTag = () => {
        if (showTagList.length === 10) {
            message.error("社区标签数量超出限制!");
            return;
        }
        if (editTagName.length > 16) {
            message.error("社区标签字数超出限制!");
            return;
        } else if (editTagName.length === 0) {
            message.error("社区标签不能为空!");
            return;
        }
        const tagName = tagRef.current.value;
        const findIndex = showTagList.findIndex((item) => item.tagName === tagName);
        if (findIndex < 0) {
            setShowTagList([...showTagList, { tagName }])
            if (addTag.indexOf(tagRef.current.value) < 0) {
                setAddTag([...addTag, tagName]);
            }
            tagRef.current.value = "";
            setTagName("");
        } else {
            message.error("社区标签已存在！");
        }
    }
    const cancelEditTag = () => {
        setShowTagList(tags);
        setIsEditTag(false);
    }
    const editServer = (id, type, value) => {
        WebIM.conn
            .updateServer({
                [type]: value,
                serverId: id
            })
            .then((res) => {
                message.success("编辑社区成功");
                updateServerDetail("edit", res.data);
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
                message.error("编辑社区失败");
            });
    }
    const getTags = () => {
        WebIM.conn.getServerTags({ serverId: serverInfo.id }).then((res) => {
            setTags(res.data.tags);
            setShowTagList(res.data.tags);
        });
    }
    const saveTags = () => {
        if (addTag.length === 0 && removeTag.length === 0) {
            setIsEditTag(false);
        } else if (addTag.length === 0 && removeTag.length > 0) {
            WebIM.conn.removeServerTags({ serverId: serverInfo.id, tagIds: removeTag }).then(() => {
                message.success("保存成功！");
                setRemoveTag([]);
                setIsEditTag(false);
            }).catch(e => {
                warn(e);
            }).finally(() => {
                getTags();
            })
        } else if (addTag.length > 0 && removeTag.length === 0) {
            WebIM.conn.addServerTags({ serverId: serverInfo.id, tags: addTag }).then(() => {
                message.success("保存成功！");
                setAddTag([]);
                setIsEditTag(false);
            }).catch(e => {
                warn(e);
            }).finally(() => {
                getTags();
            })
        } else {
            WebIM.conn.removeServerTags({ serverId: serverInfo.id, tagIds: removeTag }).then(() => {
                WebIM.conn.addServerTags({ serverId: serverInfo.id, tags: addTag }).then(() => {
                    message.success("保存成功！");
                    setRemoveTag([]);
                    setAddTag([]);
                    setIsEditTag(false);
                }).catch(e => {
                    warn(e);
                })
            }).catch(e => {
                warn(e);
            }).finally(() => {
                getTags();
            })
        }
    }
    const onAvatarChange = (url) => {
        editServer(serverInfo.id, 'icon', url);
    }
    const onCoverChange = (url) => {
        editServer(serverInfo.id, 'backgroundUrl', url);
    }
    return (
        <div className={s.layout}>
            <HeaderWrap children={Header()} />
            <div className={s.main}>
                <div className={s.settingItem}>
                    <div className={s.serverBgCon}>
                        <div className={s.uploadCon} style={{ backgroundImage: serverInfo.backgroundUrl ? `url(${serverInfo.backgroundUrl})` : `url(${defaultCover})` }}>
                            <div className={s.avaCon}>
                                <AvatarInfo
                                    size={98}
                                    src={serverInfo.icon}
                                    isServer={true}
                                />
                                <UploadImg
                                    update={onAvatarChange}
                                    title={"上传头像"}
                                    maxSize={2}
                                    innerNode={
                                        <div className={s.editAva}>
                                            <Icon name="camera-01" size="28px" />
                                            <span className={s.editText}>编辑头像</span>
                                        </div>
                                    }
                                ></UploadImg>
                            </div>
                            <UploadImg
                                update={onCoverChange}
                                title={"上传封面"}
                                maxSize={2}
                                innerNode={
                                    <div className={s.editCover}>
                                        <Icon name="camera-01" size="18px" />
                                        <span className={s.editText}>编辑封面</span>
                                    </div>
                                }
                            ></UploadImg>
                        </div>
                        <div className={s.desc}>
                            <div>社区头像建议比例1:1，2M以下，支持GIF；</div>
                            <div>社区封面建议比例16:7，2M以下，支持GIF。</div>
                        </div>
                    </div>
                </div>
                <div className={s.settingItem}>
                    <div className={`${s.default} ${s.serverName}`}>
                        <SettingItemTitle title="社区名称" />
                        <div className={s.content}>
                            {!isEditName ?
                                <SettingDefaultContent
                                    content={serverInfo.name}
                                    onEdit={() => { setIsEditName(true) }}
                                />
                                :
                                <SettingEditContent
                                    placeholder="编辑社区名称，不超过16字符"
                                    rows="1"
                                    maxLength="16"
                                    onCancel={() => { setIsEditName(false) }}
                                    onSave={(data) => editServer(serverInfo.id, 'name', data)}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className={s.settingItem}>
                    <div className={`${s.default} ${s.serverDesc}`}>
                        <SettingItemTitle title="社区简介" />
                        <div className={s.content}>
                            {!isEditDesc ?
                                <SettingDefaultContent
                                    contentIsEmpty={!Boolean(serverInfo.description)}
                                    content={serverInfo.description || "您还未编辑社区简介"}
                                    onEdit={() => { setIsEditDesc(true) }}
                                />
                                :
                                <SettingEditContent
                                    placeholder="编辑社区简介，不超过120字符"
                                    rows="3"
                                    maxLength="120"
                                    onCancel={() => { setIsEditDesc(false) }}
                                    onSave={(data) => editServer(serverInfo.id, 'description', data)}
                                />}
                        </div>
                    </div>
                </div>
                <div className={`${s.settingItem}`}>
                    <div className={`${s.default} ${s.serverTag} ${isEditTag ? s.column : null}`}>
                        <div className={s.tagMain}>
                            <SettingItemTitle title="社区标签" />
                            <div className={s.content}>
                                <div className={s.tagPanel}>
                                    {showTagList.length > 0 ?
                                        <div className={s.hasTags}>
                                            {showTagList.map(item => {
                                                return (<TagItem key={item.tagName} tagInfo={item} isEditTag={isEditTag} removeTag={changeRemoveTag} />)
                                            })}
                                        </div> :
                                        <div className={s.noTags}>{isEditTag ? "添加社区标签，最多可以添加10个" : "您还未编辑任何标签"}</div>
                                    }
                                    {!isEditTag && <span className={s.operation} onClick={() => { getTags(); setIsEditTag(true) }}>编辑</span>}
                                </div>
                            </div>
                        </div>
                        {isEditTag && <div className={s.editTag}>
                            <div className={s.editWrap}>
                                <input className={s.editInput} placeholder="输入新标签，不超过16字符" ref={tagRef} onChange={inputTagChange} maxLength="16" />
                                <span className={s.count}>{editTagName.length}/16</span>
                                <span className={s.addTag} onClick={changeAddTag}><Icon name="add_in_circle" color="#929497" size="22px" /></span>
                            </div>
                            <div className={s.btn}><SettingBtnGroup onCancel={cancelEditTag} onSave={saveTags} /></div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = ({ server, app }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        currentChannelInfo: app.currentChannelInfo,
        tags: server.currentServerTag,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setTags: (params) => {
            return dispatch({
                type: "server/setCurrentServerTag",
                payload: params
            });
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ServerOverView));

