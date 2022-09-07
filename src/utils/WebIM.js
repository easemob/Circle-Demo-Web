// import WebIM from "./Easemob-chat";//js 方式引入
import WebIM from "easemob-websdk";

WebIM.conn = new WebIM.connection({
  appKey: "your appKey",
  useOwnUploadFun: true
});

export default WebIM;
