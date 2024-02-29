

import { List, Datagrid, TextField, FunctionField,Edit, SelectArrayInput, SimpleForm, TextInput } from "react-admin";

export const UserList = () => {


    return <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="fullName" />
            <TextField source="password" />
            <TextField source="username" />
            <FunctionField source="authority" render={(record:any) => `${record.authority.join('|')}`}/>
        </Datagrid>
    </List>
}

export const UserEdit = () => {


    return  <Edit>
    <SimpleForm>
        <SelectArrayInput source="authority" choices={[
                { id: 'users', name: 'users' },
                { id: 'pages', name: 'pages' }
            ]} />
        <TextInput source="fullName" />
        <TextInput source="id" disabled/>
        <TextInput source="password" />
        <TextInput source="username" />
    </SimpleForm>
</Edit>
}

