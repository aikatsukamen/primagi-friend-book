import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import jsQR, { QRCode } from 'jsqr';
import { QRCodeRenderersOptions } from 'qrcode';
import { MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';
import Qrcode from '../../molecules/Qrcode';
import { binStrToByte, stopRecogQR } from '../../../common/util';

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
  const [qrData, setQrData] = React.useState<QRCode | null>(null);

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
    const width = 1080;
    const height = 1920;

    let devices = await navigator.mediaDevices.enumerateDevices();
    devices = devices.filter((device) => device.kind.includes('videoinput'));
    setDeviceList(devices);

    if (!devices.find((item) => item.deviceId === targetDeviceId)) return;

    // カメラ起動
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width,
        height,
        deviceId: targetDeviceId,
        facingMode: 'environment',
        frameRate: { ideal: 60, max: 60 },
      },
    });

    document.querySelector('video')!.srcObject = mediaStream;
    const video = document.querySelector('video') as HTMLVideoElement;
    const canv = document.createElement('canvas');
    canv.width = width;
    canv.height = height;
    const context = canv.getContext('2d') as CanvasRenderingContext2D;

    // 認識処理
    const id = window.setInterval(function () {
      context.drawImage(video, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        // 読み取れたら結果出力
        console.log(code);
        if (code.binaryData.length > 0) {
          stopRecogQR();
          setQrData(code);
        }
      }
    }, 10);
    window.codeReaderTimer = id;
  };

  const changeDeviceId = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
    props.updateDeviceId(event.target.value);
    startRecogQr(event.target.value);
  };

  const createQrReader = () => {
    return (
      <div style={{ height: '100%' }}>
        <video id="qrReader" autoPlay playsInline={true} className="qr_reader"></video>
        <div style={{ position: 'absolute', bottom: 70, width: '90%', margin: '5%' }}>
          <Select defaultValue={renderDeviceId} onChange={changeDeviceId} style={{ width: '90%' }}>
            {deviceList.map((item) => {
              return (
                <MenuItem key={item.deviceId} value={item.deviceId}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </div>
      </div>
    );
  };

  const createQrResult = () => {
    const qr = qrData as QRCode;
    const binStr = qr.binaryData.map((item) => `00${item.toString(16)}`.slice(-2)).join('');
    const txt = qr.data;
    const version = qr.version;
    const bytes = binStrToByte(binStr);
    const options: QRCodeRenderersOptions = {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    };

    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Qrcode data={qr.binaryData} options={options} tagType={'img'} />
        </div>
        <div>
          <Typography variant="h5">バイナリ(16進)</Typography>
          <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
            {binStr}
          </Typography>
        </div>

        {txt && (
          <div>
            <Typography variant="h5">テキスト</Typography>
            <Typography variant="body1" style={{ wordBreak: 'break-all' }}>
              {txt}
            </Typography>
          </div>
        )}

        <div>
          <Typography variant="h5">バージョン</Typography>
          <Typography variant="body1"> {version}</Typography>
        </div>
      </div>
    );
  };

  return <div style={{ height: '100%', padding: 10 }}>{!qrData ? createQrReader() : createQrResult()}</div>;
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    readerDeviceId: state.content.displaySetting.readerDeviceId,
  };
};

// action
const mapDispatchToProps = {
  updateDeviceId: actions.updateReaderDevice,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
