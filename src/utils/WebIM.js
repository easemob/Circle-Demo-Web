import WebIM from "./Easemob-chat";
// import WebIM from "easemob-websdk";

// WebIM.conn = new WebIM.connection({
//  Pass your appKey here.
//   // appKey: "your appKey",
//   appKey: "easemob-demo#jzz1",
//   url: "https://im-api-v2.easemob.com/ws",
//   apiUrl: "https://a1.easemob.com",
//   useOwnUploadFun: true
// });
WebIM.conn = new WebIM.connection({
  // appKey: "easemob-demo#jzz-hsb7",
  appKey: "easemob-demo#circle",
  isHttpDNS: false,
  url: "https://msync-api-a1-test.easemob.com/ws",
  apiUrl: "https://a1-test.easemob.com",
  useOwnUploadFun: true
});

export default WebIM;
