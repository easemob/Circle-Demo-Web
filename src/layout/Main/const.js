import Icon from "@/components/Icon";
import s from "./index.module.less";

const SERVER_ICON_MENU_TYPES = {
  setUnread: "setUnread",
  // setHasNotice: "setHasNotice",
  // setNoNotice: "setNoNotice",
};
const SERVER_ICON_MENU_CHILDREN = [
  {
    label: (
      <div className={s.menuWrap}>
        <div className={s.menuIcon}>
          <Icon name="msg_check-01" size="22px" />
        </div>
        <span className={s.menuText}>标记为已读</span>
      </div>
    ),
    key: SERVER_ICON_MENU_TYPES.setUnread
  },
  // {
  //   label: (
  //     <div className={`${s.menuWrap} ${s.noticeWrap}`}>
  //       <div className={s.menuIcon}>
  //         <Icon name="bell_gear" size="24px" />
  //       </div>
  //       <div className={s.noticeCon}>
  //         <span className={s.menuText}>通知设定</span>
  //         <span className={s.selected}>全部消息</span>
  //       </div>
  //       <div className={`${s.menuIcon} ${s.open}`}>
  //         <Icon name="shevron_right" size="16px" />
  //       </div>
  //     </div>
  //   ),
  //   popupoffset: [10, 0],
  //   children: [
  //     {
  //       label: (
  //         <div className={s.menuWrap}>
  //           <div className={s.subMenuWrap}>
  //             <span>所有消息</span>
  //             <Icon name="radio-01" size="16px" color="#27ae60" />
  //           </div>
  //         </div>
  //       ),
  //       key: SERVER_ICON_MENU_TYPES.setHasNotice
  //     },
  //     {
  //       label: (
  //         <div className={s.menuWrap}>
  //           <div className={s.subMenuWrap}>
  //             <span>无通知</span>
  //             <Icon name="circle" size="16px" color="#fff" />
  //           </div>
  //         </div>
  //       ),
  //       key: SERVER_ICON_MENU_TYPES.setNoNotice
  //     },
  //   ]
  // },
];

const getServeIconMenu = (label) => {
  return [{
    type: "group",
    label,
    children: SERVER_ICON_MENU_CHILDREN
  }]
}

export { SERVER_ICON_MENU_TYPES, SERVER_ICON_MENU_CHILDREN, getServeIconMenu };
