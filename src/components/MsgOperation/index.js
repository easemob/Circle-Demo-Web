import s from "./index.module.less";
import React, { memo, createRef } from "react";
import Icon from "@/components/Icon";
import { Dropdown, Menu, message, Tooltip } from "antd";
import EmojiPicker from "../Emoji";
import WebIM from "@/utils/WebIM";
import { addReactions } from "@/utils/common";
import { CopyToClipboard } from "react-copy-to-clipboard";

const antdMessage = message;
const Operation = (props) => {
  const { type, canCreateThread, parent, operation, message, source } = props;

  const OPERATION = {
    1: "recall",
    2: "copy"
  };
  const menu = (type) => {
    const itemList = [];
    if (message.from === WebIM.conn.user) {
      itemList.push({
        key: "1",
        label: (
          <div className="circleDropItem">
            <Icon
              name="arrow_back"
              size="24px"
              iconClass="circleDropMenuIcon"
            />
            <span className="circleDropMenuOp">撤回</span>
          </div>
        )
      });
    }
    if (type === "txt") {
      itemList.push({
        key: "2",
        label: (
          <CopyToClipboard
            text={message.msg}
            onCopy={() => console.log("已复制")}
          >
            <div className="circleDropItem">
              <Icon
                name="square_2-01"
                size="24px"
                iconClass="circleDropMenuIcon"
              />
              <span className="circleDropMenuOp">复制</span>
            </div>
          </CopyToClipboard>
        )
      });
    }
    return <Menu items={itemList} onClick={handleOperation} />;
  };
  const handleOperation = ({ key }) => {
    operation(OPERATION[key]);
  };

  const tipRef = createRef();

  const addReaction = (reaction) => {
    addReactions({
      messageId: message.id,
      reaction
    });
  };
  const showMoreIcon =
    message.type === "txt" ||
    (message.type !== "txt" && message.from === WebIM.conn.user);

  return (
    <div className={s.main}>
      <div className={s.list}>
        <div className={s.iconItem} ref={tipRef}>
          <EmojiPicker
            showFrequently={true}
            onEmojiSelect={(e) => {
              addReaction(e.id);
            }}
          >
            <Tooltip
              title="消息回应"
              overlayClassName="toolTip"
              getPopupContainer={() => {
                return tipRef.current;
              }}
            >
              <div>
                <Icon name={"emoji_plus"} size={"18px"} iconClass="messageOperationIcon"/>
              </div>
            </Tooltip>
          </EmojiPicker>
        </div>
        {
          source=== "groupChat" && <Tooltip title={canCreateThread ? "创建子区" : "显示子区"} overlayClassName="toolTip">
            <div
              className={s.iconItem}
              onClick={() => canCreateThread ? operation("createThread") : operation("openThreadPanel")}
            >
              <Icon name="hashtag_message" size="18px" iconClass="messageOperationIcon"/>
            </div>
          </Tooltip>
        }
        {showMoreIcon && (
          <Dropdown
            overlay={menu(type)}
            placement="bottomRight"
            trigger={["click"]}
            overlayClassName="circleDropDown"
            getPopupContainer={() =>
              parent.current ? parent.current : document.body
            }
          >
            <div className={s.iconItem}>
              <Icon name={"ellipsis"} size={"18px"} iconClass="messageOperationIcon"/>
            </div>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default memo(Operation);
