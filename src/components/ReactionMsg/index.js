import s from "./index.module.less";
import React, { memo, useMemo } from "react";
import EmojiPicker from "../Emoji";
import { renderTxt, addReactions, deleteReactions } from "@/utils/common";

const ReactionMsg = (props) => {
  const { reaction, msgId } = props;

  const reactions = useMemo(() => {
    return reaction.filter((item) => item.count > 0);
  }, [reaction]);

  const Emoji = (props) => {
    const { info } = props;
    return (
      <div
        onClick={() => {
          info.isAddedBySelf ? deleteReaction(info) : addReaction(info);
        }}
        className={`${s.con} ${info.isAddedBySelf ? s.active : ""}`}
      >
        <span>{renderTxt(info.reaction)}</span>
        <span>{info.count}</span>
      </div>
    );
  };

  const addReaction = ({ reaction }) => {
    addReactions({
      messageId: msgId,
      reaction
    });
  };

  const deleteReaction = ({ reaction }) => {
    deleteReactions({
      messageId: msgId,
      reaction: encodeURIComponent(reaction)
    });
  };

  return (
    <div className={s.main}>
      {reactions.map((item) => {
        return <Emoji info={item} key={item.reaction} />;
      })}
      {reactions?.length > 0 && (
        <div className={`${s.con} ${s.add}`} style={{ border: "none" }}>
          <EmojiPicker
            style={{ top: "30px", zIndex: 99 }}
            showFrequently={true}
            onEmojiSelect={(e) => {
              addReaction({ reaction: e.id });
            }}
          ></EmojiPicker>
        </div>
      )}
    </div>
  );
};

export default memo(ReactionMsg);
