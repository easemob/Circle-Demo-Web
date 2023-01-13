import WebIM from "easemob-websdk";

WebIM.conn = new WebIM.connection({
 //Pass your appKey here.
  appKey: "your appKey",
  useOwnUploadFun: true
});

export default WebIM;
