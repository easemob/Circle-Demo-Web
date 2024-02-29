// import WebIM from "./Easemob-chat";
import WebIM from "easemob-circle/circleSdk/Easemob-chat";

WebIM.conn = new WebIM.connection({
//  Pass your appKey here.
  appKey: "Your appKey",
});

export default WebIM;
