import {
  Admin,
  Resource,
  

} from "react-admin";
import PeopleIcon from '@mui/icons-material/People';


import { UserList,UserEdit,UserCreate } from "./pages/users"

import { dataProvider } from "./dataProvider";
import { authProvider } from "./authProvider";
import { MyLayout } from './MyLayout';
export const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider} layout={MyLayout}  >
    <Resource
      name="users"
      edit={UserEdit}
      list={UserList}
      create={UserCreate}
      icon={PeopleIcon}
    />
  </Admin>
);
