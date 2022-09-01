import Icon from "@/components/Icon";
import { Menu } from 'antd';
const THREAD_OPERATION = {
    "threadMember": {
        id: "threadMember",
        name: "子区成员",
        iconName: "person_2"
    },
    "editThread": {
        id: "editThread",
        name: "编辑子区",
        iconName: "gear"
    },
    "leaveThread": {
        id: "leaveThread",
        name: "退出子区",
        iconName: "door"
    },
    "destroyThread": {
        id: "destroyThread",
        name: "删除子区",
        iconName: "trash"
    },
}
const getOperationEl = (opList, cb) => {
    const itemList = []
    opList.forEach((item) => {
        itemList.push({
            key: item,
            label: (
                <div className="circleDropItem">
                    <Icon name={THREAD_OPERATION[item].iconName} size="22px" iconClass="circleDropMenuIcon" />
                    <span className="circleDropMenuOp">{THREAD_OPERATION[item].name}</span>
                </div>
            ),
        })
    })
    return (
        <Menu items={itemList} onClick={cb} />
    )
}

export { THREAD_OPERATION, getOperationEl }