import React, { useRef, useState, memo, useEffect, useCallback } from "react";
import ContentEditable from "react-contenteditable";
import s from "./index.module.less";
import { Dropdown, Menu, Upload, message } from "antd";
import {
  scrollToBottom,
  convertToMessage,
  renderHtml,
  getEmojiHtml
} from "@/utils/common";
import { SCROLL_WARP_ID } from "@/consts";
import {
  createMsg,
  deliverMsg,
  pasteHtmlAtCaret,
  formatImFile
} from "@/utils/common";
import { connect } from "react-redux";
import Icon from "../Icon";
import EmojiPicker from "../Emoji";
import WebIM from "@/utils/WebIM";

const EnterKeyCode = 13;

const scrollBottom = () => {
  setTimeout(() => {
    scrollToBottom(document.getElementById(SCROLL_WARP_ID));
  }, 300);
};

const Input = (props) => {
  const {
    fromId,
    chatType,
    isThread,
    isCreatingThread,
    threadName,
    currentThreadInfo,
    updateChatMessageUrl,
    updateChatThreadMessageUrl,
    updateChatMessageId,
    updateChatThreadMessageId,
    setThreadInfo,
  } = props;
  const [text, setText] = useState("");
  const ref = useRef("");
  // 定义光标对象
  const lastEditRangeRef = useRef();

  const idRef = useRef(fromId);

  const setLastRange = () => {
    // 获取选定对象
    let selection = getSelection();
    // 设置最后光标对象
    lastEditRangeRef.current = selection.getRangeAt(0);
  };

  const onChange = (e) => {
    setText(e.target.value);
  };

  const beforeUploadImg = async (file) => {
    const localUrl = window.URL.createObjectURL(file);
    let resFile = file;
    let imgMsg = {}
    const getImgMsg = (target) => {
      return createMsg({
        chatType: chatType,
        type: "img",
        to: target,
        isChatThread: props.isThread,
        file: formatImFile(resFile),
        onFileUploadError: function (e) {
          // 消息上传失败
          console.log("onFileUploadError", e);
          //更新id status
          if (props.isThread) {
            updateChatThreadMessageId({ id: imgMsg.localId, to: imgMsg.to, status: "failed" })
          } else {
            updateChatMessageId({ id: imgMsg.localId, to: imgMsg.to, status: "failed" })
          }
        },
        onFileUploadProgress: function (progress) {
          // 上传进度的回调
          console.log(progress);
        },
        onFileUploadComplete: function (e) {
          // 消息上传成功
          console.log("onFileUploadComplete", e, imgMsg);
          if (props.isThread) {
            updateChatThreadMessageUrl({
              id: imgMsg.id,
              to: imgMsg.to,
              url: e.url
            })
          } else {
            updateChatMessageUrl({
              id: imgMsg.id,
              to: imgMsg.to,
              url: e.url
            })
          }
        }
      });
    };
    getTarget().then((target) => {
      imgMsg = getImgMsg(target);
      imgMsg.localUrl = localUrl;
      imgMsg.localId = imgMsg.id;
      // 发送图片消息
      deliverMsg({ msg: imgMsg, needShow: true }).then();
      if (!props.isThread) {
        scrollBottom();
      }
    });
  };

  const beforeUploadFile = (file) => {
    const localUrl = window.URL.createObjectURL(file);
    const getFileMsg = (target) => {
      return createMsg({
        chatType: chatType,
        type: "file",
        to: target,
        isChatThread: props.isThread,
        file: formatImFile(file),
        filename: file.name,
        ext: {
          file_length: file.size,
          file_type: file.type,
        },
        onFileUploadError: function (e) {
          // 消息上传失败
          console.log("onFileUploadError", e);
          //更新id status
          updateChatMessageId({ id: fileMsg.localId, to: fileMsg.to, status: "failed" })
        },
        onFileUploadProgress: function (progress) {
          // 上传进度的回调
          console.log(progress);
        },
        onFileUploadComplete: function (e) {
          // 消息上传成功
          console.log("onFileUploadComplete", e);
          if (props.isThread) {
            updateChatThreadMessageUrl({
              id: fileMsg.id,
              to: fileMsg.to,
              url: e.url
            })
          } else {
            updateChatMessageUrl({
              id: fileMsg.id,
              to: fileMsg.to,
              url: e.url
            })
          }
        }
      });
    };
    let fileMsg = {}
    getTarget().then((target) => {
      fileMsg = getFileMsg(target);
      fileMsg.localUrl = localUrl;
      fileMsg.localId = fileMsg.id;
      deliverMsg({ msg: fileMsg, needShow: true }).then();
      if (!props.isThread) {
        scrollBottom();
      }
    });
  };
  const menu = (
    <Menu
      items={[
        {
          key: "img",
          label: (
            <Upload
              beforeUpload={beforeUploadImg}
              accept="image/*"
              maxCount={1}
              showUploadList={false}
              className={s.upload}
            >
              <div className="circleDropItem">
                <Icon name="img" size="24px" iconClass="circleDropMenuIcon" />
                <span className="circleDropMenuOp">发送图片</span>
              </div>
            </Upload>
          )
        },
        {
          key: "file",
          label: (
            <Upload
              beforeUpload={beforeUploadFile}
              accept="*"
              maxCount={1}
              showUploadList={false}
              className={s.upload}
            >
              <div className="circleDropItem">
                <Icon name="clip" size="24px" iconClass="circleDropMenuIcon" />
                <span className="circleDropMenuOp">发送附件</span>
              </div>
            </Upload>
          )
        }
      ]}
    />
  );

  //创建thread，返回target
  const getTarget = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (isCreatingThread && isThread) {
        //创建thread
        if (!threadName) {
          message.warn({ content: "子区名称不能为空！" });
          return;
        }
        const options = {
          name: threadName.replace(/(^\s*)|(\s*$)/g, ""),
          messageId: currentThreadInfo.parentMessage.id,
          parentId: idRef.current
        };
        WebIM.conn.createChatThread(options).then((res) => {
          const threadId = res.data?.chatThreadId;
          setThreadInfo({
            threadInfo: { ...currentThreadInfo, 
              id:threadId,
              name:options.name,
              owner:WebIM.conn.user,
              parentId:options.parentId,
            },
            clearHistory: true
          });
          resolve(threadId);
        });
      } else if (isThread) {
        //发送thread消息
        resolve(currentThreadInfo.id);
      } else {
        //发送非thread消息
        resolve(idRef.current);
      }
    });
  }, [
    currentThreadInfo?.id,
    currentThreadInfo?.parentMessage?.id,
    isCreatingThread,
    isThread,
    threadName
  ]);

  //发消息
  const sendMessage = useCallback(() => {
    if (!text) return;
    getTarget().then((target) => {
      let msg = createMsg({
        chatType,
        type: "txt",
        to: target,
        msg: convertToMessage(ref.current.innerHTML),
        isChatThread: props.isThread
      });
      setText("");
      msg.localId = msg.id;
      deliverMsg({ msg, needShow: true }).then();
      if (!props.isThread) {
        scrollBottom()
      }
    });
  }, [text, props, getTarget, chatType]);

  //键盘enter事件
  const onKeyDown = useCallback(
    (e) => {
      if (e.keyCode === EnterKeyCode) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  const insertNode = (e) => {
    pasteHtmlAtCaret(e, lastEditRangeRef?.current);
  };

  const onEmojiSelect = (e) => {
    ref.current.focus();
    let img = document.createElement("img");
    img.src = e.src;
    insertNode(
      getEmojiHtml({
        src: e.src,
        dataKey: e.id,
        alt: e.id,
        className: s.emojiMsg
      })
    );
    setLastRange();
    setText(ref.current.innerHTML);
  };

  const onPaste = useCallback((event) => {
    let paste = (event.clipboardData || window.clipboardData).getData(
      "text/plain"
    );
    ref.current.focus();
    let html = renderHtml(paste);
    insertNode(html);
    setLastRange();
    setText(ref.current.innerHTML);
    event.preventDefault();
  }, []);

  //事件绑定
  useEffect(() => {
    ref.current.addEventListener("keydown", onKeyDown);
    return function cleanup() {
      let _inputRef = ref;
      _inputRef &&
        _inputRef?.current?.removeEventListener("keydown", onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    idRef.current = fromId;
  }, [fromId]);

  useEffect(() => {
    let dom = ref?.current;
    ref?.current.addEventListener("paste", onPaste);
    return () => {
      dom.removeEventListener("paste", onPaste);
    };
  }, [onPaste]);

  return (
    <div className={`${s.controlWrap} ${threadName === "" && isCreatingThread ? s.cannotSend : null} `}>
      <div className={s.editableContainer}>
        <ContentEditable
          innerRef={ref}
          className={s.inputWrap}
          html={text}
          disabled={threadName === "" && isCreatingThread}
          onDrop={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            setLastRange();
          }}
          onKeyUp={() => {
            setLastRange();
          }}
          placeholder="发送消息"
          contentEditable="true"
          onChange={onChange}
        />
      </div>
      <div className={s.optWrap}>
        <EmojiPicker onEmojiSelect={onEmojiSelect} emojiIcon={"emoji"} disabled={threadName === "" && isCreatingThread} />
        <Dropdown
          overlay={menu}
          placement="top"
          overlayClassName="circleDropDown"
          trigger="click"
          disabled={threadName === "" && isCreatingThread}
        >
          <div className={s.IconCon}>
            <Icon iconClass={s.icon} name="add_in_circle" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

const mapStateToProps = ({ thread }) => {
  return {
    currentThreadInfo: thread.currentThreadInfo,
    isCreatingThread: thread.isCreatingThread,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateChatMessageUrl: (params) => {
      return dispatch({
        type: "app/updateChatMessageUrl",
        payload: params
      });
    },
    updateChatThreadMessageUrl: (params) => {
      return dispatch({
        type: "thread/updateChatThreadMessageUrl",
        payload: params
      });
    },
    updateChatMessageId: (params) => {
      return dispatch({
        type: "app/updateChatMessageId",
        payload: params
      });
    },
    updateChatThreadMessageId: (params) => {
      return dispatch({
        type: "thread/updateChatThreadMessageId",
        payload: params
      });
    },
    setThreadInfo: (params) => {
      return dispatch({
        type: "thread/setThreadInfo",
        payload: params
      });
    },
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(Input));
