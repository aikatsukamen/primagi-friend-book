import React from 'react';
import * as actions from '../../../actions';
import NavTabs from '../../organisms/NavTabs';
import QrList from '../../organisms/QrList';
import QrReader from '../../organisms/QrReader';
import Setting from '../../organisms/Setting';
import ListIcon from '@mui/icons-material/List';
import CameraIcon from '@mui/icons-material/QrCode2';
import SettingIcon from '@mui/icons-material/Settings';
import { Modal, Paper, Theme, ThemeProvider } from '@mui/material';
import { RootState } from '../../../reducers';
import { connect } from 'react-redux';
import customTheme from '../../../theme';
import { makeStyles } from '@mui/styles';
import SnackBar from '../../molecules/SnackBar';
import Dialog from '../../organisms/Dialog';

const useStyles = (theme: Theme) =>
  makeStyles({
    root: {
      justifyContent: 'center',
      display: 'initial',
      width: '100%',
      height: '100%',
    },
    content: {
      maxWidth: 1000,
      width: '100%',
      display: 'initial',
      height: '100%',
    },
    login: {
      padding: 10,
    },
    button: {
      margin: theme.spacing(1),
      float: 'right',
      top: '-60px',
    },
    icon: {},
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles(props.theme);
  const tabs = [
    {
      label: 'QRリーダー',
      icon: <CameraIcon />,
    },
    {
      label: 'カードリスト',
      icon: <ListIcon />,
    },
    {
      label: '設定',
      icon: <SettingIcon />,
    },
  ];
  return (
    <ThemeProvider theme={props.theme}>
      <Paper className={classes.root}>
        <div className={'SW-update-dialog'} />
        <NavTabs tabs={tabs} style={{ top: 0 }}>
          <QrReader />
          <QrList />
          <Setting />
        </NavTabs>
      </Paper>

      {/* 通知系 */}
      <Dialog />

      <SnackBar open={props.notify.show} message={props.notify.message} variant={props.notify.type} closable={props.notify.closable} onClose={props.closeNotify} />
    </ThemeProvider>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    notify: state.notify.notify,
    dialog: state.notify.dialog,
    theme: customTheme(state.content.theme.mode),
  };
};

// action
const mapDispatchToProps = {
  closeNotify: actions.closeNotify,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
