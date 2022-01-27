import { signIn, signOut } from "next-auth/react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ButtonGroup from '@mui/material/ButtonGroup';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { createStyles, makeStyles } from '@mui/styles';
import { useSession } from "next-auth/react"
import Skeleton from '@mui/material/Skeleton';

import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from "@mui/icons-material/AccountCircle";
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import QueryStatsIcon from '@mui/icons-material/QueryStats';


const useStyles = makeStyles((theme) => createStyles({
  root: {
    position: "absolute",
    right: 0
  },
  buttonBar: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
  },
  drawerButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    },
  }
}));

const Navbar = () => {
    const { data: session, status } = useSession()
    const loading = status === "loading"
    const classes = useStyles();

    const [drawer, setDrawer] = React.useState(false)
    const toggleDrawer = (open) => (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setDrawer(open)
    };
    const [dropdown, setDropdown] = React.useState(null)
    const dropdownOpen = Boolean(dropdown);
    const toggleDropdown = (event) => {
      if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
        return;
      }
  
      setDropdown(event.currentTarget)
    };
    if(loading) {
      return <Skeleton animation="wave" variant="rectangular" height={50} />
    } else {
      return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              className={classes.drawerButton}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Button color="inherit" href="/">PR0GRAMM_MUSIC</Button>
              </Typography>
              <ButtonGroup variant="text" className={classes.buttonBar}>
                {session?.user.roles.includes('admin') && <Button color="inherit" startIcon={<ArticleOutlinedIcon />} href="/admin">Admin Dashboard</Button>}
                <Button color="inherit" startIcon={<ArticleOutlinedIcon />} href="/changelog">Changelog</Button>
                <Button color="inherit" startIcon={<QueryStatsIcon />} href="/stats">Statistik</Button>
                <Button color="inherit" startIcon={<DescriptionIcon />} href="https://doc.pr0sauce.info">API Docs</Button>
                <Button color="inherit" startIcon={<GitHubIcon />} href="https://github.com/pacerino">GitHub</Button>
                {!session ? (
                  <Button color="inherit" onClick={signIn}>
                    Login
                  </Button>
                ) : (
                    <Button
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                      onClick={toggleDropdown}
                      color="inherit"
                      endIcon={<AccountCircle />}
                    >
                      {session.user.name}
                    </Button>
                )}
              </ButtonGroup>
            </Toolbar>
          </AppBar>
          <Menu
            id="menu-appbar"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorEl={dropdown}
            open={dropdownOpen}
            onClose={toggleDropdown}
          >
            <MenuItem
              onClick={(e) => {
                toggleDropdown(e);
                signOut();
              }}
            >
              Logout
            </MenuItem>
            <MenuItem onClick={toggleDropdown}>My account</MenuItem>
          </Menu>
          <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)} >
          <ListItem component="div" disablePadding>
            <ListItemButton sx={{ height: 56 }}>
              <ListItemIcon>
                <AccountCircle sx={{color: "text.primary"}} />
              </ListItemIcon>
              <ListItemText
                primary={(session ? session.user.name.toUpperCase() : 'Nicht eingeloggt')}
                primaryTypographyProps={{
                  color: 'text.primary',
                  fontWeight: 'medium',
                  variant: 'body2',
                }}
              />
            </ListItemButton>
            {!session ? (
            <Tooltip title="Einloggen">
              <IconButton size="large" onClick={signIn}>
                <LoginIcon sx={{color: "text.primary"}}/>
              </IconButton>
            </Tooltip>
            ) : (
              <Tooltip title="Ausloggen">
              <IconButton size="large" onClick={signOut}>
                <LogoutIcon sx={{color: "text.primary"}}/>
              </IconButton>
            </Tooltip>
            )}
          </ListItem>
          <Divider sx={{ borderColor: "text.primary" }}/>
          <List>
            <ListItem button component="a" href="/changelog">
              <ListItemButton>
                <ListItemIcon>
                  <ArticleOutlinedIcon sx={{color: "text.primary"}}/>
                </ListItemIcon>
                <ListItemText>Changelog</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem button component="a" href="/stats">
              <ListItemButton>
                <ListItemIcon>
                  <QueryStatsIcon sx={{color: "text.primary"}}/>
                </ListItemIcon>
                <ListItemText>Statistik</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem button component="a" href="https://doc.pr0sauce.info">
              <ListItemButton>
                <ListItemIcon>
                  <DescriptionIcon sx={{color: "text.primary"}}/>
                </ListItemIcon>
                <ListItemText>API Docs</ListItemText>
              </ListItemButton>
            </ListItem>
            <ListItem button component="a" href="https://github.com/pacerino">
              <ListItemButton>
                <ListItemIcon>
                  <GitHubIcon sx={{color: "text.primary"}}/>
                </ListItemIcon>
                <ListItemText>GitHub</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
      </Box>
      );
    }
}

export default Navbar

