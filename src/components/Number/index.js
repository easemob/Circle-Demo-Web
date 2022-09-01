import styles from "./index.module.less";
import React, { memo } from "react";

const Number = (props) => {
    const { number, style = {} } = props
    return (
        <span className={styles.number} style={{...style}}>{number < 100 ? number : '99+'}</span>
    );
};

export default memo(Number);
