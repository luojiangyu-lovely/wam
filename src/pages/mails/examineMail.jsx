
import React, { useState, useEffect } from 'react';

import {
    usePermissions,
    List,
    TextField,
    Datagrid,
    SelectInput,
    TextInput,
    DateTimeInput,
    FunctionField,
    DateField,
    WrapperField,
    Show, 
    SimpleShowLayout,
     ArrayField,
      ShowButton, 
      useRecordContext,
       useUpdate, 
       useRefresh, 
       
} from "react-admin";
import { Empty, Modal, message, Tag } from 'antd';
import { Button, Card, CardContent } from '@mui/material'
import { ExclamationCircleFilled, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Send } from '@mui/icons-material';
import { RichTextField } from 'react-admin';

import { itemsObj, sendStatus } from '../../CONST'



const { confirm } = Modal;
export const ExamineMailList = () => {
    const { isLoading, permissions } = usePermissions();
    return isLoading ? (<div>Waiting for permissions...</div>)
        : (permissions.includes('examineMails')
            ? (<List filters={mailSFilters} >
                <Datagrid rowClick="false" bulkActionButtons={false}>
                    <TextField source="id" label='邮件id' />
                    <FunctionField
                        source="response"
                        label='类型'
                        // render={record => sendStatusObj[record.isSend]}
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
                    <RichTextField source="title" label="标题" />
                    <FunctionField
                        source="avatar_ids"
                        label='接收者'
                        render={record => {

                            if (record.avatar_ids.length === 0) return '全服'
                            return record.avatar_ids.join('|')
                        }

                        }
                    />
                    <FunctionField
                        source="isSend"
                        label='是否发送'
                        // render={record => sendStatusObj[record.isSend]}
                        render={(record) => {
                            let isSend = record.isSend

                            if (isSend === 2) {
                                return <Tag color="red">已拒绝</Tag>
                            }
                            else if (isSend === 1) {
                                return <Tag color="green">已发送</Tag>
                            } else {
                                return <Tag color="orange">未发送</Tag>
                            }

                        }}
                    />




                    <WrapperField label='发送时间'>
                        <SendTimeField></SendTimeField>
                    </WrapperField>
                    <DateField source="transmission_time" showTime label='定时时间' />
                    <DateField source="sendTime" showTime label='审核时间' />
                    <TextField source="applicant" label='申请人' />
                    <TextField source="reviewer" label='审核人' />
                    <FunctionField
                        source="response"
                        label='是否成功'
                        // render={record => sendStatusObj[record.isSend]}
                        render={(record) => {
                            const { response } = record
                            if (!response) return null
                            let { response: { code, message } } = record
                            if (code === 20000) {
                                return <Tag icon={<CheckCircleOutlined />} color="success">成功</Tag>
                            }
                            else {
                                return <Tag icon={<CloseCircleOutlined />} color="error">失败:{message}</Tag>
                            }

                        }}
                    />

                    <WrapperField label='操作'>
                        <MyOpButton variant="contained" color="error" result={'reject'}>拒绝</MyOpButton>

                        <MyOpButton variant="contained" color="success" result={'agree'} startIcon={<Send />}>发送</MyOpButton>


                        <ShowButton variant="contained" label='查看详情' size='medium'></ShowButton>

                    </WrapperField>
                </Datagrid>
            </List>)
            : <Card>
                <CardContent >
                    <Empty description='暂无权限' />
                </CardContent>
            </Card>)
}

const mailSFilters = [
    <SelectInput source="isSend" label='邮件状态' alwaysOn choices={sendStatus} />,
    <TextInput label="标题" source="bt_title" alwaysOn />,
    <DateTimeInput source="start_time" label='开始时间' alwaysOn />,
    <DateTimeInput source="end_time" label='结束时间' alwaysOn />
]




export const ExamineMailShow = () => {
    return <Show title="Role view">
        <SimpleShowLayout>
            <RichTextField source="title" label="标题" />
            <RichTextField source="content" label="内容" />
            <ArrayField source="rewards" label='道具'>
                <Datagrid bulkActionButtons={false}>
                    <FunctionField source="id" label='道具名称' render={record => itemsObj[record?.id]} />
                    <TextField source="number" label='道具数量' />

                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
}


const MyOpButton = (props) => {
    const { children, result } = props
    const record = useRecordContext();
    const refresh = useRefresh();
    const [update] = useUpdate()
    const reject = () => {


        confirm({
            title: result === 'reject' ? '是否确认拒绝？' : '是否确认发送',
            icon: <ExclamationCircleFilled />,
            okText: "确定",
            cancelText: '取消',
            onOk() {
                const { username } = JSON.parse(localStorage.getItem("user"))
                record['result'] = result
                record['reviewer'] = username
                record['rewards'] = record['rewards'].map(el => [el.id, el.number])
                record['sendTime'] = new Date()
                record['isSend'] = result === 'reject' ? 2 : 1
                if (record.isNowSend == '0') {
                    if (new Date(record.transmission_time) - new Date() < 0) {
                        message.error("定时时间已超时！")
                        return
                    }
                    record['transmission_time'] = (new Date(record.transmission_time).getTime()) / 1000
                }
                update(
                    'examineMails',
                    { id: record.id, data: record }

                ).then(() => {
                    refresh()
                });
            },

        });


    }
    if (record['isSend']) return null;
    return <Button {...props} sx={{ marginRight: 2 }} onClick={reject} >{children}</Button>
}
const SendTimeField = () => {
    const record = useRecordContext();
    if (record.result === 'reject') {
        return null
    } else if (record.isNowSend == '1') {
        return <DateField source="sendTime" showTime />
    } else {
        return <DateField source="transmission_time" showTime />
    }
}
