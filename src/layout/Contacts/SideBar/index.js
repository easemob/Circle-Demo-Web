import React, { memo, useEffect } from "react";
import { connect } from "react-redux";
import s from "./index.module.less";
import Number from "@/components/Number";
import AvatarInfo from "@/components/AvatarInfo";
import WebIM from "@/utils/WebIM";
import { getUsersInfo } from "@/utils/common";
import Icon from "@/components/Icon";
import { useNavigate, useParams } from "react-router-dom";
import { CHAT_TYPE } from "@/consts";

const SideBar = (props) => {
  const { applyNum, chatMap, conversationData, appUserInfo, setConversationList, setUnReadNumber } = props;
  const navigate = useNavigate();

  const { userId } = useParams();

  const toChat = (uid) => {
    navigate(`/main/contacts/chat/${uid}`);
  };

  const toContacts = () => {
    navigate(`/main/contacts/index`);
  };
  const getUnReadNum = (id) => {
    return chatMap[CHAT_TYPE.single]?.get(id)?.unReadNum || 0;
  }

  useEffect(() => {
    if (conversationData.length > 0) return;
    WebIM.conn.getConversationlist().then((res) => {
      const { channel_infos } = res.data;
      const conversationList = [];
      channel_infos &&
        channel_infos.forEach((element) => {
          const { channel_id } = element;
          if (channel_id.indexOf("@conference.easemob.com") <= -1) {
            const idStr = channel_id.split("_")[1];
            const username = idStr.substring(0, idStr.indexOf("@easemob.com"));
            conversationList.push(username);
            if (element.unread_num > 0) {
              setUnReadNumber({
                chatType: CHAT_TYPE.single,
                fromId: username,
                number: element.unread_num,
              })
            }
          }
        });
      conversationList.length > 0 && getUsersInfo(conversationList);
      setConversationList(conversationList);
    });
  }, []);
  return (
    <div className={s.sideBarWrap}>
      <div className={s.topBar}>
        <div
          className={!userId ? `${s.bar} ${s.active}` : `${s.bar}`}
          onClick={toContacts}
        >
          <div className={`${s.contacts}`}>
            <span className={s.personIcon}><Icon name="person_2" size="26px" /></span>
            <span className={s.contactsText}>我的好友</span>
          </div>
          {applyNum > 0 && <Number number={applyNum} />}
        </div>
      </div>
      <div className={s.title}>我的消息</div>
      <div className={s.list}>
        {conversationData?.length > 0 ?
          conversationData.map((item, index) => {
            return (
              <div
                className={`${s.bar} ${s.contactsItem} ${index !== 0 ? s.item : ""
                  } ${userId === item ? s.active : ""}`}
                key={index}
                onClick={() => {
                  toChat(item);
                }}
              >
                <div className={s.contacts}>
                  <AvatarInfo
                    size={36}
                    src={appUserInfo[item]?.avatarurl}
                    online={appUserInfo[item]?.online || 0}
                  />
                  <span className={s.contactsText}>{appUserInfo[item]?.nickname || item}</span>
                </div>
                {getUnReadNum(item) > 0 && (
                  <Number number={getUnReadNum(item)} />
                )}
              </div>
            );
          }) : <div className={s.empty}>您还没有会话</div>}
      </div>
    </div>
  );
};

const mapStateToProps = ({ app, contact }) => {
  return {
    appUserInfo: app.appUserInfo,
    chatMap: app.chatMap,
    applyNum: contact.applyInfo.length,
    conversationData: contact.conversationList
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
    setUnReadNumber: (params) => {
      return dispatch({
        type: "app/setUnReadNumber",
        payload: params
      });
    }
  };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(SideBar));
