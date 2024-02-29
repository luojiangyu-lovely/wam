import { Layout } from 'react-admin';
import { Menu } from 'react-admin';

export const MyLayout = (props) => (
    <Layout {...props} menu={MyMenu} />
);



const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.ResourceItem name="users" />
    </Menu>
);