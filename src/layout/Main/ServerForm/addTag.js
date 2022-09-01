import {
  useState,
  memo,
  useImperativeHandle,
  forwardRef,
  useEffect
} from "react";
import { Input, message } from "antd";
import s from "./index.module.less";
import Icon from "@/components/Icon";
import WebIM from "@/utils/WebIM";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { formatterInputCount } from "@/utils/common";

const TagItem = ({ item, onRemove }) => {
  return (
    <div key={item.tagId} className={s.tagItem}>
      {item.tagName}
      <Icon
        name="xmark_in_circle"
        style={{ marginLeft: "2px" }}
        onClick={() => {
          onRemove(item.tagId);
        }}
      ></Icon>
    </div>
  );
};

const AddTag = ({ tagRef, ...props }) => {
  const { setTags } = props;
  const [tagList, setTagList] = useState([]);
  const [tagValue, setTagValue] = useState("");

  const params = useParams();

  useImperativeHandle(tagRef, () => ({
    setTagList: (value) => {
      setTagList(value);
    }
  }));

  const addTag = () => {
    if (tagValue) {
      const hasTag = tagList.find((item) => {
        return item.tagName === tagValue;
      });
      if (hasTag) {
        message.info("社区标签已存在");
      } else {
        WebIM.conn
          .addServerTags({
            serverId: params.serverId,
            tags: [tagValue]
          })
          .then((res) => {
            setTagList([...tagList, ...res.data.tags]);
            setTagValue("");
            WebIM.conn
              .getServerTags({ serverId: params.serverId })
              .then((res) => {
                setTags(res.data.tags);
              });
            message.info("添加成功");
          });
      }
    } else {
      message.info("请输入标签名称");
    }
  };

  const deleteTag = (tagId) => {
    WebIM.conn
      .removeServerTags({
        serverId: params.serverId,
        tagIds: [tagId]
      })
      .then(() => {
        let ls = tagList.filter((item) => {
          return item.tagId !== tagId;
        });
        setTagList(ls);
        WebIM.conn.getServerTags({ serverId: params.serverId }).then((res) => {
          setTags(res.data.tags);
        });
        message.info("删除成功");
      });
  };

  useEffect(() => {
    WebIM.conn.getServerTags({ serverId: params.serverId }).then((res) => {
      setTagList(res.data.tags);
    });
  }, []);

  return (
    <>
      <div className={s.tagItemWrap}>
        {tagList.map((item) => {
          return (
            <TagItem
              item={item}
              key={item.tagId}
              onRemove={(id) => {
                deleteTag(id);
              }}
            />
          );
        })}
      </div>
      <Input.Group className={s.iptGroup}>
        <Input
          autoComplete="off"
          showCount={{
            formatter: formatterInputCount
          }}
          maxLength={16}
          value={tagValue}
          onChange={(e) => {
            setTagValue(e.target.value);
          }}
          placeholder="在此输入社区标签"
        />
        <Icon
          iconClass={s.icon}
          name="add_in_circle"
          onClick={() => {
            addTag();
          }}
          size="16px"
        ></Icon>
      </Input.Group>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTags: (params) => {
      return dispatch({
        type: "server/setCurrentServerTag",
        payload: params
      });
    }
  };
};

const ConnectedTag = connect(null, mapDispatchToProps)(AddTag);

export default memo(
  forwardRef((props, ref) => <ConnectedTag {...props} myForwardedRef={ref} />)
);
