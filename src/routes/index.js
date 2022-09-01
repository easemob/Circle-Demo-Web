import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import lazy from "./LazyComponent";

const MainLayout = () => import("@/layout/Main");
const ContactsLayout = () => import("@/layout/Contacts");
const ChannelLayout = () => import("@/layout/Channel");
const ServerLayout = () => import("@/layout/Server");
const Login = () => import("@/views/Login/login");
const ChannelContent = () => import("@/views/Channel");
const UserInfoLayout = () => import("@/layout/UserInfo");
const ThreadLayout = () => import("@/views/Thread");
const ContactsOperation = () => import("@/views/ContactsOperation");
const Chat = () => import("@/views/Chat");

const routes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="login" />} />
      <Route path="login" index element={lazy(Login)} />
      <Route path="main" element={lazy(MainLayout)}>
        <Route index element={<Navigate to="contacts/index" replace={true} />} />
        <Route path="contacts/" element={lazy(ContactsLayout)}>
          <Route path="index/" element={lazy(ContactsOperation)}></Route>
          <Route
            path="chat/:userId"
            element={lazy(Chat)}
          ></Route>
        </Route>
        <Route path="user/" element={lazy(UserInfoLayout)}></Route>
        <Route path="channel/" element={lazy(ChannelLayout)}>
          <Route
            path=":serverId/:channelId"
            element={lazy(ChannelContent)}
          ></Route>
          <Route
            path=":serverId/:channelId/:threadId"
            element={lazy(ThreadLayout)}
          ></Route>
        </Route>
        <Route path="server/*" element={lazy(ServerLayout)}>
          <Route path="discover" element={<div>Server Page</div>}></Route>
        </Route>
      </Route>
      {/* TODO: 404? */}
    </Routes>
  );
};

export default routes;
