import React, { memo } from "react";
import s from "./index.module.less";
import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import Icon from "@/components/Icon";
import { USER_ROLE } from "@/consts";
import { connect } from "react-redux";

const MemberOpt = ({
  role,
  uid,
  serverId,
  isShowChat = true,
  menuItems = [],
  showOpIcon,
  setSelected,
  isServer,
  onMenuClick = () => { }
}) => {
  const navigate = useNavigate();
  const isCreator = role === USER_ROLE.owner;
  return (
    <div className={s.optWrap}>
      {role !== USER_ROLE.user && (
        <div className={`${s.role} ${isCreator ? s.creator : s.admin} `}
          style={{ marginRight: isServer ? "12px" : "8px" }}>
          {role === USER_ROLE.owner ? "创建者" : "管理员"}
        </div>
      )}
      {isShowChat && (
        <div
          className={`${isServer ? 'opBg' : s.iconWrap}`}
          style={{ marginRight: isServer ? "12px" : "8px" }}
          onClick={() => {
            setSelected("contacts");
            navigate(`/main/contacts/chat/${uid}`);
          }}
        >
          <Icon iconClass='opIcon' name="message_retangle" />
        </div>
      )}

      {showOpIcon && (
        <div className={`${isServer ? 'opBg' : s.iconWrap}`}>
          <Menu
            onClick={(e) => {
              onMenuClick(e, { uid, serverId });
            }}
            style={{ padding: 0 }}
            theme={"dark"}
            selectable={false}
            triggerSubMenuAction="click"
            mode="horizontal"
            items={menuItems}
          />
        </div>
      )}
    </div>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    setSelected: (params) => {
      return dispatch({
        type: "app/setSelectedTab",
        payload: params
      });
    }
  };
};
export default memo(connect(null, mapDispatchToProps)(MemberOpt));
