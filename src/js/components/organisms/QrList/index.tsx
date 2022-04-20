import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, TextField, Typography } from '@mui/material';
import { Card } from '../../../types/global';
import Modal from '../../molecules/Modal';
import { binStrToByte } from '../../../common/util';
import Qrcode from '../../molecules/Qrcode';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
const initCard: Card = { id: 0, name: '', qr: '', hasImage: false };
type ImageMap = {
  [hash: number]: string;
};

const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();
  const [registerModalOpen, setregisterModalOpen] = React.useState(false);
  // 0:新規 1:編集
  const [registerModalMode, setregisterModalMode] = React.useState<0 | 1>(0);
  const [cardModalOpen, setcardModalOpen] = React.useState(false);
  const [openCard, setOpenCard] = React.useState<Card>(initCard);
  // idをkeyとした画像の一覧
  const [imageMap, setImageMAp] = React.useState<ImageMap>({});
  const [dispCardList, setDispCardList] = React.useState<Card[]>([]);

  useEffect(() => {
    loadImageFromDb();
    setDispCardList(props.cardList);
  }, [JSON.stringify(props.cardList)]);

  const loadImageFromDb = async () => {
    const map: ImageMap = {};
    for (const card of props.cardList) {
      if (!card.hasImage) continue;

      const file = await window.fstorage.getItem(card.id.toString());
      if (typeof file === 'string') {
        map[card.id] = file;
      }
    }
    setImageMAp(map);
    console.log('imageMap\n' + JSON.stringify(map, null, '  '));
  };

  const closeModal = () => {
    setregisterModalOpen(false);
    setcardModalOpen(false);
    setOpenCard(initCard);
  };

  /** カード開く */
  const clickCard = (card: Card) => () => {
    console.log(`clickCard ` + JSON.stringify(card, null, '  '));
    setOpenCard(card);
    setcardModalOpen(true);
  };

  const editCard = (card: Card | undefined) => () => {
    if (card) {
      setOpenCard(card);
      setregisterModalMode(1);
    } else {
      const id = Math.floor(new Date().getTime() / 1000);
      setOpenCard({ id: id, name: '', qr: '', hasImage: false });
      setregisterModalMode(0);
    }
    setcardModalOpen(false);
    setregisterModalOpen(true);
  };

  const registCard = () => {
    const nameDom = document.getElementById('card_name') as HTMLInputElement;
    const name = nameDom.value.trim();
    const qrDom = document.getElementById('card_qr') as HTMLInputElement;
    const qr = qrDom.value.trim();
    const imageDom = document.getElementById('card_image') as HTMLInputElement;
    const imagefilename = imageDom.value;

    console.log(name);
    console.log(qr);
    console.log(imagefilename);
    // console.log(imageFile);

    if (!name) {
      props.changeNotify(true, 'warning', 'なまえを入れてね');
      return;
    }
    if (name.length > 30) {
      props.changeNotify(true, 'warning', 'なまえが長すぎるよ！');
      return;
    }
    if (!qr) {
      props.changeNotify(true, 'warning', 'QRを入れてね');
      return;
    }
    if (!qr.match(/^[a-fA-F0-9]+$/)) {
      props.changeNotify(true, 'warning', 'QRにはバイナリ文字列だけを入れてね');
      return;
    }
    if (qr.length > 60) {
      props.changeNotify(true, 'warning', 'そんなに長いQRはプリマジじゃないです');
      return;
    }

    // 登録
    props.postFriendCard({
      ...openCard,
      name,
      qr,
    });
    // モーダル閉じる
    closeModal();
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    //
    console.log(e);
    const target = e.target;
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const file = e.target?.result;
      if (file) {
        // IndexedDBに保存
        window.fstorage.setItem(`${openCard.id}`, file);
        imageMap[openCard.id] = file as string;
        setImageMAp(imageMap);
        setOpenCard({ ...openCard, hasImage: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const clickDeleteCard = () => {
    props.deleteFriendCardConfirm(openCard.id);
    closeModal();
  };

  const createImgCardList = (card: Card) => {
    const key = card.qr;

    return (
      <button key={key} className={'qritem'} onClick={clickCard(card)}>
        <Paper style={{ transform: 'translate(-50%, 0)', left: '50%', position: 'relative' }}>
          <img
            style={{ objectFit: 'contain' }}
            src={imageMap[card.id]}
            width={80}
            height={160}
            loading={'lazy'}
            onError={(e) => {
              e.currentTarget.src = 'img/img_load_err.jpg';
              e.currentTarget.removeAttribute('onerror');
              e.currentTarget.removeAttribute('onload');
            }}
            onLoad={(e) => {
              e.currentTarget.removeAttribute('onerror');
              e.currentTarget.removeAttribute('onload');
            }}
          />
          <div>
            <div>{card.name}</div>
          </div>
        </Paper>
      </button>
    );
  };

  return (
    <>
      <div>
        {/* メニューヘッダ */}
        <div className={'header'}>
          <div className={'header-inner'}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>Menu</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* 登録 */}
                <div>
                  <Button variant={'contained'} className={'registButton'} onClick={editCard(undefined)} style={{ width: 'calc(100% - 20px)', margin: 10 }}>
                    登録
                  </Button>
                </div>
                <div>(フィルタとかソートとか置きたい)</div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>

        {/* リスト */}
        <div className="content">{dispCardList.length > 0 ? dispCardList.map(createImgCardList) : 'Menuから登録してね'}</div>
      </div>

      {/* カード表示モーダル */}
      <Modal open={cardModalOpen} modalClose={closeModal}>
        <Paper>
          <div style={{ backgroundImage: openCard.hasImage ? `url(${imageMap[openCard.id]})` : '', backgroundSize: 'cover', backgroundPositionX: 'center' }}>
            <div className={'modalInner'} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', height: 400 }}>
              <div style={{ float: 'right' }}>
                <button className={'closeButton'} onClick={closeModal}>
                  x
                </button>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Qrcode
                  data={binStrToByte(openCard.qr)}
                  options={{
                    errorCorrectionLevel: 'M',
                    margin: 2,
                    width: props.qrSize,
                  }}
                  tagType={'img'}
                />
                <div>
                  <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'}>{openCard.name}</Typography>
                </div>
              </div>
              <div style={{ position: 'fixed', bottom: 10 }}>
                <Button variant={'contained'} color={'error'} onClick={clickDeleteCard} style={{ marginRight: 10 }}>
                  削除
                </Button>
                <Button variant={'contained'} color={'info'} onClick={editCard(openCard)}>
                  編集
                </Button>
              </div>
            </div>
          </div>
        </Paper>
      </Modal>

      {/* 登録モーダル */}
      <Modal open={registerModalOpen} modalClose={closeModal}>
        <Paper>
          <div className={'modalInner'} style={{ height: '80vh' }}>
            <div style={{ float: 'right' }}>
              <button className={'closeButton'} onClick={closeModal}>
                x
              </button>
            </div>
            <div style={{ marginTop: 50 }}>
              <div>なまえ</div>
              <TextField variant={'filled'} id="card_name" defaultValue={openCard.name} fullWidth={true} />
            </div>
            <div>
              <div>QR</div>
              <TextField variant={'filled'} id="card_qr" defaultValue={openCard.qr} rows={5} fullWidth={true} />
            </div>
            <div>
              <div>画像</div>
              <input type={'file'} id="card_image" accept="image/*" onChange={uploadImage} />
              {openCard.hasImage && <img style={{ maxHeight: '20vh' }} src={imageMap[openCard.id]} />}
            </div>
            <div style={{ marginTop: 50 }}>
              <Button variant={'contained'} color={'success'} onClick={registCard}>
                {registerModalMode === 0 ? '登録' : '更新'}
              </Button>
            </div>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

// state
const mapStateToProps = (state: RootState) => {
  return {
    cardList: state.content.cardList,
    qrSize: state.content.displaySetting.qrSize,
    theme: state.content.theme.mode,
  };
};

// action
const mapDispatchToProps = {
  changeNotify: actions.changeNotify,
  postFriendCard: actions.postFriendCard,
  deleteFriendCardConfirm: actions.deleteFriendCardConfirm,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
