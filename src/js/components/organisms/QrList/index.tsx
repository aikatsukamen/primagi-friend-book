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
const initCard: Card = { comment: '', coordinate: '', img: '', name: '', qr: '', tags: [], timestamp: '', username: '' };
type ImageMap = {
  [hash: number]: string;
};

const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();
  const [cardModalOpen, setcardModalOpen] = React.useState(false);
  const [openCard, setOpenCard] = React.useState<Card>(initCard);
  // 表示対象のカード
  const [dispCardList, setDispCardList] = React.useState<Card[]>([]);

  const [searchWord, setSearchWord] = React.useState<string>('');
  const changeSearchWord: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchWord(e.target.value);
  };

  useEffect(() => {
    setDispCardList(props.cardList);
  }, [JSON.stringify(props.cardList)]);

  useEffect(() => {
    // フィルターとか検索契機
    const newDispCardList: typeof dispCardList = props.cardList.filter((card) => {
      let isHit = false;

      if (card.name.includes(searchWord)) isHit = true;
      if (card.username.includes(searchWord)) isHit = true;
      if (card.coordinate.includes(searchWord)) isHit = true;
      if (card.comment.includes(searchWord)) isHit = true;

      return isHit;
    });

    setDispCardList(newDispCardList);
  }, [searchWord]);

  const closeModal = () => {
    setcardModalOpen(false);
    setOpenCard(initCard);
  };

  /** カード開く */
  const clickCard = (card: Card) => () => {
    console.log(`clickCard ` + JSON.stringify(card, null, '  '));
    setOpenCard(card);
    setcardModalOpen(true);
  };

  const createImgCardList = (card: Card) => {
    const key = card.qr;

    return (
      <button key={key} className={'qritem'} onClick={clickCard(card)}>
        <Paper style={{ transform: 'translate(-50%, 0)', left: '50%', position: 'relative' }}>
          <img
            style={{ objectFit: 'contain' }}
            src={card.img}
            // width={80}
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
            <Paper>
              <div onClick={(e) => e.preventDefault()}>
                <TextField onChange={changeSearchWord} placeholder={'検索ワード'} />
              </div>
            </Paper>

            {/* <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              </AccordionSummary>
              <AccordionDetails>フィルターとか</AccordionDetails>
            </Accordion> */}
          </div>
        </div>

        {/* リスト */}
        <div className="content">{dispCardList.length > 0 ? dispCardList.map(createImgCardList) : 'フォームから登録してね'}</div>
      </div>

      {/* カード表示モーダル */}
      <Modal open={cardModalOpen} modalClose={closeModal}>
        <Paper>
          <div
            style={{
              backgroundImage: `url(${openCard.img})`,
              backgroundSize: 'cover',
              backgroundPositionX: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className={'modalInner'}>
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
              {/* 説明とか */}
              <div>
                <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'} style={{ fontSize: 'small', marginTop: 10 }}>
                  コーデ
                </Typography>
                <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'}>{openCard.coordinate}</Typography>
                {openCard.comment ? (
                  <>
                    <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'} style={{ fontSize: 'small', marginTop: 10 }}>
                      ひとこと
                    </Typography>
                    <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'}>{openCard.comment}</Typography>
                  </>
                ) : (
                  ''
                )}

                <div style={{ marginTop: 30 }}>
                  {openCard.tags.map((tag, index) => {
                    return (
                      <Button key={index} style={{ margin: 5, letterSpacing: 0, padding: `1px 3px 1px 3px` }} variant={'contained'} color={'info'}>
                        #{tag}
                      </Button>
                    );
                  })}
                </div>
              </div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
