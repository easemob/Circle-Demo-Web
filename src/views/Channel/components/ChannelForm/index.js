import { Form, Input, Switch, message } from "antd";
import {
  memo,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect
} from "react";
import s from "./index.module.less";
import WebIM from "@/utils/WebIM";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import {
  insertChannelList,
  updateLocalChannelDetail,
  formatterInputCount
} from "@/utils/common";
import Icon from "@/components/Icon";

const channelMode = [
  { mode: 0, text: "文字频道", icon: "hashtag", color: "rgba(255,255,255,.74)" },
  { mode: 1, text: "语聊房频道", icon: "mic", color: "#fff" }
]
const ChannelForm = forwardRef((props, ref) => {
  const { isEdit = false,channelCategoryId } = props;
  const [form] = Form.useForm();
  const { serverId, channelId } = useParams();
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const submit = (onSuccess = () => { }, onError = () => { }) => {
    form
      .validateFields()
      .then((values = {}) => {
        if (!values.name) {
          message.info("请输入频道名称!");
          return;
        }
        if (!values.description) {
          delete values.description;
        }
        if (isEdit) {
          WebIM.conn
            .updateChannel({
              serverId,
              channelId,
              ...values
            })
            .then(() => {
              message.success("编辑频道成功");
              updateLocalChannelDetail("edit", serverId, {
                ...values,
                id: channelId
              });
              onSuccess();
            })
            .catch((e) => {
              message.error("编辑频道失败");
              onError();
            });
        } else {
          const dt = {
            serverId,
            isPublic,
            mode,
            channelCategoryId,
            ...values
          };
          WebIM.conn
            .createChannel(dt)
            .then((res) => {
              message.success("创建频道成功");
              getChannelDetail(serverId,res.data.channelId);
              onSuccess();
            })
            .catch(() => {
              message.error("创建频道失败");
              onError();
            });
        }
      })
      .catch((e) => {
        console.log(e);
        onError();
      });
  };

  const getChannelDetail = (serverId, channelId) => {
    WebIM.conn
      .getChannelDetail({ serverId, channelId })
      .then((res) => {
        const { name, description, isPublic, mode } = res.data;
        if (isEdit) {
          form.setFieldsValue({
            name,
            description
          });
          setIsPublic(isPublic);
        } else {
          insertChannelList(serverId, channelId, res.data);
          if(mode === 0){
            navigate(`/main/channel/${serverId}/${channelId}`);
          }
        }
      })
      .catch((e) => { });
  };

  useImperativeHandle(ref, () => ({
    submit
  }));

  useEffect(() => {
    if (isEdit) {
      getChannelDetail(serverId, channelId);
    }
  }, []);
  const [mode ,setMode] = useState(0);

  return (
    <Form ref={ref} className="customForm" form={form} layout={"vertical"}>
      <Form.Item label="频道类型" className="formRadioGroup">
        {channelMode.map((item, index) => {
          return (
            <div className={s.radioItem} key={index}>
              <div className={s.label}>
                <div className={s.iconStyle} style={{ background: item.mode === 1 ? "#27AE60" : "#1f1f1f" }}><Icon name={item.icon} color={item.color} size="26px"></Icon></div>
                <span className={s.radioLabel} >{item.text}</span></div>
              <div className={s.radioInput}>
                {mode !== index && <Icon name="circle" color="#fff" size="22px" onClick={()=>setMode(index)}></Icon>}
                {mode === index && <Icon name="radio-01" color="#27AE60" size="22px"></Icon>}
              </div>
            </div>
          )
        })}
      </Form.Item>
      <Form.Item label="频道名称" name="name">
        <Input
          showCount={{ formatter: formatterInputCount }}
          maxLength={16}
          placeholder="请输入频道名称"
          autoComplete="off"
        />
      </Form.Item>
      {/* <Form.Item label="频道简介" name="description">
        <Input.TextArea
          rows={5}
          placeholder="请输入频道简介"
          maxLength={120}
          showCount={{ formatter: formatterInputCount }}
        />
      </Form.Item> */}
      <Form.Item className="customFormItem" label="频道类型">
        <div className={s.privateWrap}>
          <span
            className={s.isPrivate}
            style={isEdit ? { color: "#545454" } : {}}
          >
            是否为公开频道
          </span>
          <Switch
            disabled={isEdit ? true : false}
            checked={isPublic}
            onChange={(e) => {
              setIsPublic(e);
            }}
          />
          <span className={s.tips}>仅通过邀请的用户可以加入私密频道</span>
        </div>
      </Form.Item>
    </Form >
  );
});
const mapStateToProps = ({ server, channel }) => {
  return {
    channelMap: server.channelMap,
    channelCategoryId: channel.createChannelCategoryId,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setServerChannelMap: (params) => {
      return dispatch({
        type: "server/setChannelMap",
        payload: params
      });
    }
  };
};
export default memo(
  connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(
    ChannelForm
  )
);
