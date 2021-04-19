import { Icon } from '@iconify/react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import clsx from 'clsx';
import React from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { setSidebarSelected, setWhetherSidebarOpen } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { SidebarEntry } from '../../redux/reducers/ui';
import store from '../../redux/stores/store';
import { ReactComponent as LogoLight } from '../../resources/icon-light.svg';
import { ReactComponent as LogoWithTextLight } from '../../resources/logo-light.svg';
import CreateButton from '../common/Resource/CreateButton';
import NavigationTabs from './NavigationTabs';
import prepareRoutes from './prepareRoutes';
import SidebarItem from './SidebarItem';
import VersionButton from './VersionButton';

export const drawerWidth = 330;

const useStyle = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    background: theme.palette.sidebarBg,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    background: theme.palette.sidebarBg,
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    background: theme.palette.sidebarBg,
  },
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.sidebarBg,
  },
  toolbar: {
    borderBottom: '1px solid #1e1e1e',
    paddingTop: theme.spacing(1.5),
    paddingLeft: (props: { isSidebarOpen: boolean }) =>
      props.isSidebarOpen ? theme.spacing(2) : theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  sidebarGrid: {
    height: '100%',
  },
  '.MuiListItemText-primary': {
    color: 'red',
  },
  logo: {
    height: '32px',
    width: 'auto',
  },
}));

export default function Sidebar() {
  const sidebar = useTypedSelector(state => state.ui.sidebar);
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = React.useMemo(() => prepareRoutes(), [sidebar.entries]);
  const [open, setOpen] = React.useState(sidebar.isSidebarOpen);
  const classes = useStyle({ isSidebarOpen: open });

  // Use the location to make sure the sidebar is changed, as it depends on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  useLocation();
  if (!sidebar?.isVisible) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <Button
          onClick={() => {
            dispatch(setWhetherSidebarOpen(!open));
            setOpen(!open);
          }}
          aria-label={open ? 'Shrink sidebar' : 'Expand sidebar'}
        >
          <SvgIcon
            className={classes.logo}
            component={open ? LogoWithTextLight : LogoLight}
            viewBox="0 0 auto 32"
          />
        </Button>
      </div>
      <Grid
        className={classes.sidebarGrid}
        container
        direction="column"
        justify="space-between"
        wrap="nowrap"
      >
        <Grid item>
          <List>
            {items.map((item, i) => (
              <SidebarItem key={i} selectedName={sidebar.selected} fullWidth={open} {...item} />
            ))}
          </List>
        </Grid>
        <Grid item>
          <Box textAlign="center">
            <CreateButton />
            <VersionButton />
          </Box>
        </Grid>
      </Grid>
    </Drawer>
  );
}

export function useSidebarItem(itemName: string | null) {
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      dispatch(setSidebarSelected(itemName));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
}

export { NavigationTabs };
