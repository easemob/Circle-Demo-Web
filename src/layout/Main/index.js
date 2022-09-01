import React, { memo, useEffect } from "react";
import { Layout } from "antd";
import ScrollBar from "./ScrollBar";
import { Outlet, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import WebIM from "@/utils/WebIM";
import ServerForm from "./ServerForm/modal";
import ChannelFormModal from "@/views/Channel/components/ChannelForm/modal";

const { Sider } = Layout;
const MainLayout = (props) => {
  const { loginSuccess, setUserInfo, setLoginStatus, appUserInfo, setAppUserInfo } = props;

  let navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!loginSuccess && userInfo.accessToken !== "") {
      //自动登录
      setLoginStatus(true);
      WebIM.conn
        .open({
          user: userInfo.username,
          accessToken: userInfo.accessToken
        })
        .then((res) => {
          setLoginStatus(false);
          setUserInfo(userInfo);
          const { nickname, avatarurl } = userInfo;
          const dl = {
            nickname,
            avatarurl,
            uid: userInfo.username
          }
          setAppUserInfo({ ...appUserInfo, [userInfo.username]: dl });
        })
        .catch((e) => {
          setLoginStatus(false);
          navigate("/login");
        });
    }
  }, []);

  return (
    <Layout style={{ background: "#202124" }}>
      {loginSuccess && (
        <>
          <Sider
            style={{
              height: "100vh",
              boxSizing: "border-box"
            }}
            width={72}
          >
            <ScrollBar />
          </Sider>
          <Outlet />
          <ServerForm />
          <ChannelFormModal />
        </>
      )}
    </Layout>
  );
};

const mapStateToProps = ({ app }) => {
  return {
    userInfo: app.userInfo,
    loginSuccess: app.loginSuccess,
    appUserInfo: app.appUserInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginStatus: (params) => {
      return dispatch({
        type: "app/setLoginStatus",
        payload: params
      });
    },
    setUserInfo: (params) => {
      return dispatch({
        type: "app/setUserInfo",
        payload: params
      });
    },
    setAppUserInfo: (params) => {
      return dispatch({
        type: "app/setAppUserInfo",
        payload: params
      });
    },
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(MainLayout));
