import React  from 'react'
import { TextInput, SaveButton, SelectInput, usePermissions, Form, useCreate ,NumberInput} from "react-admin";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Empty, Modal } from 'antd';
import { server } from '../../CONST'
import { Grid, Card, CardContent } from '@mui/material'
export const BanList = () => {
    const { isLoading, permissions } = usePermissions();
    const [create] = useCreate();
    const { confirm } = Modal;
    const required = (message = '必填') => (value) => value!=='' ? undefined : message;

    const banSave = (val) => {
        confirm({
            title: '是否确认禁用？',
            icon: <ExclamationCircleFilled />,
            content: <div style={{ fontSize: 16, fontWeight: 600 }}> id: {val.target_id}</div>,
            onOk() {
                create('bans', { data: {...val,"type":1}})
            },
            okText:'确定',
            cancelText:'取消'
        });
    }
    
    return (
        isLoading ? (<div>Waiting for permissions...</div>) : (
            permissions?.includes('bans') ? <Form onSubmit={banSave}>
                <Grid container>
                    <Grid item xs={12}>
                        <SelectInput label="区服" source="server_id" validate={[required()]}  choices={server} alwaysOn />,
                    </Grid>
                    <Grid item xs={2}>
                        <NumberInput label='角色id' source='target_id'  validate={[required()]} />
                    </Grid>

                    <Grid item xs={12}>
                        <SelectInput source="process_type" label="禁用类型" choices={[
                            { id: 1, name: '封禁登录' },
                            { id: 2, name: '封禁聊天' },
                            { id: 3, name: '封禁邮件' },
                        ]} validate={[required()]} />
                    </Grid>
                   
                    <Grid item xs={12}>
                        <TextInput label="原因" source="process_reason" alwaysOn />,
                    </Grid>
                    <Grid item xs={12}>
                    <NumberInput source="duration" alwaysOn label='持续时间（秒）' validate={[required()]}/>
                    </Grid>
                    <SaveButton />
                </Grid>
            </Form> : <Card><CardContent ><Empty description='暂无权限' /></CardContent></Card>)
    )
}
