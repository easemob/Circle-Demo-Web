// import WebIM from "./Easemob-chat";
import WebIM from "easemob-websdk";

WebIM.conn = new WebIM.connection({
  appKey: "your appKey",
  useOwnUploadFun: true
});

export default WebIM;
