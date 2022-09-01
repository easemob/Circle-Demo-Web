import Icon from "@/components/Icon";

import cover01 from "@/assets/images/cover01.png";
import cover02 from "@/assets/images/cover02.png";
import cover03 from "@/assets/images/cover03.png";
import cover04 from "@/assets/images/cover04.png";
import cover05 from "@/assets/images/cover05.png";
import cover06 from "@/assets/images/cover06.png";
import cover07 from "@/assets/images/cover07.png";
import cover08 from "@/assets/images/cover08.png";
import cover09 from "@/assets/images/cover09.png";
const SERVER_OPT_TYPE = {
  create: "create",
  edit: "edit"
};

const REACTION_TYPE = {
  create: "create"
};

const USER_ROLE = {
  owner: "owner",
  user: "user",
  moderator: "moderator"
};

const ERROR_CODE = {
  noAuth: "token not assign error",
  loginFailed: "login failed",
  notLogin: "not login",
  recallTimeout: "exceed recall time limit",
  userNotFound: "user not found",
  invalidPassword: "invalid password",
  registerUnique: "duplicate_unique_property_exists",
  sendMsgBlock: "blocked",
  muted: "you were muted",
  trafficLimit: "traffic limit",
};

const CHAT_TYPE = {
  single: "singleChat",
  groupChat: "groupChat"
};
const INVITE_TYPE = {
  inviteServer: "invite_server",
  inviteChannel: "invite_channel"
};
const ACCEPT_INVITE_TYPE = {
  acceptInviteServer: "join_server",
  acceptInviteChannel: "join_channel"
};

const MESSAGE_ITEM_SOURCE = {
  single: "singleChat",
  groupChat: "groupChat",
  threadChat: "threadChat",
  threadParentMsg: "threadParentMsg"
};

const SCROLL_WARP_ID = "scrollMsgWrapId";

const CHANNEL_EVENT = {
  destroy: "destroy",
  update: "update",
  removed: "removed",
  inviteToJoin: "inviteToJoin",
  memberPresence: "memberPresence",
  memberAbsence: "memberAbsence",
  muteMember: "muteMember",
  unmuteMember: "unmuteMember",
  rejectInvite: "rejectInvite",
  acceptInvite: "acceptInvite"
};

const MULTI_DEVICE_EVENT = {
  serverCreate: "serverCreate",
  serverDestroy: "serverDestroy",
  serverUpdate: "serverUpdate",
  serverJoin: "serverJoin",
  serverRemoved: "serverRemoved",
  serverLeave: "serverLeave",
  serverRemoveMember: "serverRemoveMember",
  serverInviteUser: "serverInviteUser",
  serverAcceptInvite: "serverAcceptInvite",
  serverRefuseInvite: "serverRefuseInvite",
  serverSetRole: "serverSetRole",

  channelCreate: "channelCreate",
  channelDestroy: "channelDestroy",
  channelUpdate: "channelUpdate",
  channelJoin: "channelJoin",
  channelLeave: "channelLeave",
  channelRemoveMember: "channelRemoveMember",
  channelInviteUser: "channelInviteUser",
  channelMuteMember: "channelMuteMember",
  channelUnMuteMember: "channelUnMuteMember",
  channelAcceptInvite: "channelAcceptInvite",
  channelRejectInvite: "channelRejectInvite",

  chatThreadCreate: "chatThreadCreate",
  chatThreadDestroy: "chatThreadDestroy",
  chatThreadJoin: "chatThreadJoin",
  chatThreadLeave: "chatThreadLeave"
};

const CHAT = {
  label: (
    <div style={{ width: "222px" }}>
      <Icon name="message" size="18px" />
      <span>发起私聊</span>
    </div>
  ),
  key: "chat"
};

const UN_MUTE = {
  label: (
    <div>
      <Icon name="person_wave" size="18px" />
      <span>取消禁言</span>
    </div>
  ),
  key: "unmute"
};

const MUTE = {
  label: (
    <div>
      <Icon name="person_wave_slash" size="18px" />
      <span>成员禁言</span>
    </div>
  ),
  key: "mute"
};

const KICK = {
  label: (
    <div>
      <Icon name="minus_in_circle" size="18px" />
      <span>踢出频道</span>
    </div>
  ),
  key: "kick"
};

const SERVER_COVER_MAP = {
  cover01: cover01,
  cover02: cover02,
  cover03: cover03,
  cover04: cover04,
  cover05: cover05,
  cover06: cover06,
  cover07: cover07,
  cover08: cover08,
  cover09: cover09
};

const LOGIN_PASSWORD = "1";

const THREAD_PAGE_SIZE = 10;

export {
  SERVER_OPT_TYPE,
  USER_ROLE,
  ERROR_CODE,
  CHAT_TYPE,
  MESSAGE_ITEM_SOURCE,
  INVITE_TYPE,
  ACCEPT_INVITE_TYPE,
  SCROLL_WARP_ID,
  MULTI_DEVICE_EVENT,
  CHANNEL_EVENT,
  CHAT,
  UN_MUTE,
  MUTE,
  KICK,
  REACTION_TYPE,
  SERVER_COVER_MAP,
  LOGIN_PASSWORD,
  THREAD_PAGE_SIZE
};
