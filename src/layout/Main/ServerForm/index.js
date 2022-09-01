import {
  useState,
  useEffect,
  useCallback,
  memo,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import { Form, Input, message } from "antd";
import s from "./index.module.less";
import UploadFile from "@/components/UploadFile";
import Icon from "@/components/Icon";
import WebIM from "@/utils/WebIM";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateServerDetail,
  addServer,
  formatterInputCount
} from "@/utils/common";
import AddTag from "./addTag";

const ServerForm = forwardRef((props, ref) => {
  const { isEdit = false, onchange } = props;
  const [avatarUrl, setAvatarUrl] = useState("");
  const [form] = Form.useForm();
  const params = useParams();
  const tagRef = useRef();
  const navigate = useNavigate();

  const submit = (onSuccess = () => {}, onError = () => {}) => {
    form
      .validateFields()
      .then((values = {}) => {
        const { name, description, icon = [] } = values;
        const { uri, entities } = icon.length ? icon[0]?.response : {};
        if (!name) {
          message.info("请输入社区名称!");
          return;
        }
        if (isEdit) {
          WebIM.conn
            .updateServer({
              name,
              icon: uri ? `${uri}/${entities[0].uuid}` : avatarUrl,
              description,
              serverId: params.serverId
            })
            .then((res) => {
              message.success("编辑社区成功");
              updateServerDetail("edit", res.data);
              onSuccess();
            })
            .catch(() => {
              message.error("编辑社区");
            });
        } else {
          WebIM.conn
            .createServer({
              name,
              description,
              icon: uri ? `${uri}/${entities[0].uuid}` : avatarUrl
            })
            .then((res) => {
              getServerDetail(res.data.id);
              onSuccess();
            })
            .catch((e) => {
              onError();
              message.error("创建社区失败");
            });
        }
      })
      .catch((e) => {
        onError();
      });
  };

  const onFieldsChange = () => {
    onchange();
    let dt = form.getFieldValue("icon");
    if (dt && dt.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(dt[0].originFileObj);
      reader.onload = () => {
        setAvatarUrl(reader.result);
      };
    }
  };

  const getServerDetail = useCallback(
    (serverId) => {
      WebIM.conn
        .getServerDetail({ serverId })
        .then((res) => {
          const { name, icon, description, defaultChannelId, id, tags } =
            res.data;
          if (isEdit) {
            form.setFieldsValue({
              name,
              icon: [],
              description
            });
            setAvatarUrl(icon);
            tagRef.current.setTagList(tags);
          } else {
            addServer(res.data).then(() => {
              navigate(`/main/channel/${id}/${defaultChannelId}`);
            });
          }
        })
        .catch((e) => {});
    },
    [form, isEdit, navigate]
  );

  useImperativeHandle(ref, () => ({
    submit
  }));

  useEffect(() => {
    if (isEdit) {
      getServerDetail(params.serverId);
    }
  }, []);

  return (
    <Form
      ref={ref}
      className={`${s.serverForm} customForm`}
      form={form}
      layout={"vertical"}
      onFieldsChange={onFieldsChange}
    >
      <Form.Item className={`customFormItem ${s.avatarFormItem}`} name="icon">
        <UploadFile otherProps={{ isCrop: true, maxCount: 1 }}>
          <div
            className={s.avatar}
            style={
              avatarUrl
                ? {
                    backgroundImage: `url(${avatarUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }
                : {}
            }
          >
            <div className={s.cover}></div>
            <div className={s.selectAvatar}>
              <Icon name="pencil" color="#fff" size="32px" />
            </div>
          </div>
          <div className={s.tip}>
            {avatarUrl ? "编辑社区头像" : "上传社区头像"}
          </div>
        </UploadFile>
      </Form.Item>
      <Form.Item label={isEdit ? "社区名称" : ""} name="name">
        <Input
          autoComplete="off"
          showCount={{
            formatter: formatterInputCount
          }}
          maxLength={16}
          placeholder="社区名称（必填项）"
        />
      </Form.Item>
      <Form.Item label={isEdit ? "社区简介" : ""} name="description">
        <Input.TextArea
          rows={5}
          placeholder="社区简介"
          maxLength={120}
          showCount={{
            formatter: formatterInputCount
          }}
        />
      </Form.Item>
      {isEdit && (
        <Form.Item label={isEdit ? "社区标签" : ""} className={s.tagFormItem}>
          <AddTag tagRef={tagRef} />
        </Form.Item>
      )}
    </Form>
  );
});

export default memo(ServerForm);
