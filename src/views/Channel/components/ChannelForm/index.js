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

const ChannelForm = forwardRef((props, ref) => {
  const { isEdit = false } = props;
  const [form] = Form.useForm();
  const { serverId, channelId } = useParams();
  const [isPrivate, setIsPrivate] = useState(false);
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
            isPublic: isPrivate ? false : true,
            ...values
          };
          WebIM.conn
            .createChannel(dt)
            .then((res) => {
              message.success("创建频道成功");
              getChannelDetail(serverId, res.data.channelId);
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
        const { name, description, isPublic } = res.data;
        if (isEdit) {
          form.setFieldsValue({
            name,
            description
          });
          setIsPrivate(!isPublic);
        } else {
          insertChannelList(serverId, channelId, res.data);
          navigate(`/main/channel/${serverId}/${channelId}`);
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

  return (
    <Form ref={ref} className="customForm" form={form} layout={"vertical"}>
      <Form.Item label="频道名称" name="name">
        <Input
          showCount={{ formatter: formatterInputCount }}
          maxLength={16}
          placeholder="请输入频道名称"
          autoComplete="off"
        />
      </Form.Item>
      <Form.Item label="频道简介" name="description">
        <Input.TextArea
          rows={5}
          placeholder="请输入频道简介"
          maxLength={120}
          showCount={{ formatter: formatterInputCount }}
        />
      </Form.Item>
      <Form.Item className="customFormItem">
        <div className={s.privateWrap}>
          <span
            className={s.isPrivate}
            style={isEdit ? { color: "#545454" } : {}}
          >
            私密频道
          </span>
          <Switch
            disabled={isEdit ? true : false}
            checked={isPrivate}
            onChange={(e) => {
              setIsPrivate(e);
            }}
          />
        </div>
      </Form.Item>
    </Form>
  );
});
const mapStateToProps = ({ server, app }) => {
  return {
    channelMap: server.channelMap
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
