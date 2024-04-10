import React, { useState } from 'react'
import {
    List,
    Create,
    Datagrid,
    TextField,
    useCreate,
    SimpleForm,
    NumberInput,
    usePermissions,
    RadioButtonGroupInput,
    FunctionField,
    SelectInput,
    DateTimeInput,
    DateField,
    WrapperField,
    useRecordContext,
    useRefresh,
    useUpdate,
    CreateButton,
    ExportButton,
    TextInput,
    TopToolbar,

} from "react-admin";
import { Card, CardContent, Button } from '@mui/material';
import { Empty, message, Tag, Modal, Form } from 'antd';
import { ExclamationCircleFilled, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { server } from '../../CONST.ts'
import { translateStr, translateStrPostR } from '../../utils.js'
const { confirm } = Modal;


export const RaceLampsList = () => {
    const { isLoading, permissions } = usePermissions();

    return isLoading ? (<div>Waiting for permissions...</div>) : (
        permissions?.includes('raceLamps')
            ? <List actions={<ListActions />}>
                <Datagrid rowClick="edit">
                    <TextField source="id" />
                    <FunctionField
                        source="response"
                        label='类型'
                        render={(record) => {
                            const { isNowSend } = record
                            if (isNowSend === "0") {
                                return <Tag color="#f50">定时发送</Tag>
                            }
                            else {
                                return <Tag color="#108ee9">立即发送</Tag>
                            }
                        }}
                    />
                    <FunctionField
                        source="content"
                        label="内容"
                        render={(record) => {
                            const newStr = translateStr(JSON.stringify(record.origin_content))
                            console.log('显示',record.content)
                            return (
                                <React.Fragment>
                                    <pre >{React.createElement('div', { dangerouslySetInnerHTML: { __html: newStr } })}</pre>
                                </React.Fragment>
                            );
                        }}
                    />
                    <DateField source="start_time" showTime label='推送时间' />
                    <DateField source="end_time" showTime label='结束时间' />
                    <TextField source="interval" label='间隔' />
                    <FunctionField
                        source="stutus"
                        label="状态"
                        render={(record) => {
                            let is_stop = record.is_stop
                            let start_time = new Date() - new Date(record.start_time)
                            let end_time = new Date() - new Date(record.end_time)
                            if (is_stop) {
                                return <Tag color="red">已停止</Tag>
                            } else if (end_time > 0) {
                                return <Tag color="blue">已结束</Tag>
                            } else if (start_time < 0) {
                                return <Tag color="green">未开始</Tag>
                            } else {
                                return <Tag color="orange">进行中</Tag>
                            }
                        }}
                    />
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
                    <WrapperField label='操作'>
                        <MyOpButton variant="contained" color="error" >停止</MyOpButton>

                    </WrapperField>
                </Datagrid>
            </List>
            : <Card>
                <CardContent >
                    <Empty description='暂无权限' />
                </CardContent>
            </Card>)
}


export const RaceLampsCreate = () => {
    const [sendTimeShow, setSendTimeShow] = useState(false)
    const [create] = useCreate();
    const required = (message = '必填') => (value) => value ? undefined : message;

    const contentChange = (val) => {
        const newStr = translateStr(JSON.stringify(val.target.value))
        const container = document.getElementById('racelamps_container')
        console.log('新增',val.target.value)
        container.innerHTML = newStr
    }

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
        if (val.isNowSend == '0') {
            const delay_time = (new Date(val.start_time) - new Date()) / 1000
            const range_time = (new Date(val.end_time) - new Date(val.start_time))
            if (delay_time < 0) {
                message.error("开始时间小于当前时间！")
                return
            }
            if (range_time < 0) {
                message.error("结束时间应大于开始时间！")
                return
            }
            record['transmission_time'] = (new Date(val.start_time)) / 1000
        } else {
            const end_time = (new Date(val.end_time) - new Date())
            if (end_time < 0) {
                message.error("结束时间应大于当前时间！")
                return
            }
            record['start_time'] = new Date()
        }
        record['origin_content'] = record['content']
        record['content']= translateStrPostR(record['content'])
        record['stop_time'] = (new Date(val.end_time).getTime()) / 1000
        record['is_stop'] = 0
        create('raceLamps', { data: record })
    }
    return <Create>
        
        <SimpleForm onSubmit={postSend}>
            <SelectInput label="区服" source="server_id" choices={server} validate={[required()]} />
            <RadioButtonGroupInput label="发送时间" defaultValue={'1'} source="isNowSend" validate={[required("请选择发送方式！")]} choices={[
                { id: 0, name: '定时发送' },
                { id: 1, name: '立即发送' }
            ]} onChange={sendTimeChange} />
            {
                sendTimeShow && <DateTimeInput source="start_time" label='开始时间' validate={[required("请选择开始时间！")]} />
            }
            <DateTimeInput source="end_time" label='结束时间' validate={[required("请选择结束时间！")]} />
            <NumberInput source="interval" label='间隔时间' validate={[required()]} min={10} />
            <TextInput
                validate={[required()]}
                source='content'
                label='内容'
                onChange={contentChange}
                style={{
                    width: 600,
                }}
            />
            <Form.Item label='内容预览' style={{ width: 600 }}>
                <div style={{ border: "1px solid rgba(0, 0, 0, 0.23)", padding: "10px 10px", color: 'rgba(0, 0, 0, 0.23)', borderRadius: '10px', backgroundColor: '#f5f5f5', marginBottom: 30, height: 46, overflow: "hidden" }}>
                    <pre id='racelamps_container' style={{ 'margin': 0 }}></pre>
               
                </div>
            </Form.Item>
        </SimpleForm>
    </Create>

}

const MyOpButton = (props) => {
    const { children } = props
    const record = useRecordContext();
    const refresh = useRefresh();
    const [update] = useUpdate()
    let start_time = new Date() - new Date(record.start_time)
    let end_time = new Date() - new Date(record.end_time)
    let is_stop = record.is_stop

    const reject = () => {
        confirm({
            title: '是否确认删除？',
            icon: <ExclamationCircleFilled />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                record['in_progress'] = start_time > 0 && end_time < 0
                update(
                    'raceLamps',
                    { id: record.id, data: record }

                ).then(() => {
                    refresh()
                });
            },
        });
    }

    if (end_time > 0 || is_stop) return null;
    return <Button {...props} sx={{ marginRight: 2 }} onClick={reject} >{children}</Button>
}

const ListActions = () => (
    <TopToolbar>
        <CreateButton label='新增' />
        <ExportButton />
    </TopToolbar>
);