import WebIM from "./Easemob-chat";

WebIM.conn = new WebIM.connection({
  appKey: "easemob-demo#jzz1",
  url: "https://im-api-v2.easemob.com/ws",
  apiUrl: "https://a1.easemob.com",
  // appKey: "easemob-demo#circle",
  // url: "https://msync-api-a1-test.easemob.com/ws",
  // apiUrl: "https://a1-test.easemob.com",
  isHttpDNS: false,
  useOwnUploadFun: true
});

export default WebIM;
