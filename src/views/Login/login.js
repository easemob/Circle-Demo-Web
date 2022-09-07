import style from "./login.module.less";
import { Input, Spin, message } from "antd";
import { useState, useCallback, memo, useEffect } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import WebIM from "@/utils/WebIM";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { LOGIN_PASSWORD } from "@/consts";

const LoadingIcon = () => {
  return (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "#fff"
      }}
    />
  )
}

const LOGIN = {
  loginText: "登录环信超级社区",
  usernamePlaceHolder: "请输入您的手机号",
  passwordPlaceHolder: "请输入密码",
  login: "登录"
};
let userInfos = JSON.parse(localStorage.getItem("userInfo")) || {};

function Login(props) {
  const {
    isLogging,
    loginSuccess,
    setUserInfo,
    setLoginStatus,
    appUserInfo,
    userInfo,
    setAppUserInfo
  } = props;

  let navigate = useNavigate();
  useEffect(() => {
    if (loginSuccess && isLogging) {
      setLoginStatus(false);
      navigate("/main", { replace: true });
    }
  }, [isLogging, loginSuccess, navigate, setLoginStatus]);
  const [inputValue, setInputValue] = useState(
    Object.assign(
      {
        username: "",
        password: "",
        agree: false
      },
      userInfos
    )
  );
  const handleInputChange = (prop) => (event) => {
    let value = event.target.value;
    if (prop === "username") {
      value = value.replace(/[^\d]/g, "");
    } else if (prop === "agree") {
      value = !inputValue.agree;
    }
    setInputValue({ ...inputValue, [prop]: value });
  };

  //login
  const login = useCallback(() => {
    //校验用户输入
    if (inputValue.username === "") return;
    if (!inputValue.username) {
      // !inputValue.password ||
      // inputValue.password.replace(/(^\s*)|(\s*$)/g, "") === ""
      message.warn({ content: "请输入用户名！" });
      return;
    } else if (!/^1\d{10}$/.test(inputValue.username)) {
      message.warn({ content: "请输入合法手机号！" });
      return;
    } else if (!inputValue.agree) {
      message.warn({
        content: (
          <span>
            体验本Demo您需要同意
            <a
              target="_blank"
              href="https://www.easemob.com/terms/im"
              rel="noreferrer"
            >
              《环信服务条款》
            </a>
            与
            <a
              target="_blank"
              href="https://www.easemob.com/protocol"
              rel="noreferrer"
            >
              《环信隐私协议》
            </a>
            。
          </span>
        )
      });
      return;
    }
    WebIM.conn
      .open({
        user: inputValue.username,
        pwd: LOGIN_PASSWORD
      })
      .then((res) => {
        const { accessToken } = res;
        const userInfos = {
          username: inputValue.username,
          accessToken,
          agree: true
        };
        //本地存储用户信息，下次登录自动填充
        localStorage.setItem("userInfo", JSON.stringify(userInfos));
        //store存储用户信息
        setUserInfo(userInfos);
        setLoginStatus(true);
        //销毁提示信息
        message.destroy();
        WebIM.conn.fetchUserInfoById(inputValue.username).then((res) => {
          const resInfo = { ...res.data[inputValue.username] };
          const info = { ...userInfos, ...resInfo };
          setUserInfo(info);
          localStorage.setItem("userInfo", JSON.stringify(info));
          const dl = { ...resInfo, uid: inputValue.username };
          setAppUserInfo({ ...appUserInfo, [inputValue.username]: dl });
        });
      })
      .catch((err) => {
        console.log(err, "err");
        const errInfo = err.data?.data ? JSON.parse(err.data.data) : "";
        if (errInfo.error_description === "user not found") {
          WebIM.conn
            .registerUser({
              username: inputValue.username,
              password: LOGIN_PASSWORD
            })
            .then((res) => {
              login();
            })
            .catch((e) => {
              setLoginStatus(false);
              message.warn({ content: "注册失败，请重试！" });
            });
        } else {
          setLoginStatus(false);
          message.warn({ content: "用户名或密码错误！" });
        }
      });
  }, [
    inputValue.username,
    inputValue.agree,
    setLoginStatus,
    setUserInfo,
    setAppUserInfo,
    appUserInfo
  ]);

  useEffect(() => {
    if (userInfo) {
      window.location = "/";
    }
  }, []);
  return (
    <div className={style.loginContainer}>
      <div className={style.loginLayout}>
        <div className={style.loginIcon}></div>
        <div className={style.loginText}>{LOGIN.loginText}</div>
        <div className={style.loginMain}>
          <Input
            disabled={isLogging}
            value={inputValue.username}
            className={`${style.usernameInput} ${isLogging ? style.isLoggingInput : null
              }`}
            placeholder={LOGIN.usernamePlaceHolder}
            allowClear={{
              clearIcon: (
                <Icon name="xmark_in_circle" color="#979797" size="22px"></Icon>
              )
            }}
            maxLength={11}
            onChange={handleInputChange("username")}
          />
          <div
            className={`${style.loginButton} ${inputValue.username === "" ? style.loginDisable : null
              }`}
            onClick={login}
          >
            {!isLogging ? (
              <span>{LOGIN.login}</span>
            ) : (
              <Spin indicator={<LoadingIcon />} />
            )}
          </div>
        </div>
        <div
          className={`${style.agreement} ${isLogging ? style.isLogging : null}`}
        >
          <p className={style.agreeText}>
            <span
              className={`${style.defaultIcon}`}
              onClick={handleInputChange("agree")}
            >
              {inputValue.agree ? (
                <Icon name="check_in_circle" size="22px" color="#16D265" />
              ) : (
                <Icon name="circle" size="22px" color="#979797" />
              )}
            </span>
            同意
            <a
              className={style.link}
              target="_blank"
              href="https://www.easemob.com/terms/im"
              rel="noreferrer"
            >
              《环信服务条款》
            </a>
            与
            <a
              className={style.link}
              target="_blank"
              href="https://www.easemob.com/protocol"
              rel="noreferrer"
            >
              《环信隐私协议》
            </a>
            ，
          </p>
          <p className={style.loginTips}>未注册手机号登陆成功后将自动注册。</p>
        </div>
      </div>
      <div className={style.version}>© 2022 环信</div>
    </div>
  );
}

const mapStateToProps = ({ app }) => {
  return {
    isLogging: app.isLogging,
    loginSuccess: app.loginSuccess,
    appUserInfo: app.appUserInfo,
    userInfo: app.userInfo
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
    }
  };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(Login));
