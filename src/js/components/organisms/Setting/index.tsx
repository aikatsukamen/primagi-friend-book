import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Slider, Stack, Typography } from '@mui/material';
import customTheme from '../../../theme';
import Qrcode from '../../molecules/Qrcode';

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
  const [qrSize, setQrSize] = React.useState<number>(props.qrsize);
  const changeQrSize = () => {
    props.updateQrSize(qrSize);
  };

  const handleQrSliceChange = (event: Event, value: number | number[], activeThumb: number) => {
    // console.log(value);
    setQrSize(value as number);
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

  const createQrCode = () => {
    console.log('createQrCode' + qrSize);
    return (
      <div style={{ height: qrSize }}>
        <Qrcode
          key={qrSize}
          data={[
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            0,
            10,
            20,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
          ]}
          options={{
            errorCorrectionLevel: 'M',
            margin: 2,
            width: qrSize,
          }}
          tagType={'img'}
        />
      </div>
    );
  };

  useEffect(() => {
    //
  }, [qrSize]);

  return (
    <div className={classes.root}>
      {/* QR表示サイズ */}
      <div className={classes.content}>
        <Typography variant="h6">QRの表示サイズ</Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center" style={{ width: '90vw' }}>
          <Slider value={qrSize} min={50} max={350} onChange={handleQrSliceChange} />
        </Stack>

        {createQrCode()}
        <div>
          <Button variant={'contained'} color={'info'} onClick={changeQrSize} disabled={props.qrsize === qrSize}>
            反映
          </Button>
        </div>
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
  updateQrSize: actions.updateDispQr,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
