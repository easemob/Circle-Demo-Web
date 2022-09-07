import React, { memo, useState, useEffect, useRef, createRef } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import WebIM from "@/utils/WebIM";
import { getUsersInfo } from "@/utils/common"
import MemberItem from "@/components/MemberItem";
import { Dropdown, Menu, Popover, message, Tooltip } from 'antd';
import Icon from "@/components/Icon";
import { useNavigate } from "react-router-dom";

const menu = (uid, onDelete) => {
    return (
        <Menu
            onClick={() => { onDelete(uid) }}
            items={[
                {
                    key: '1',
                    label: (
                        <div className="circleDropItem">
                            <Icon name="trash" size="22px" iconClass="circleDropMenuIcon" />
                            <span className="circleDropMenuOp">删除好友</span>
                        </div>
                    ),
                },
            ]}
        />
    )
}
const emptyDom = (txt) => {
    return (
        <div className={s.noApply}>
            <div className={s.noApplyIcon}></div>
            <p className={s.noApplyText}>{txt}</p>
        </div>
    )
}
const ContactsOperation = (props) => {
    const { appUserInfo, contactsList, applyInfo, setContactsList, setApplyInfo } = props;
    const navigate = useNavigate()
    //初始化联系人数据
    useEffect(() => {
        if (contactsList.length > 0) return
        WebIM.conn.getContacts().then(res => {
            if (res.data.length > 0) {
                getUsersInfo(res.data)
                setContactsList(res.data);
            }
        })
    }, [])
    //切换tab或原始数据变化,更新可见列表
    const [tab, setTab] = useState('online');
    const [showList, setShowList] = useState([]);
    useEffect(() => {
        if (tab === 'online') {
            let onLineList = contactsList.length > 0 ? contactsList.filter(item => appUserInfo[item]?.online === 1) : [];
            setShowList(onLineList)
        } else if (tab === 'all') {
            setShowList(contactsList)
        }
    }, [appUserInfo, contactsList, tab])

    //搜索联系人，前端实现，按照昵称和用户名查询
    const [searchValue, setSearchValue] = useState('');
    const changeSearchValue = (e) => {
        setSearchValue(e.target.value);
    }
    const [searchList, setSearchList] = useState({});
    useEffect(() => {
        if (searchValue.replace(/(^\s*)|(\s*$)/g, "") !== "") {
            if (contactsList.length > 0) {
                const list = [];
                contactsList.forEach(item => {
                    if (appUserInfo[item]?.nickname.toLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1 || item.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1) {
                        list.push(item);
                    }
                })
                setSearchList(list)
            }
            searchValue !== "" && handleVisibleChange(true)
        } else {
            setSearchList([])
            handleVisibleChange(false)
        }
    }, [appUserInfo, contactsList, searchValue])
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (data) => {
        if (data) {
            searchValue !== "" && setVisible(data);
        } else {
            setVisible(data);
        }
    };

    //添加好友弹窗，弹窗打开自动聚焦
    const [showAddDialog, setShowAddDialog] = useState(false);
    const addContactEle = useRef();
    useEffect(() => {
        showAddDialog && addContactEle && addContactEle.current.focus();
    }, [showAddDialog])

    //好友id查找
    const [searchContact, setSearchContact] = useState('');
    const [showTips, setShowTips] = useState(false)
    const changeSearchContact = (e) => {
        setSearchContact(e.target.value);
    }
    //发送添加好友邀请
    const addContact = () => {
        if (searchContact === "") {
            return
        } else if (!/^1\d{10}$/.test(searchContact)) {
            message.warn({ content: "请输入合法手机号！" });
            return;
        } else if (searchContact === WebIM.conn.user) {
            message.warn({ content: "不可以添加自己为好友哦" });
            setSearchContact("");
            return
        } else if (contactsList.indexOf(searchContact) > -1) {
            message.warn({ content: "不能重复添加好友哦" });
            setSearchContact("");
            return
        }
        WebIM.conn.addContact(searchContact);
        setSearchContact("");
        showAddDialog && addContactEle && addContactEle.current.focus();
        setShowTips(true);
        setTimeout(() => {
            setShowTips(false);
        }, 2000)
    }

    //todo 点击聊天Icon,发起聊天
    const startChat = (uid) => {
        navigate(`/main/contacts/chat/${uid}`)
    }

    //删除联系人
    const deleteContact = (uid) => {
        WebIM.conn.deleteContact(uid);
    }
    //同意、拒绝添加联系人
    const handleApply = (operation, uid) => {
        if (operation === 'accept') {
            WebIM.conn.acceptContactInvite(uid);
        } else {
            WebIM.conn.declineContactInvite(uid);
            let applyList = [...applyInfo];
            const index = applyList.indexOf(uid);
            if (index > -1) {
                applyList.splice(index, 1);
                setApplyInfo(applyList);
            }
            message.warn({ content: "已拒绝申请" });
        }
    }

    const [hoverContactUid, setHoverContactUid] = useState('');
    const handlerContactHover = (uid) => {
        setHoverContactUid(uid)
    }
    const [hoverSearchUid, setHoverSearchUid] = useState('');
    const handlerSearchHover = (uid) => {
        setHoverSearchUid(uid)
    }
    const [hasFocus, setHasFocus] = useState(false);
    const changeBorder = (flag) => {
        setHasFocus(flag)
    }

    return (
        <div className={s.main}>
            <div className={s.top}>
                <div className={s.left}>
                    <Icon name="person_2" size="26px" />
                    <span className={s.contactsText}>我的好友</span>
                    <div className={s.buttonCon}>
                        <div className={`${s.button} ${tab === "online" ? s.selected : null}`} onClick={() => { setTab('online') }}>在线</div>
                        <div className={`${s.button} ${tab === "all" ? s.selected : null}`} onClick={() => { setTab('all') }}>全部</div>
                        <div className={`${s.button} ${tab === "request" ? s.selected : null}`} onClick={() => { setTab('request') }}>好友申请
                            {applyInfo.length > 0 && tab !== "request" && <span className={s.new}></span>}
                        </div>
                    </div>
                    <Popover overlayClassName={s.searchResultPop}
                        placement="bottomLeft"
                        trigger="click"
                        visible={visible}
                        onVisibleChange={handleVisibleChange}
                        content={<SearchResult
                            visible={visible}
                            appUserInfo={appUserInfo}
                            searchList={searchList}
                            hoverSearchUid={hoverSearchUid}
                            onHover={handlerSearchHover}
                            onChat={startChat}
                            onDelete={deleteContact} />}>
                        <div className={`${s.searchCon} ${hasFocus ? s.hasBorder : null}`}>
                            <Icon name="magnify" size="18px" color="#BDBDBD" iconClass={s.searchIcon} />
                            <input className={s.searchInput} value={searchValue} onChange={(e) => changeSearchValue(e)} placeholder={'搜索我的好友'}
                                onFocus={() => { changeBorder(true) }}
                                onBlur={() => { changeBorder(false) }}
                            ></input>
                            {searchValue !== "" && <span className={s.closeIconCon} onClick={(e) => { e.stopPropagation(); setSearchValue("") }}><Icon name="xmark_in_circle" size="20px" color="#BDBDBD" iconClass={s.deleteIcon} /></span>}
                        </div>
                    </Popover>
                </div>
                <div className={s.rightCon}>
                    <div className={`circleBtn ${s.right}`} onClick={() => setShowAddDialog(true)}>
                        <span className={s.addIcon}><Icon name="add_in_circle" size="22px" /></span>
                        <span className={s.addText}>添加好友</span>
                    </div>
                </div>
            </div>
            {tab === "request" ?
                <div className={s.content}>
                    {applyInfo.length > 0 ? applyInfo.map((item) => {
                        return (
                            <MemberItem info={appUserInfo[item]} uid={item} key={item} operationReactNode={<div className={s.applyOperation}>
                                <div className={`circleBtn66 circleBtnGray`} onClick={() => { handleApply('refuse', item) }}>拒绝</div>
                                <div className={`circleBtn66 circleBtn ${s.acceptButton}`} onClick={() => { handleApply('accept', item) }}>接受</div>
                            </div>} />
                        )
                    }) : emptyDom("没有待处理的好友申请")}
                </div> :
                <div className={s.content}>
                    {showList.length > 0 ? showList.map((item) => {
                        return (
                            <ContactEl
                                source="list"
                                visible={visible}
                                key={item} uid={item}
                                userInfo={appUserInfo[item]}
                                onChat={startChat}
                                onDelete={deleteContact}
                                hoverContactUid={hoverContactUid}
                                onHoverFn={handlerContactHover} />
                        )
                    }) : emptyDom("您还没有好友")}
                </div>}
            {showAddDialog && <div className={s.addContact}>
                <div className={s.dialog}>
                    <div className={s.title}>
                        <span>添加好友</span>
                        <span className={s.titleClose} onClick={() => setShowAddDialog(false)}>
                            <Icon name="xmark" color="#c7c7c7" size="18px" />
                        </span>
                    </div>
                    <div className={s.searchId}>
                        <input ref={addContactEle} className={s.searchInput2} value={searchContact} onChange={(e) => changeSearchContact(e)} placeholder={'输入环信ID'}></input>
                        <div className={`circleBtn106 circleBtn ${s.searchButton}  ${searchContact === "" ? "disable" : null}`} onClick={addContact}>发送好友请求</div>
                    </div>
                    {showTips && <div className={s.tips}>您的好友请求已发送</div>}
                </div>
            </div>}

        </div>
    );
};

const SearchResult = (props) => {
    const { searchList, onChat, onDelete, hoverSearchUid, onHover, appUserInfo, visible } = props;
    return (
        <div className={s.searchResult}>
            {searchList.length > 0 ? <div className={s.searchResultList}>
                {searchList.map((item) => {
                    return (
                        <ContactEl
                            source="search"
                            visible={visible}
                            key={item}
                            uid={item}
                            userInfo={appUserInfo[item]}
                            onChat={onChat}
                            onDelete={onDelete}
                            hoverSearchUid={hoverSearchUid}
                            onHoverFn={onHover} />
                    )
                })}
            </div> : <div className={s.noResult}>没有结果</div>}
            { }
        </div>
    )
}
//common 
const ContactEl = (props) => {
    const { source, uid, userInfo, onChat, onDelete, hoverContactUid, hoverSearchUid, onHoverFn } = props
    const memberParent = createRef();
    return (
        <MemberItem info={userInfo} key={uid} uid={uid} handlerHover={onHoverFn} basicShowOnline={true} operationReactNode={<div className={s.operation} ref={memberParent}>
            <Tooltip title="消息" overlayClassName="toolTip">
                <span className={`opBg ${s.chat} ${((hoverContactUid === uid && source === "list") || (hoverSearchUid === uid && source === "search")) ? s.focus : null}`} onClick={() => onChat(uid)}>
                    <span className={s.chatIcon}><Icon name="message_retangle" size="22px" iconClass='opIcon' /></span>
                </span>
            </Tooltip>
            <Dropdown overlay={menu(uid, onDelete)} placement="bottomRight" trigger={['click']} overlayClassName="circleDropDown"
                getPopupContainer={() =>
                    memberParent.current ? memberParent.current : document.body
                }>
                <span className={`opBg ${s.delete} ${((hoverContactUid === uid && source === "list") || (hoverSearchUid === uid && source === "search")) ? s.focus : null}`}>
                    <span className={s.deleteIcon}><Icon name="ellipsis" size="22px" iconClass='opIcon' /></span>
                </span>
            </Dropdown>
        </div>} />
    )
}

const mapStateToProps = ({ app, contact }) => {
    return {
        appUserInfo: app.appUserInfo,
        applyInfo: contact.applyInfo,
        contactsList: contact.contactsList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setContactsList: (params) => {
            return dispatch({
                type: "contact/setContactsList",
                payload: params
            });
        },
        setApplyInfo: (params) => {
            return dispatch({
                type: "contact/setApplyInfo",
                payload: params
            });
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ContactsOperation));

