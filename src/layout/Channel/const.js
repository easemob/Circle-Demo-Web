import Icon from "@/components/Icon";
import s from "./index.module.less";
import { USER_ROLE } from "@/consts"

const SERVER_MENU_TYPES = {
  create: "create",
  viewMember: "viewMember",
  editServer: "editServer",
  dissolveServer: "dissolveServer",
  leaveServer: "leaveServer"
};

const SERVER_MENU_CHILDREN = [
  {
    label: (
      <div className={s.menuWrap}>
        <Icon name="add_in_circle" size="22px"/>
        <span>创建频道</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.create
  },
  {
    label: (
      <div className={s.menuWrap}>
        <Icon name="person_2" size="22px" />
        <span>查看社区成员</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.viewMember
  },
  {
    label: (
      <div className={s.menuWrap}>
        <Icon name="gear" size="22px" />
        <span>编辑社区</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.editServer
  },
  {
    label: (
      <div className={s.menuWrap}>
        <Icon name="trash"  size="22px" />
        <span>解散社区</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.dissolveServer
  },
  {
    label: (
      <div className={s.menuWrap}>
        <Icon name="door" size="22px" />
        <span>退出社区</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.leaveServer
  }
];
const getServerMenuChildren = (role) => {
  let menu = [];
  switch (role) {
    case USER_ROLE.owner:
      menu.push(SERVER_MENU_CHILDREN[0], SERVER_MENU_CHILDREN[1], SERVER_MENU_CHILDREN[2] , SERVER_MENU_CHILDREN[3])
      break;
    case USER_ROLE.moderator:
      menu.push(SERVER_MENU_CHILDREN[1], SERVER_MENU_CHILDREN[2], SERVER_MENU_CHILDREN[4])
      break;
    case USER_ROLE.user:
      menu.push(SERVER_MENU_CHILDREN[1], SERVER_MENU_CHILDREN[4])
      break;
    default:
      break;
  }
  return menu
}

export { SERVER_MENU_CHILDREN, SERVER_MENU_TYPES, getServerMenuChildren };
