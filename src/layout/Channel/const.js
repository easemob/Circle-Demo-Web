import Icon from "@/components/Icon";
import s from "./index.module.less";
import { USER_ROLE } from "@/consts"

const SERVER_MENU_TYPES = {
  create: "create",
  createChannelCategory: "createChannelCategory",
  viewMember: "viewMember",
  notice1: "notice1",
  notice2: "notice2",
  serverSetting: "serverSetting",
  leaveServer: "leaveServer",
};
const SERVER_MENU_CHILDREN = [
  {
    label: (
      <div className={s.menuWrap}>
        <span className={s.menuIcon}>
          <Icon name="add_in_circle" size="22px" />
        </span>
        <span className={s.menuText}>创建频道</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.create
  },
  {
    label: (
      <div className={s.menuWrap}>
        <span className={s.menuIcon}>
          <Icon name="group" size="22px" />
        </span>
        <span className={s.menuText}>创建频道分组</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.createChannelCategory
  },
  {
    label: (
      <div className={s.menuWrap}>
        <span className={s.menuIcon}>
          <Icon name="person_2" size="22px" />
        </span>
        <span className={s.menuText}>查看社区成员</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.viewMember
  },
  {
    label: (
      <div className={s.menuWrap}>
        <span className={s.menuIcon}>
          <Icon name="gear" size="22px" />
        </span>
        <span className={s.menuText}>社区设置</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.serverSetting
  },
  {
    label: (
      <div className={s.menuWrap}>
        <span className={s.menuIcon}>
          <Icon name="door" size="22px" />
        </span>
        <span className={s.menuText}>退出社区</span>
      </div>
    ),
    key: SERVER_MENU_TYPES.leaveServer
  }
];
const getServerMenuChildren = (role) => {
  let menu = [];
  switch (role) {
    case USER_ROLE.owner:
      menu.push(SERVER_MENU_CHILDREN[0], SERVER_MENU_CHILDREN[1], SERVER_MENU_CHILDREN[2], SERVER_MENU_CHILDREN[3])
      break;
    case USER_ROLE.moderator:
      menu.push(SERVER_MENU_CHILDREN[2], SERVER_MENU_CHILDREN[3], SERVER_MENU_CHILDREN[4])
      break;
    case USER_ROLE.user:
      menu.push(SERVER_MENU_CHILDREN[2], SERVER_MENU_CHILDREN[4])
      break;
    default:
      break;
  }
  return menu
}

const CHANNEL_MENU_TYPES = {
  invite: "invite",
  setUnread: "setUnread",
  editChannel: "editChannel",
  transferChannelCategory: "transferChannelCategory",
}

const CHANNEL_MENU_CHILDREN = [
  {
    label: (
      <div className={s.menuWrap}>
        <div className={s.menuIcon}>
          <Icon name="person_plus" size="22px" />
        </div>
        <span className={s.menuText}>邀请好友</span>
      </div>
    ),
    key: CHANNEL_MENU_TYPES.invite
  },
  {
    label: (
      <div className={s.menuWrap}>
        <div className={s.menuIcon}>
          <Icon name="msg_check-01" size="22px" />
        </div>
        <span className={s.menuText}>标记为已读</span>
      </div>
    ),
    key: CHANNEL_MENU_TYPES.setUnread
  },
  {
    label: (
      <div className={`${s.menuWrap}`}>
        <div className={s.menuIcon}>
          <Icon name="a-2_arrows-01" size="22px" />
        </div>
        <span className={s.menuText}>移动频道至</span>
        <div className={`${s.menuIcon} ${s.open}`}>
          <Icon name="shevron_right" size="16px" />
        </div>
      </div>
    ),
    popupoffset: [10, 0],
    children: [],
    popupClassName: "subMenuStyle",
  },
  {
    label: (
      <div className={s.menuWrap}>
        <div className={s.menuIcon}>
          <Icon name="msg_check-01" size="22px" />
        </div>
        <span className={s.menuText}>编辑频道</span>
      </div>
    ),
    key: CHANNEL_MENU_TYPES.editChannel
  }
];

/**
 * 
 * @param {*} mode 频道类型
 * @param {*} channelCategoryId 所属分组Id
 * @param {*} role 角色
 * @param {*} pos 位置 "list"-频道列表  "bar"-导航处
 * @param {*} categorylist 分组列表
 * @returns 
 */
const getChannelMenu = ({isInRtcChannel=false, mode = 0, channelCategoryId, role, pos, categorylist=[]}) => {
  const items = [];
  if (pos === "bar") {
    CHANNEL_MENU_CHILDREN[2].popupOffset = [15, 0];
    // CHANNEL_MENU_CHILDREN[3].popupoffset = [15, 0];
  } else {
    CHANNEL_MENU_CHILDREN[2].popupOffset = [10, 0];
    // CHANNEL_MENU_CHILDREN[3].popupoffset = [10, 0];
  }
  switch (mode) {
    case 0:
      // if (pos !== "bar") {
        items.push(CHANNEL_MENU_CHILDREN[1]);
      // }
      if (role !== USER_ROLE.user) {
        const children = getCategoryDetail(channelCategoryId, categorylist);
        const key = channelCategoryId + 'trans'
        items.push({
          ...CHANNEL_MENU_CHILDREN[2],
          children,
          key,
        })
        if (pos !== "bar") {
          items.push(CHANNEL_MENU_CHILDREN[3])
        }
      }
      break;
    case 1:
      if(isInRtcChannel){
        items.push(CHANNEL_MENU_CHILDREN[0]);
      }
      if (role !== USER_ROLE.user) {
        const children = getCategoryDetail(channelCategoryId, categorylist);
        const key = channelCategoryId + 'trans'
        items.push({
          ...CHANNEL_MENU_CHILDREN[2],
          children,
          key,
        })
        if (pos !== "right") {
          items.push(CHANNEL_MENU_CHILDREN[3])
        }
      }
      break;
    default:
      break;
  }
  return items
}
const getCategoryDetail = (channelCategoryId, categorylist) => {
  const details = [];
  categorylist.forEach((item) => {
    details.push(
      {
        label: (
          <div className={`${s.menuWrap} ${item.id === channelCategoryId ? s.disable : null}`}>
            <div className={s.subMenuWrap}>
              <span className={s.name}>{item.defaultChannelCategory === 1 ? "不属于任何分组" : item.name}</span>
            </div>
          </div>
        ),
        key: item.id,
        disabled: item.id === channelCategoryId ? true : false,
      }
    )
  })
  return details;
}
const CATEGORY_MENU_TYPES = {
  edit: "edit",
  delete: "delete"
}
//分组操作菜单
const getCategoryMenu = (role) => {
  const items = [
    {
      label: (
        <div className={s.menuWrap}>
          <div className={s.menuIcon}>
            <Icon name="gear" size="22px" />
          </div>
          <span className={s.menuText}>编辑分组</span>
        </div>
      ),
      key: CATEGORY_MENU_TYPES.edit
    }];
  if (role === USER_ROLE.owner) {
    items.push({
      label: (
        <div className={s.menuWrap}>
          <div className={s.menuIcon}>
            <Icon name="trash" size="22px" />
          </div>
          <span className={s.menuText}>删除分组</span>
        </div>
      ),
      key: CATEGORY_MENU_TYPES.delete
    })
  }
  return items;
}

const RTC_MEMBER_MENU = {
  chat: "chat",
  delete: "delete",
}
//语聊房成员操作菜单
const getRtcMemberMenu = (role, userInfo) => {
  const items = [
    {
      label: (
        <div className={s.menuWrap}>
          <div className={s.menuIcon}>
            <Icon name="message" size="26px" />
          </div>
          <span className={s.menuText}>发起私聊</span>
        </div>
      ),
      key: RTC_MEMBER_MENU.chat
    }];
  if (role === USER_ROLE.owner || (role === USER_ROLE.role && userInfo.role === USER_ROLE.user)) {
    items.push({
      label: (
        <div className={s.menuWrap}>
          <div className={s.menuIcon}>
            <Icon name="power_line-01" size="26px" />
          </div>
          <span className={s.menuText}>踢出频道</span>
        </div>
      ),
      key: RTC_MEMBER_MENU.delete
    })
  }
  return items;
}

export {
  SERVER_MENU_CHILDREN,
  SERVER_MENU_TYPES,
  getServerMenuChildren,
  CHANNEL_MENU_TYPES,
  getChannelMenu,
  CATEGORY_MENU_TYPES,
  getCategoryMenu,
  RTC_MEMBER_MENU,
  getRtcMemberMenu
};
