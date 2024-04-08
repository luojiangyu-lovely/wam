import { useState } from 'react'
import {
    List,
    Create,
    Datagrid,
    TextField,
    useCreate,
    SimpleForm,
    TopToolbar,
    usePermissions,
    CreateButton,
    RadioButtonGroupInput,
    FunctionField,
    ExportButton,
    DateTimeInput,
    DateField,
    TextInput
} from "react-admin";
import { translateStr, translateStrPost } from '../../utils'
import { Card, CardContent, Grid } from '@mui/material';
import { Empty, message, Tag, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export const NoticeList = () => {
    const { isLoading, permissions } = usePermissions();

    return isLoading ? (<div>Waiting for permissions...</div>) : (
        permissions?.includes('notice')
            ? (<List actions={<ListActions />}>
                <Datagrid >
                    <TextField source="id" />
                    <FunctionField
                        source="response"
                        label='类型'
                        render={(record) => {
                            const { isNowSend } = record
                            if (isNowSend === "0") {
                                return <Tag color="#f50">定时发送</Tag>
                            } else {
                                return <Tag color="#108ee9">立即发送</Tag>
                            }
                        }}
                    />
                    <TextField source="title" label="标题" />
                    <TextField source="notify" label="内容" />
                    <DateField source="send_time" showTime label='推送时间' />
                    <FunctionField
                        source="response"
                        label='是否成功'
                        render={(record) => {
                            const { response } = record
                            if (!response) return null
                            let { response: { code, message } } = record
                            if (code === 20000) {
                                return <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>
                            } else {
                                return <Tag icon={<CloseCircleOutlined />} color="error">失败:{message}</Tag>
                            }
                        }}
                    />
                </Datagrid>
            </List>)
            : (<Card>
                <CardContent >
                    <Empty description='暂无权限' />
                </CardContent>
            </Card>))
}


export const NoticeCreate = () => {
    const [sendTimeShow, setSendTimeShow] = useState(false)
    const [notify, setNotify] = useState('')
    const [create] = useCreate();
    const required = (message = '必填') => (value) => value ? undefined : message;

    const sendTimeChange = (e) => {
        const { value } = e.target
        if (value === '1') {
            setSendTimeShow(false)
        } else {
            setSendTimeShow(true)
        }
    }

    const postSend = (val) => {
        const record = { ...val }
        record['language'] = '40'
        record['is_default'] = 1
        record['notify'] = translateStrPost(JSON.stringify(notify))
        if (val.isNowSend == '0') {
            const delay_time = (new Date(val.transmission_time) - new Date()) / 1000
            if (delay_time < 0) {
                message.error("开始时间小于当前时间！")
                return
            }
            record['send_time'] = record['transmission_time']
            record['transmission_time'] = (new Date(record.transmission_time).getTime()) / 1000
        } else {
            record['send_time'] = new Date()
        }
        create('notice', { data: record })
    }

    const notifyOnchange = (val) => {
        setNotify(val.target.value)
        const newStr = translateStr(JSON.stringify(val.target.value))
        const container = document.getElementById('notice_container')
        container.innerHTML = newStr
    }
    return <Create>

        <SimpleForm onSubmit={postSend}>
            <Grid container>
                <Grid item xs={12}>
                    <RadioButtonGroupInput label="发送时间" defaultValue={'1'} source="isNowSend" validate={[required("请选择发送方式！")]} choices={[
                        { id: 0, name: '定时发送' },
                        { id: 1, name: '立即发送' }
                    ]} onChange={sendTimeChange} />
                    {
                        sendTimeShow && <DateTimeInput source="transmission_time" label='发送时间' validate={[required("请选择开始时间！")]} />
                    }
                </Grid>
                <Grid item xs={12}>
                    <TextInput source="title" label='标题' validate={[required()]} />
                </Grid>
                <Grid item xs={12}>
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 14, marginRight: 4 }} >内容:</div>
                        <TextArea
                            style={{
                                maxWidth: 600,
                            }}
                            value={notify}
                            onChange={notifyOnchange}
                            autoSize={{
                                minRows: 3,
                                maxRows: 5,
                            }}
                        />
                    </div>
                </Grid>
                <Grid>
                    <div style={{ minWidth: 600 }}>
                        <div style={{ fontSize: 14, marginRight: 4 }} >内容预览:</div>
                        <div style={{ border: "1px solid rgba(0, 0, 0, 0.23)", padding: "10px 10px", color: 'rgba(0, 0, 0, 0.23)', borderRadius: '10px', backgroundColor: '#f5f5f5', marginBottom: 30, minHeight: 80 }}>
                            <pre id='notice_container' style={{ 'margin': 0 }}></pre>
                        </div>
                    </div>


                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
}


const ListActions = () => (
    <TopToolbar>
        <CreateButton label='新增' />
        <ExportButton />
    </TopToolbar>
);