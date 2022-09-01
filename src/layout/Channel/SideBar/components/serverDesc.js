import React, { memo, useState } from "react";
import s from "../index.module.less";
import Icon from "@/components/Icon";

const MAX_DESC_LENGTH = 38;

const ServerDesc = ({ desc = "" }) => {
  const [isExpand, setIsExpand] = useState(false);
  let isEllipsis = desc?.length > MAX_DESC_LENGTH;
  let ellipsisDesc = `${desc?.substring(0, MAX_DESC_LENGTH)}...`;

  const onExpand = () => {
    setIsExpand(!isExpand);
  };

  return (
    <div className={s.serverContentWrap}>
      <div className={s.desc}>
        <span>
          {!isExpand && isEllipsis ? ellipsisDesc : desc}
          {isEllipsis && (
            <div
              className={s.expandIcon}
              style={{ transform: isExpand ? "rotate(180deg)" : "rotate(0)" }}
              onClick={() => {
                onExpand();
              }}
            >
              <Icon name="shevron_down" />
            </div>
          )}
        </span>
      </div>
    </div>
  );
};

export default memo(ServerDesc);
