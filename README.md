# 环信超级社区（Circle）示例项目()

## 简介

环信超级社区（Circle）是一款基于环信 IM 打造的类 Discord 实时社区应用场景方案，支持社区（Server）、频道（Channel） 和子区（Thread） 三层结构。一个 App 下可以有多个社区，同时支持陌生人/好友单聊。用户可创建和管理自己的社区，在社区中设置和管理频道将一个话题下的子话题进行分区，在频道中根据感兴趣的某条消息发起子区讨论，实现万人实时群聊，满足超大规模用户的顺畅沟通需求。
该仓库包含了使用环信即时通讯 IM Web SDK 实现超级社区的示例项目。

## 项目结构

| 功能 | 位置 |
| --- | --- |
|  登录注册| src/views/Login|
|  个人信息管理| src/layout/UserInfo |
|  联系人管理| src/layout/Contacts|
|  社区管理| src/layout/Main/ServerForm |
|  频道管理| src/layout/Channel|
|  子区管理| src/views/Thread |
|  消息管理| src/components/Input/index.js|
|  广场 | src/layout/Server |



## 运行项目

1、克隆项目  
```bash
git clone https://github.com/easemob/Circle-Demo-Web.git
```

2、安装依赖
```bash
npm install
```

3、设置appKey
在"/src/utils/WebIM.js"文件中设置你的appKey。

4、运行项目

```bash
npm start
```
## 反馈
如果你有任何问题或建议，可以通过 issue 的形式反馈。

## 参考文档

产品概述及开发文档：
https://docs-im.easemob.com/ccim/circle/overview

## 代码许可
示例项目遵守 MIT 许可证。