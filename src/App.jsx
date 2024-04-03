import {
  Admin,
  Resource

} from "react-admin";

import { Groups, HideSource, DirectionsRunTwoTone,VolumeUpRounded  } from '@mui/icons-material';
import {
  MailOutlined,
  UserAddOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";

import { UserList, UserEdit, UserCreate } from "./pages/users"
import { RoleList, RoleShow } from "./pages/roles"
import { BanList } from "./pages/bans"
import { MyLayout } from './MyLayout';
import AddMail from "./pages/mails/addMail"
import {ExamineMailList,ExamineMailShow} from "./pages/mails/examineMail"
import {RaceLampsList,RaceLampsCreate} from './pages/racelamps'
import {NoticeList,NoticeCreate} from './pages/notice'

export const App = () => {
  return <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout}  >
    <Resource
      name="users"
      options={{ label: "用户管理" }}
      edit={UserEdit}
      list={UserList}
      create={UserCreate}
      icon={UserAddOutlined}
    />
    <Resource
      name="roles"
      options={{ label: "角色查询" }}
      list={RoleList}
      show={RoleShow}
      icon={Groups}
    />
    <Resource
      name="bans"
      options={{ label: "禁用系统" }}
      list={BanList}
      icon={HideSource}
    />
    <Resource
      name='addMails'
      list={AddMail}
      icon={MailOutlined}
      options={{ label: "邮件添加" }}>

    </Resource>
    <Resource
      name='examineMails'
      list={ExamineMailList}
      options={{ label: "邮件审核" }}
      show={ExamineMailShow}
      icon={FileSearchOutlined}>
    </Resource>
    <Resource
      name='raceLamps'
      list={RaceLampsList}
      options={{ label: "跑马灯" }}
      create={RaceLampsCreate}
      icon={DirectionsRunTwoTone}>
    </Resource>
    <Resource
      name='notice'
      list={NoticeList}
      options={{ label: "公告" }}
      create={NoticeCreate}
      icon={VolumeUpRounded}>
    </Resource>
  </Admin>
}


