

import React, { useState, useEffect } from 'react';
import { usePermissions, Form, DateTimeInput, SelectInput, RadioButtonGroupInput, SaveButton, TextInput, useCreate } from "react-admin";
import { Empty, Form as AntdForm, Button, Space, Select, InputNumber, Modal,message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Grid, Card, CardContent } from '@mui/material'
import { RichTextInput } from 'ra-input-rich-text'
import { itemsObj, itemsOption,server } from '../../CONST.ts'
export default function AddMail() {
    const { isLoading, permissions } = usePermissions();
    const [create] = useCreate();
    const [form] = AntdForm.useForm();
    const [sendTimeShow, setSendTimeShow] = useState(false)
    const itemsValues = AntdForm.useWatch((values) => values['rewards'], form);
    const required = (message = '必填') => (value) => value ? undefined : message;
    const numColor = (num)=>{
       if(num<10){
        return '#7cb305'
       }else if(num<100){
        return '#4096ff'
       }else if(num<1000){
        return '#722ed1'
       }else if(num<10000){
        return '#eb2f96'
       }else if(num<100000){
        return '#faad14'
       }else{
        return '#f5222d'
       }
    }

    const sendTimeChange = (e) => {
        const { value } = e.target
        if (value === '1') {
            setSendTimeShow(false)
        } else {
            setSendTimeShow(true)
        }


    }
    const postForm = (val) => {
        const {username} = JSON.parse(localStorage.getItem("user")) 
        const {title,avatar_ids,content} = val

        let bt_title = title.replace(/<[^>]+>|&[^>]+;/g, "").trim();
        let bt_content = content.replace(/<[^>]+>|&[^>]+;/g, "").trim();
        const rewards = itemsValues?itemsValues.filter(el=>el?.id&&el?.number):[]
        
        val['avatar_ids']  =  avatar_ids?avatar_ids.split(';').map(el=>Number(el)):[]

        const data = { ...val, 'rewards': rewards, isSend: 0, bt_title,applicant:username,bt_content }
        if(new Date(val.transmission_time) - new Date()<0){
            message.error("定时时间小于了当前时间！")
            return
        }
        create('mails', { data: data }, {
            onSettled: (data) => {
                Modal.success({
                    content: <div style={{ padding: '30px 0 15px 0', fontSize: 18 }}>
                        <div style={{ textAlign: 'center' }}>您的申请已提交，<span style={{ color: 'red' }}>id：{data.id}</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>请及时通知审核人员进行操作</div>

                    </div>,
                    okText: '确定'
                });
            },
        })

    }


    return isLoading ? (<div>Waiting for permissions...</div>)
        : (permissions?.includes('addMails')
            ? (
                <Form onSubmit={postForm}>
                    <Grid container>
                        <Grid item xs={12}>
                            <SelectInput label='区服' source="server_id" validate={[required("请选择区服！")]} choices={server} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextInput source="avatar_ids" label='uid'/>
                        </Grid>


                        <Grid item xs={12}>
                            <RadioButtonGroupInput label="发送时间" defaultValue={'1'} source="isNowSend" validate={[required("请选择发送方式！")]} choices={[
                                { id: 0, name: '定时发送' },
                                { id: 1, name: '立即发送' }
                            ]} onChange={sendTimeChange} />
                        </Grid>
                        {
                            sendTimeShow && <Grid item xs={12}>
                                <DateTimeInput source="transmission_time" label='选择时间' validate={[required("请选择发送时间！")]} />
                            </Grid>
                        }

                        <Grid item xs={12}>
                            <RichTextInput source="title" label='标题' validate={[required("请填写标题！")]} />
                        </Grid>
                        <Grid item xs={12}>
                            <RichTextInput source="content" label='内容' validate={[required("请填写内容！")]} />
                        </Grid>
                        <Grid item xs={12}>
                            <AntdForm
                                name="dynamic_form_nest_item"
                                style={{
                                    maxWidth: 600,
                                }}
                                form={form}
                            >
                                <AntdForm.List name="rewards"  >
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{
                                                        display: 'flex',
                                                        marginBottom: 8,
                                                    }}
                                                    align="baseline"
                                                >
                                                    <AntdForm.Item
                                                        {...restField}
                                                        name={[name, 'id']}
                                                        label='道具'
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Missing first name',
                                                            },
                                                        ]}
                                                    >
                                                        <Select

                                                            style={{ width: 200 }}
                                                            options={itemsOption}
                                                        />
                                                    </AntdForm.Item>
                                                    <AntdForm.Item
                                                        {...restField}
                                                        name={[name, 'number']}
                                                        label='数量'
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Missing number',
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber />
                                                    </AntdForm.Item>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <AntdForm.Item>
                                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} block>
                                                    添加
                                                </Button>

                                            </AntdForm.Item>
                                        </>
                                    )}
                                </AntdForm.List>

                            </AntdForm>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{ border: "1px solid rgba(0, 0, 0, 0.23)", padding: "10px 10px", color: 'rgba(0, 0, 0, 0.23)', borderRadius: '10px', backgroundColor: '#f5f5f5', marginBottom: 30, minHeight: 60 }}>

                                {itemsValues && itemsValues
                                    .map((el, index) => <div key={index}>
                                       
                                        <span>附件{index + 1}：</span><span>{itemsObj[el?.id]} <span style={{color:numColor(el?.number)}}>{el?.number}</span> </span>
                                    </div>)}


                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <SaveButton label='提交发送申请' />
                        </Grid>
                    </Grid>
                </Form>

            )
            : <Card>
                <CardContent >
                    <Empty description='暂无权限' />
                </CardContent>
            </Card>)
}