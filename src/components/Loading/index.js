import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./index.module.less";

const Loading = (props) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 28 }} spin />;
  return (
    <div className={styles.loadingWrap} style={props.style || {}}>
      <Spin
        style={{ color: "gray" }}
        indicator={antIcon}
        size="large"
        tip="loading"
        delay={100}
      />
    </div>
  );
};

export default Loading;
