import React, { useState } from 'react'
import { List, Datagrid, TextField, Show, SimpleShowLayout, TextInput, SelectInput, usePermissions, FunctionField, BooleanField } from "react-admin";
import { Card, CardContent } from '@mui/material';
import {server} from '../../CONST'
import { Empty } from 'antd';
export const RoleList = () => {
    const { isLoading, permissions } = usePermissions();
    return isLoading ? (<div>Waiting for permissions...</div>) : (
        permissions?.includes('roles') ? <List filters={roleSFilters} actions={null}>
            <Datagrid rowClick="show" bulkActionButtons={false}>
                <MyTextField source="id" label='uid' />
                <MyTextField source="qf" label='区服' />
                <MyTextField source="name" label='昵称' />
            </Datagrid>
        </List> : <Card><CardContent ><Empty description='暂无权限' /></CardContent></Card>)
}





export const RoleShow = () => {
    return <Show title="Role view">
        <SimpleShowLayout>
            <MyTextField labels="uid" source="id" label={false} />
            <MyTextField labels="昵称" source="name" label={false} />
            <MyTextField labels="阵营" source="camp" label={false} />
            <MyTextField labels="当前位置" source="city_pos" label={false} />
            <MyTextField labels="等级" source="title_lv" label={false} />
            <MyTextField labels="官职" source="gz" label={false} />
            <ReputationTextField labels="总声望" source="reputation" label={false} />
            <TitleinfoField label='子声望' source="title_info" ></TitleinfoField>
            <MyTextField labels="砖石" source="points.ruby" label={false} />
            <MyTextField labels="抽奖券" source="points.gacha_items" label={false} />
            <MyStateField label='账号状态' source="state"></MyStateField>
        </SimpleShowLayout>
    </Show>
}

const MyStateField = ({ labels, source }) => {
    return (<React.Fragment>
        <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>是否在线：</span><FunctionField source={source} render={record => record.online ? '在线' : "离线"} /></div>
        <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>状态：</span><FunctionField source={source} render={record => {
            switch (record.ban_state) {
                case "none":
                    return '未封禁'
                case "login":
                    return '禁玩'
                case "chat":
                    return '禁言'
            }

        }} /></div>
        <div><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>{labels}</span><BooleanField source={source} /></div>
    </React.Fragment>)
}



const MyTextField = ({ labels, source }) => {
    return (
        <React.Fragment>
            <div><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>{labels}</span><TextField label={false} source={source} /></div>
        </React.Fragment>
    )


}
const ReputationTextField = ({ labels, source }) => {
    return (
        <React.Fragment>
            <div><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>{labels}</span><FunctionField source={source} render={record => {
                const { title_info: { power, exploit, siege, kill_monster, building } } = record
                return power + exploit + siege + kill_monster + building
            }} /></div>
        </React.Fragment>
    )


}
const TitleinfoField = ({ labels, source }) => {
    return (
        <React.Fragment>
            <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>领地</span><FunctionField source={source} render={record => record.title_info.power} /></div>
            <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>荣誉</span><FunctionField source={source} render={record => record.title_info.exploit} /></div>
            <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>攻城</span><FunctionField source={source} render={record => record.title_info.siege} /></div>
            <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>剿灭</span><FunctionField source={source} render={record => record.title_info.kill_monster} /></div>
            <div style={{ marginLeft: 30 }}><span style={{ fontSize: 12, marginRight: 10, color: 'rgba(0, 0, 0, 0.6)' }}>城建</span><FunctionField source={source} render={record => record.title_info.building} /></div>
        </React.Fragment>
    )


}

const roleSFilters = [
    
    <TextInput label="角色id" source="avatar_id" alwaysOn />,

    <TextInput label="角色昵称" source="avatar_name" alwaysOn />,
    <SelectInput label="区服" source="server_id" choices={server} alwaysOn />
]; 