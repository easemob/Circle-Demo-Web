import React, { memo } from "react";
import s from "./index.module.less";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import { Switch, message } from 'antd';
import WebIM from "@/utils/WebIM";
import { updateServerDetail } from "@/utils/common"

const ServerSetting = (props) => {
    const { serverInfo } = props;
    const Header = () => {
        return (<div className={s.header}>
            <span className={s.icon}><Icon name="gear" size="24px" /></span>
            <span className={s.title}>社区设置</span>
        </div>)
    }
    const onChange = (checked) => {
        console.log(`switch to ${checked}`);
        WebIM.conn
            .updateServer({
                isPublic: checked,
                serverId: serverInfo.id
            })
            .then((res) => {
                message.success("编辑社区成功");
                updateServerDetail("edit", res.data);
            })
            .catch(() => {
                message.error("编辑社区失败");
            });
    };

    return (
        <div className={s.layout}>
            <HeaderWrap children={Header()} />
            <div className={s.main}>
                <div className={s.type}>
                    <div className={s.title}>社区类型</div>
                    <div className={s.setItem}>
                        <div className={s.content}>
                            <span className={s.isPublic}>是否为公开社区</span>
                            <Switch checked={serverInfo.isPublic} onChange={onChange} />
                        </div>
                    </div>
                    <div className={s.desc}>公开社区可以在广场中被搜到，私密社区不可以被搜到</div>
                </div>
            </div>
        </div>
    );
};
export default memo(ServerSetting);

