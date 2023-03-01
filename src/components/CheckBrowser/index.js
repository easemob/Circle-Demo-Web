import React, { memo } from "react";
import s from './index.module.less'

const CheckBrowser = () => {
    return (
        <div className={s.con}>
            <div className={s.tips}>你的浏览器不支持现代 CSS Selector，请使用现代浏览器（如 Chrome、Firefox 等等）。</div>
        </div>
    );
};

export default memo(CheckBrowser);
