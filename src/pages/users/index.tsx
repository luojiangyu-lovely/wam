
import { useEffect } from 'react'
import {
    List,
    Create,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    usePermissions,
    SelectArrayInput,
    FunctionField,
    TopToolbar,
    CreateButton,
    useAuthenticated ,
    useRedirect,
    ExportButton
} from "react-admin";
import { Card, CardContent } from '@mui/material';
import { Empty } from 'antd';
import { premissObj } from '../../CONST'


export const UserList = () => {
    
    useAuthenticated ()
    const { isLoading, permissions } = usePermissions();
    return isLoading ? (<div>Waiting for permissions...</div>) : (
        permissions?.includes('users') ? <List actions={<ListActions />}>
            <Datagrid rowClick="edit">
                <TextField source="id" />
                <TextField source="username" label="用户名" />
                <FunctionField
                    source="premissObj"
                    label="页面权限"
                    render={(record: any) => {
                        let data = record.premissions.map((el: string) => premissObj[el])
                        return `${data.join(' | ')}`
                    }}
                />
            </Datagrid>
        </List> : <Card><CardContent ><Empty description='暂无权限' /></CardContent></Card>)
}

export const UserEdit = () => {
    return <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="username" label="用户名" />
            <SelectArrayInput source="premissions" label="分配权限" choices={[
                { id: 'users', name: '账号模块' },
                { id: 'roles', name: '角色查询' },
                { id: 'bans', name: '封禁系统' },
                { id: 'addMails', name: '新增邮件' },
                { id: 'examineMails', name: '邮件审核' },
                { id: "raceLamps", name: '跑马灯' },
                { id: 'notice', name: '公告' }
            ]} />
        </SimpleForm>
    </Edit>
}

export const UserCreate = () => {
    const name1Validation = (value: any, allValues: any) => {
        if (!value) {
            return '请填写用户名！';
        }
        if (value != allValues['usernameAgain']) {
            return '两次用户名不相同！';
        }
        return undefined;
    };
    const name2Validation = (value: any, allValues: any) => {
        if (!value) {
            return '请再次填写用户名！';
        }
        if (value != allValues['username']) {
            return '两次用户名不相同！';
        }
        return undefined;
    };
    return <Create>
        <SimpleForm>
            <TextInput source="username" validate={[name1Validation]} label="用户名" />
            <TextInput source="usernameAgain" validate={[name2Validation]} label="用户名确认" />
            <SelectArrayInput source="premissions" label='分配权限' choices={[
                { id: 'users', name: '账号模块' },
                { id: 'roles', name: '角色查询' },
                { id: 'bans', name: '封禁系统' },
                { id: 'addMails', name: '新增邮件' },
                { id: 'examineMails', name: '邮件审核' },
                { id: "raceLamps", name: '跑马灯' },
                { id: 'notice', name: '公告' }
            ]} />
        </SimpleForm>
    </Create>
}

const ListActions = () => (
    <TopToolbar>
        <CreateButton label='新增' />
        <ExportButton />
    </TopToolbar>
);