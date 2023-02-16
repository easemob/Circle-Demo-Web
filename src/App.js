import { useEffect } from "react";
import "./App.less";
import { Provider } from "react-redux";
import store from "./store";
import Routes from "./routes";
import { ConfigProvider, message } from "antd";
import initListener from "./utils/WebIMListener";
import { Empty } from "antd";
import emptyIcon from "./assets/images/smile_dark.png";
import RtcRoom from "./layout/Channel/SideBar/components/RtcRoom/index"

const DefaultIcon = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${emptyIcon})`,
        height: "100%",
        width: "100%",
        backgroundSize: "cover"
      }}
    ></div>
  );
};
const renderEmptyDom = () => {
  return (
    <Empty
      image={<DefaultIcon />}
      imageStyle={{
        height: 60,
        width: 60
      }}
      description={<span></span>}
    ></Empty>
  );
};
message.config({
  duration: 3,
  maxCount: 2,
});

function App() {
  useEffect(() => {
    initListener();
  }, []);
  return (
    <ConfigProvider renderEmpty={renderEmptyDom} autoInsertSpaceInButton={false}
    theme={{
      token: {
        colorPrimary: '#27AE60',
      },
    }}>
      <div className="App">
        <Provider store={store}>
          <Routes />
          <RtcRoom/>
        </Provider>
      </div>
    </ConfigProvider>
  );
}

export default App;
