import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TypoGraphy from '@material-ui/core/Typography'
import { Link } from 'react-router-dom';



function NavBar(props) {

    return (
        <List component="nav">
            <ListItem component="div">
                <ListItemText inset>
                    <TypoGraphy color="inherit">
                         <img src="" height={30} alt=""/> 
               </TypoGraphy>
                </ListItemText>
                <ListItemText inset>
                    <TypoGraphy color="inherit" variant="subtitle1">
                        <Link className="navbarA" to="/">Home</Link>
               </TypoGraphy>
                </ListItemText>
                <ListItemText inset>
                    <TypoGraphy className="navbarA" color="inherit" variant="subtitle1">
                        <Link className="navbarA" to="/form">Form</Link>
               </TypoGraphy>
                </ListItemText>
                <ListItemText inset>
                    <TypoGraphy color="inherit" variant="subtitle1">
                        <Link className="navbarA" to="/admin">Admin</Link>
               </TypoGraphy>
                </ListItemText>
            </ListItem >

        </List>
    )
}


export default NavBar;
