import React, { memo } from "react";
import s from "./index.module.less";
import HeaderWrap from "@/components/HeaderWrap";
import AvatarInfo from "@/components/AvatarInfo";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import Icon from "@/components/Icon"
import { Menu } from "antd";
import WebIM from "@/utils/WebIM";


const ChannelHeader = (props) => {
  const { appUserInfo, conversationList, setConversationList } = props;
  const navigate = useNavigate();
  const { userId } = useParams();
  const onMenuClick = (e) => {
    if (e.key === "deleteConversation") {
      WebIM.conn.deleteConversation({
        channel: userId,
        chatType: 'singleChat',
        deleteRoam: false,
      }).then(() => {
        const findIndex = conversationList.indexOf(userId);
        if (findIndex > -1) {
          conversationList.splice(findIndex, 1);
          setConversationList(conversationList);
        }
        navigate("/main/contacts/index");
      })
    }
  }
  return (
    <HeaderWrap>
      <div className={s.wrap}>
        <div className={s.left}>
          <AvatarInfo size={36} online={appUserInfo[userId]?.online} src={appUserInfo[userId]?.avatarurl} />
          <span className={s.nickName}>{appUserInfo[userId]?.nickname || userId}</span>
        </div>
        <div className={s.op}>
          <Menu
            onClick={onMenuClick}
            style={{ padding: 0 }}
            theme={"dark"}
            selectable={false}
            triggerSubMenuAction="click"
            mode="horizontal"
            items={getChatItem()}
          ></Menu>
        </div>
      </div>
    </HeaderWrap>
  );
};
const getChatItem = () => {
  return [
    {
      label: (
        <div className={s.iconCon}>
          <Icon iconClass={s.icon} name="ellipsis" size="24px" />
        </div>
      ),
      key: "SubMenu",
      children: [
        {
          label: (
            <div className={s.menuWrap}>
              <Icon name="trash" size="16px" />
              <span>删除会话</span>
            </div>
          ),
          key: "deleteConversation"
        },
      ]
    }
  ];
};
const mapStateToProps = ({ app, contact }) => {
  return {
    appUserInfo: app.appUserInfo,
    conversationList: contact.conversationList
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setConversationList: (params) => {
      return dispatch({
        type: "contact/setConversationList",
        payload: params
      });
    },
  }
}
export default memo(connect(mapStateToProps, mapDispatchToProps)(ChannelHeader));