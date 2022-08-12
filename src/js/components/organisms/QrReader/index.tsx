import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import jsQR from 'jsqr';
import { QRCodeRenderersOptions } from 'qrcode';
import { Button, IconButton, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import ClipboardIcon from '@mui/icons-material/ContentCopy';
import Qrcode from '../../molecules/Qrcode';
import { stopRecogQR } from '../../../common/util';
import { binToStr } from '../../../sagas/common';

const useStyles = () =>
  makeStyles({
    root: {
      display: 'flex',
      position: 'relative',
    },
  })();

type ComponentProps = ReturnType<typeof mapStateToProps>;
type ActionProps = typeof mapDispatchToProps;

type PropsType = ComponentProps & ActionProps;
const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();

  const [deviceList, setDeviceList] = React.useState<MediaDeviceInfo[]>([]);
  const [renderDeviceId, setDeviceId] = React.useState(props.readerDeviceId);
  const [qrData, setQrData] = React.useState<{ byte: number[]; data: string; version: number } | null>(null);
  const [isShowForm, setIsShowForm] = React.useState<boolean>(false);

  const [mycharaname, setMycharaname] = React.useState('');
  // const nameRef = React.useRef<HTMLSelectElement>();
  const usernameRef = React.useRef<HTMLInputElement>();
  // const coordinameRef = React.useRef<HTMLInputElement>();
  // const imgurlRef = React.useRef<HTMLInputElement>();
  // const commentRef = React.useRef<HTMLInputElement>();
  // const tagRef = React.useRef<HTMLInputElement>();

  const changeMycharaname = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    setMycharaname(event.target.value);
  };

  const openForm = () => {
    setIsShowForm(true);
  };
  const closeForm = () => {
    setIsShowForm(false);
    setQrData(null);

    startRecogQr();
  };

  useEffect(() => {
    startRecogQr();
  }, []);

  /**
   * QRコードの認識開始
   */
  const startRecogQr = async (deviceId = '') => {
    const targetDeviceId = deviceId ? deviceId : renderDeviceId;
    console.log('startRecogQr deviceId=' + targetDeviceId);
    stopRecogQR();

    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((device) => device.kind.includes('videoinput'));
    console.log(devices);
    setDeviceList(devices);

    if (!devices.find((item) => item.deviceId === targetDeviceId)) {
      return;
    }

    const aspect =
      window.innerWidth - window.innerHeight > 0
        ? {
            min: 0.5625,
            ideal: 1.5,
            max: 2,
          }
        : {
            min: 0.5625,
            ideal: 0.75,
            max: 2,
          };

    // カメラ起動
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        aspectRatio: aspect,
        width: {
          min: 480,
          ideal: 1080,
        },
        height: {
          min: 480,
          ideal: 1080,
        },
        deviceId: targetDeviceId ? targetDeviceId : undefined,
        facingMode: 'environment',
        frameRate: { ideal: 30, max: 60 },
      },
    });

    document.querySelector('video')!.srcObject = mediaStream;
    console.log(`${document.querySelector('video')!.width}  ${document.querySelector('video')!.height}`);

    const video = document.querySelector('video') as HTMLVideoElement;
    const canv = document.createElement('canvas');
    canv.width = 720;
    canv.height = 720;
    const context = canv.getContext('2d') as CanvasRenderingContext2D;

    // 認識処理
    const id = window.setInterval(function () {
      context.drawImage(video, 0, 0, 720, 720);

      const imageData = context.getImageData(0, 0, 720, 720);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        // 読み取れたら結果出力
        console.log(code);
        if (code.binaryData.length > 0) {
          stopRecogQR();
          setQrData({ byte: code.binaryData, data: code.data, version: code.version });
        }
      }
    }, 50);
    window.codeReaderTimer = id;
  };

  const changeDeviceId = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    props.updateDeviceId(event.target.value);
    startRecogQr(event.target.value);
  };

  const copyQr = (qr: string, category: string) => () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(qr);
      props.changeNotify(true, 'info', category + 'をコピーしました', true);
    } else {
      props.changeNotify(true, 'warning', 'このブラウザはコピーに非対応です', true);
    }
  };

  const clickPostForm = () => {
    // const name = nameRef.current?.value ?? '';
    const name = mycharaname;
    const username = usernameRef.current?.value ?? '';
    // const coordiname = coordinameRef.current?.value ?? '';
    const qr = binToStr(qrData);
    // const imgUrl = imgurlRef.current?.value ?? '';
    // const comment = commentRef.current?.value ?? '';
    // const tags = tagRef.current?.value ?? '';

    const url = `https://docs.google.com/forms/d/e/1FAIpQLSfsg7oinHp22MDN1YUrUeRbNqPwv5AQ2icfLb99S6C2tvbbFQ/viewform?usp=pp_url&entry.50175958=${name}&entry.1947963319=${username}&entry.363804438=${qr}`;
    window.open(url, '_blank');

    // props.postForm({
    //   username,
    //   name,
    //   coordiname,
    //   qr,
    //   imgUrl,
    //   comment,
    //   tags,
    // });
  };

  const createQrReader = () => {
    return (
      <div style={{ height: '100%' }}>
        <video id="qrReader" autoPlay playsInline={true} className="qr_reader" width={720} height={720}></video>
        <div style={{ position: 'absolute', bottom: 70, width: '90%', margin: '5%' }}>
          <Typography variant={'h6'}>カメラデバイス選択</Typography>
          <Select defaultValue={renderDeviceId} onChange={changeDeviceId} style={{ width: '90%' }}>
            {deviceList.map((item, index) => {
              return (
                <MenuItem key={item.deviceId} value={item.deviceId}>
                  {item.label ? item.label : `デバイス${index}`}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
    );
  };

  const createQrResult = () => {
    const byte = qrData?.byte ?? [];
    const txt = qrData?.data ?? '';
    const binStr = byte.map((item) => `00${item.toString(16)}`.slice(-2)).join('');

    const version = qrData?.version ?? 0;
    const options: QRCodeRenderersOptions = {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    };

    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Qrcode data={byte} options={options} tagType={'img'} />
        </div>
        <div style={{ marginBottom: 50 }}>
          <Typography variant="h5">バイナリ(16進)</Typography>
          <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
            {binStr}
          </Typography>
          <div style={{ float: 'right', marginRight: 10 }} onClick={copyQr(binStr, 'バイナリ(16進)')}>
            <IconButton>
              <ClipboardIcon />
            </IconButton>
          </div>
        </div>

        {txt && (
          <div style={{ marginBottom: 50 }}>
            <Typography variant="h5">テキスト</Typography>
            <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
              {txt}
            </Typography>
            <div style={{ float: 'right', marginRight: 10 }} onClick={copyQr(txt, 'テキスト')}>
              <IconButton>
                <ClipboardIcon />
              </IconButton>
            </div>
          </div>
        )}

        <div>
          <Typography variant="h5">バージョン</Typography>
          <Typography variant="body1">{version}</Typography>
        </div>

        <div>
          <Button variant="contained" color="inherit" style={{ margin: 10 }} onClick={closeForm}>
            キャンセル
          </Button>
          <Button variant="contained" color="info" style={{ margin: 10 }} onClick={openForm}>
            登録する
          </Button>
        </div>
      </div>
    );
  };

  const createQrPostForm = () => {
    return (
      <div>
        <div>QR登録フォーム</div>
        <div>
          <div>所有者</div>
          <TextField inputRef={usernameRef} defaultValue={props.defaultUsername} fullWidth={true} />
        </div>
        <div>
          <div>マイキャラ名</div>
          <Select fullWidth={true} value={mycharaname} onChange={changeMycharaname}>
            <MenuItem key={'null'} value={''}>
              {'-'}
            </MenuItem>
            {props.mycharanameList.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div>
          <div>QRコード</div>
          <TextField value={binToStr(qrData)} fullWidth={true} />
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ margin: 10 }}>
            <Button variant="contained" color={'inherit'} onClick={closeForm}>
              キャンセル
            </Button>
          </div>
          <div style={{ margin: 10 }}>
            <Button variant="contained" onClick={clickPostForm}>
              GoogleFormへ
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return <div style={{ height: '100%', padding: 10 }}>{!qrData ? createQrReader() : isShowForm ? createQrPostForm() : createQrResult()}</div>;
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    readerDeviceId: state.content.displaySetting.readerDeviceId,
    defaultUsername: state.content.defaultUsername,
    mycharanameList: state.content.mycharaNameList,
  };
};

// action
const mapDispatchToProps = {
  updateDeviceId: actions.updateReaderDevice,
  changeNotify: actions.changeNotify,
  // postForm: actions.updatePostFriendCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
