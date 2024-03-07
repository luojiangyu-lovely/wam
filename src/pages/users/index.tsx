
import { useState } from 'react'
import { List, Create, Datagrid, TextField, Edit, SimpleForm, TextInput } from "react-admin";

export const UserList = () => {


    return <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="password" />
            <TextField source="username" />

        </Datagrid>
    </List>
}

export const UserEdit = () => {
    return <Edit>
        <SimpleForm>
            <TextInput source="id" disabled />
            <TextInput source="password" />
            <TextInput source="username" />
        </SimpleForm>
    </Edit>
}



export const UserCreate = () => {
    const required = (message = 'Required') => (value: any) => value ? undefined : message;
    const [username, setUsername] = useState('')
    const [usernameAgain, setUsernameAgain] = useState('')
    const name1Validation = (value:any, allValues:any) => {
        console.log(111111,value,allValues)
        if (!value) {
            return 'The age is required';
        }
        if (value!=allValues['usernameAgain']) {
            return '两次用户名不一致！';
        }
        
        return undefined;
    };
    const name2Validation = (value:any, allValues:any) => {
        
        if (!value) {
            return 'The age is required';
        }
        if (value!=allValues['username']) {
            return '两次用户名不一致！';
        }
        
        return undefined;
    };
    return <Create>
        <SimpleForm>

            <TextInput source="username" value={username} validate={[required(), name1Validation]} />
            <TextInput source="usernameAgain" value={usernameAgain} validate={[required(), name2Validation]} />
        </SimpleForm>
    </Create>

}

