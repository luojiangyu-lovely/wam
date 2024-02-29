import {
  Admin,
  Resource,
  ShowGuesser,
} from "react-admin";
import PeopleIcon from '@mui/icons-material/People';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

import { UserList,UserEdit } from "./pages/users"

import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { MyLayout } from './MyLayout';
export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout}>
    <Resource
      name="users"
      edit={UserEdit}
      list={UserList}
      icon={PeopleIcon}
    />
  </Admin>
);
