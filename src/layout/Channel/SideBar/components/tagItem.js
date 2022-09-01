import React, { memo } from "react";
import s from "../index.module.less";

const TagItem = ({ item }) => {
  return (
    <div key={item.tagId} className={s.tagItem}>
      {item.tagName}
    </div>
  );
};

export default memo(TagItem);
