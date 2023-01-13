import React, { memo } from "react";
import s from "./index.module.less";
import Icon from "../Icon";

const SideBar = (props) => {
    const { operationList, context, currentTab, onTabChange, goBack } = props
    return (
        <div className={s.sideBarWrap}>
            <div className={s.info}>
                <div className={s.goBack} onClick={goBack}>
                    <span className={s.iconStyle}>
                        <Icon name="shevron_left" size="24px" />
                    </span>
                    <span className={s.title}>{context}</span>
                </div>
                <div className={s.operationList}>
                    {operationList.length > 0 &&
                        operationList.map((item, index) => {
                            return (
                                <div key={item.op} className={`${s.operationItem}  ${currentTab === index ? s.selected : null}`} onClick={() => { onTabChange(index) }}>
                                    <span className={s.iconStyle}>
                                        <Icon name={item.iconName} size="24px" />
                                    </span>
                                    <span className={s.text}>{item.title}</span>
                                </div>
                            );
                        })}
                </div>
            </div>

        </div>
    );
};
export default memo(SideBar);
