import BasicInfo from '@/components/BasicInfo'
import AvatarInfo from '@/components/AvatarInfo'
import s from "./index.module.less";
import React, { memo, useRef, useState, useEffect } from "react";

const MemberItem = (props) => {
    const { info, uid, operationReactNode, handlerHover, borderType, basicShowOnline, size } = props;
    const memberItemRef = useRef();
    const [selected, setSelected] = useState(false);
    //点击消息
    useEffect(() => {
        let onClick = (e) => {
            let dom = memberItemRef.current;
            if (dom) {
                // 如果点击的区域不在自定义dom范围
                if (dom.contains(e.target)) {
                    setSelected(true)
                } else {
                    setSelected(false)
                }
            }
        };
        document.addEventListener("click", onClick);
        return () => {
            document.removeEventListener("click", onClick);
        };
    }, []);
    return (
        <div className={`memberItem ${s.contactsItem} ${selected ? s.selected : borderType === 2 ? s.contactsItem2 : null} `} onMouseOver={() => { handlerHover && handlerHover(info?.uid) }} onMouseLeave={() => { handlerHover && handlerHover("") }}>
            <div className={s.avatar}>
                <AvatarInfo size={size} name={info?.nickname || uid} src={info?.avatarurl} online={info?.online} />
            </div>
            <div className={`${s.mainInfo} ${borderType === 2 ? s.type2 : null}`}>
                <div className={s.basicInfo}>
                    <BasicInfo name={info?.nickname || uid} src={info?.avatarurl} online={info?.online} showOnline={basicShowOnline} />
                </div>
                <div className={s.operation} ref={memberItemRef}>
                    {operationReactNode}
                </div>
            </div>
        </div>
    );
};

export default memo(MemberItem);

