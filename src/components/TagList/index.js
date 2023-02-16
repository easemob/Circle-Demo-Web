import s from "./index.module.less";
import React, { memo, useEffect, useState, useRef, createRef } from "react";
import Icon from "@/components/Icon";
import { Tooltip } from "antd";

const TagList = (props) => {
    const { tags, isBar } = props;
    const tagList = createRef();
    const tagWrap = createRef();
    const moreRef = useRef(null);
    const [tagWidth, setTagWidth] = useState(0)
    const [showMore, setShowMore] = useState(false);
    const [showAllTags, setShowAllTags] = useState(false);

    useEffect(() => {
        let onClick = (e) => {
            let dom = moreRef.current;
            if (dom) {
                // 如果点击的区域不在自定义dom范围
                if (!dom.contains(e.target)) {
                    setShowAllTags(false);
                }
            }
        };
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, []);

    useEffect(() => {
        if (tagList.current.scrollHeight > 32) {
            setShowMore(true);
        } else {
            setShowMore(false)
        }
    }, [tagList])
    const showMoreTags = (e) => {
        e.stopPropagation();
        setShowAllTags(true);
        setTagWidth(tagWrap.current.clientWidth + 12);
    }
    const TagItem = ({ tag }) => {
        return (
            <div className={s.tag} key={tag.tagId}>
                <span className={s.tagIcon}><Icon name="label" color="#fff" size="14px" /></span>
                <span className={s.tagText}>{tag.tagName}</span>
            </div>
        )
    }
    return (
        <div className={`${s.main} ${isBar ? s.barList : null}`} ref={tagWrap}>
            <div className={`${s.list} ${showMore ? s.short : null} `} ref={tagList}>
                {tags && tags.length > 0 && tags.map((tag) => {
                    return (
                        <TagItem tag={tag} key={tag.tagName} />
                    )
                })}
            </div>
            {showMore && <Tooltip
                title="查看全部标签"
                overlayClassName="toolTip"
            >
                <div className={s.more} onClick={showMoreTags}>...</div>
            </Tooltip>}
            {showAllTags &&
                <div className={s.allListCon} ref={moreRef} onClick={(e) => { e.stopPropagation(); }}>
                    <div className={`${s.list} ${s.allList}`} style={{ width: isBar ? "268px" : tagWidth + 'px' }}>
                        {tags && tags.length > 0 && tags.map((tag) => {
                            return (
                                <TagItem tag={tag} key={tag.tagName} />
                            )
                        })}
                    </div>
                    <div className={s.closeBtn}>
                        <div onClick={(e) => { e.stopPropagation(); setShowAllTags(false) }} style={{ cursor: "pointer" }}>
                            <Icon name="shevron_up" size="16px" color="#fff" />
                            <span className={s.close}>收起</span>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default memo(TagList);
