import s from "./index.module.less";
import React, { memo } from "react";
import { Tooltip } from "antd";
import Icon from "../Icon";


const ResendMsg = (props) => {
    const { operation } = props;
    return (
        <div className={s.main}>
            <div className={s.list}>
                <Tooltip title="重新发送" overlayClassName="toolTip">
                    <div className={s.iconItem} onClick={() => { operation("reSend") }}>
                        <Icon name="hashtag_message" size="18px" iconClass="messageOperationIcon" />
                    </div>
                </Tooltip>
                <Tooltip title="删除" overlayClassName="toolTip" onClick={() => { operation("delete") }}>
                    <div className={s.iconItem}>
                        <Icon name="trash" size="18px" iconClass="messageOperationIcon" />
                    </div>
                </Tooltip>
            </div>
        </div>
    );
};

export default memo(ResendMsg);
