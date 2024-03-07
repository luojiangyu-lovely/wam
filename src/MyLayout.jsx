
import * as React from 'react';
import { Layout } from 'react-admin';
import { AppBar, UserMenu, useUserMenu, Logout, Form, TextInput, SaveButton ,useUpdate} from 'react-admin';
import { } from "react-admin";
import { MenuItem, ListItemIcon, ListItemText, Dialog, DialogContent, DialogContentText, DialogTitle, Button, Grid } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings'




export const MyLayout = props => <Layout {...props} appBar={MyAppBar} />;

const MyAppBar = () => {
    return <AppBar
        userMenu={
            <UserMenu>
                <SettingsMenuItem />
                <Logout />
            </UserMenu>
        } />;
}

const SettingsMenuItem = React.forwardRef((props, ref) => {
    const [open, setOpen] = React.useState(false);
    const { onClose } = useUserMenu();
    const validateUserCreation = (values) => {
        const errors = {};
        if (!values.password) {
            errors.password = 'The password is required';
        }
        if (!values.passwordAgain) {
            errors.passwordAgain = 'The passwordAgain is required';;
        } else if (values.password!=values.passwordAgain) {
           
            errors.password = 'The two passwords are not the same';
            errors.passwordAgain = 'The two passwords are not the same';
        }
        return errors
    };
    const [update] = useUpdate();

    const postSave = (data)=>{
        const user =JSON.parse(localStorage.getItem('user')) 
        update(
            'users',
            { id: user.id, data: data, previousData: user }
        );
        onClose()
    }
    
    return (<React.Fragment>
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Change your password?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <Form validate={validateUserCreation} onSubmit={postSave}>
                        <Grid container>
                            <Grid item xs={12}>
                                <TextInput source="password" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextInput source="passwordAgain" />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <SaveButton />
                            </Grid>
                        </Grid>
                    </Form>
                </DialogContentText>
            </DialogContent>
      
        </Dialog>
        <MenuItem
            onClick={()=>setOpen(true)}
            ref={ref}
            // It's important to pass the props to allow Material UI to manage the keyboard navigation
            {...props}
        >
            <ListItemIcon>
                <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Pwd</ListItemText>
        </MenuItem>
    </React.Fragment>
    );
});