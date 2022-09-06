import React, { useEffect, useRef, useState, memo } from "react";
import { Popover } from "antd";
import s from "./index.module.less";
import Icon from "../Icon";
import { emojiConfig, emojiMap } from "@/consts/emoji";
import { setFrequentlyEmoji } from "@/utils/common";

const EmojiPanel = ({ onSelect, showFrequently }) => {
  const frequentlyEmoji =
    JSON.parse(localStorage.getItem("frequentlyEmoji")) || [];

  return (
    <div className={s.emojiContentWrap}>
      <div className={s.emojiContent}>
        {frequentlyEmoji.length ? (
          showFrequently && (
            <>
              <div className={s.title}>常用</div>
              <div className={s.freEmojiWrap}>
                {frequentlyEmoji.map((id) => {
                  return (
                    <div className={s.emojiItemWrap} key={id}>
                      <img
                        className={s.emoji}
                        width={20}
                        height={20}
                        key={id}
                        src={emojiMap.get(id)}
                        alt={id}
                        onClick={() => {
                          onSelect({
                            id: id
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className={s.title}>全部表情</div>
            </>
          )
        ) : (
          <></>
        )}
        <div className={s.allEmojiContent}>
          {emojiConfig.emojis.map((item) => {
            return (
              <div className={s.emojiItemWrap} key={item.id}>
                <img
                  className={s.emoji}
                  width={20}
                  height={20}
                  key={item.id}
                  src={item.src}
                  alt={item.id}
                  onClick={() => {
                    onSelect(item);
                  }}
                />
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

const EmojiPicker = (props) => {
  const [emojiVisible, setEmojiVisible] = useState(false);
  const { showFrequently = false, emojiIcon = "emoji_plus", disabled = false } = props;

  const wrapRef = useRef();

  const onSelect = (e) => {
    showFrequently && setFrequentlyEmoji(e.id);
    props?.onEmojiSelect(e);
    setEmojiVisible(false);
  };

  useEffect(() => {
    let onClick = (e) => {
      let dom = wrapRef.current;
      if (dom) {
        // 如果点击的区域不在自定义dom范围
        if (!dom.contains(e.target)) {
          setEmojiVisible(false);
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div ref={wrapRef} className={s.emojiWrap}>
      <div>
        <Popover
          content={
            <EmojiPanel showFrequently={showFrequently} onSelect={onSelect} />
          }
          trigger="click"
          visible={emojiVisible && !disabled}
          destroyTooltipOnHide={{ keepParent: false }}
          overlayClassName={s.emojiPopover}
          placement="bottomRight"
        >
          <div
            className={`${s.emojiIconCon}  ${disabled ? s.disable : null}`}
            onClick={() => {
              setEmojiVisible(!emojiVisible);
            }}
          >
            {props.children || (
              <Icon
                size={emojiIcon === "emoji_plus" ? "22px" : "30px"}
                iconClass={
                  emojiVisible
                    ? `${s.icon} ${s.active}`
                    : `${s.icon} ${s.normal}`

                }
                name={emojiIcon}
              />
            )}
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default memo(EmojiPicker);
