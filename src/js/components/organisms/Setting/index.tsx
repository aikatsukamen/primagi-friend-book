import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, FormControl, FormControlLabel, FormLabel, Hidden, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import customTheme from '../../../theme';

const useStyles = () =>
  makeStyles({
    root: {
      width: '100%',
      padding: 10,
    },
    content: {
      marginBottom: 10,
    },
    controlButton: {
      margin: 5,
      padding: 2,
      border: 'solid 1px',
      borderRadius: '5px',
      width: 150,
      borderColor: 'black',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();
  const changeQrSize: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    //
  };

  const lightTheme = customTheme('light');
  const darkTheme = customTheme('dark');
  const [themeMode, setthemeMode] = React.useState(props.theme.mode);
  const handleChangeTheme = (event: any) => {
    setthemeMode(event.target.value);
    console.log(event.target.value);
    props.updateTheme(event.target.value);
  };

  const clickCacheDelete = () => {
    props.changeNotify(true, 'warning', '未実装だよ！');
  };

  return (
    <div className={classes.root}>
      {/* QR表示サイズ */}
      <div className={classes.content}>
        <Typography variant="h6">QRの表示サイズ</Typography>
        <input type={'tel'} defaultValue={props.qrsize} onChange={changeQrSize} />
      </div>

      {/* テーマ設定 */}
      <div className={classes.content}>
        <FormControl>
          {/* <FormLabel id="demo-row-radio-buttons-group-label">テーマ</FormLabel> */}
          <Typography variant="h6">テーマ</Typography>
          <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={themeMode} onChange={handleChangeTheme}>
            <div className={classes.controlButton} style={{ backgroundColor: lightTheme.palette.background.default }}>
              <FormControlLabel value="light" control={<Radio />} label="light" style={{ width: '100%', color: lightTheme.palette.text.primary }} />
            </div>
            <div className={classes.controlButton} style={{ backgroundColor: darkTheme.palette.background.default }}>
              <FormControlLabel value="dark" control={<Radio />} label="dark" style={{ width: '100%', color: darkTheme.palette.text.primary }} />
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      <div className={classes.content}>
        <Typography variant="h6">登録情報一括削除</Typography>
        <Button variant={'contained'} color={'error'} onClick={clickCacheDelete}>
          削除！
        </Button>
      </div>
    </div>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    qrsize: state.content.displaySetting.qrSize,
    theme: state.content.theme,
  };
};

// action
const mapDispatchToProps = {
  updateTheme: actions.updateTheme,
  changeNotify: actions.changeNotify,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
