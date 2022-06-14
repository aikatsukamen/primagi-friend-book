import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { Card } from '../../../types/global';
import Modal from '../../molecules/Modal';
import { binStrToByte, isNew, yyyymmdd } from '../../../common/util';
import Qrcode from '../../molecules/Qrcode';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const App: React.SFC<PropsType> = (props: PropsType) => {
  const classes = useStyles();
  const [cardModalOpen, setcardModalOpen] = React.useState(false);
  const [openCard, setOpenCard] = React.useState<Card>(initCard);
  const [cardBackgroundVisiblity, setCardBackgroundVisiblity] = React.useState(true);

  // 表示対象のカード
  const [dispCardList, setDispCardList] = React.useState<Card[]>([]);
  // ワード検索
  const [searchWord, setSearchWord] = React.useState<string>('');
  const changeSearchWord: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchWord(e.target.value);
  };

  // タグ
  const [dispNameTags, setDispNameTags] = React.useState<string[]>([]);
  const [dispUserNameTags, setUserNameDispTags] = React.useState<string[]>([]);
  const [dispGeneralTags, setGeneralDispTags] = React.useState<string[]>([]);

  useEffect(() => {
    setDispCardList(props.cardList);
  }, [JSON.stringify(props.cardList)]);

  useEffect(() => {
    // フィルターとか検索契機
    let newDispCardList: typeof dispCardList = JSON.parse(JSON.stringify(props.cardList));

    // 無視リスト
    if (props.ignoreList.length > 0) {
      newDispCardList = newDispCardList.filter((card) => {
        if (props.ignoreList.includes(card.name)) return false;
        return true;
      });
    }

    // キャラ名
    if (dispNameTags.length > 0) {
      if (!dispNameTags.includes('全員')) {
        newDispCardList = props.cardList.filter((card) => {
          if (dispNameTags.includes(card.name)) return true;
          return false;
        });
      }
    }

    // 所有者
    if (dispUserNameTags.length > 0) {
      newDispCardList = newDispCardList.filter((card) => {
        if (dispUserNameTags.includes(card.username)) return true;
        return false;
      });
    }
    // 一般タグ
    // これはor条件にする
    if (dispGeneralTags.length > 0) {
      newDispCardList = newDispCardList.filter((card) => {
        for (const tag of card.tags) {
          if (dispGeneralTags.includes(tag)) return true;
        }
        return false;
      });
    }

    // 検索ワード
    newDispCardList = newDispCardList.filter((card) => {
      if (card.name.includes(searchWord)) return true;
      if (card.username.includes(searchWord)) return true;
      if (card.coordinate.includes(searchWord)) return true;
      if (card.comment.includes(searchWord)) return true;

      return false;
    });

    setDispCardList(newDispCardList);
  }, [searchWord, JSON.stringify(dispNameTags), JSON.stringify(dispGeneralTags), JSON.stringify(dispUserNameTags)]);

  const closeModal = () => {
    setcardModalOpen(false);
    setOpenCard(initCard);
    setCardBackgroundVisiblity(true);
  };

  /** カード開く */
  const clickCard = (card: Card) => () => {
    console.log(`clickCard ` + JSON.stringify(card, null, '  '));
    setOpenCard(card);
    setCardBackgroundVisiblity(true);
    setcardModalOpen(true);
  };
  /** カードのモーダルで背景だけ表示 */
  const clickCardBackgroundVisiblity = () => {
    setCardBackgroundVisiblity(!cardBackgroundVisiblity);
  };

  const addNameTag = (name: string) => () => {
    if (!dispNameTags.includes(name)) {
      setDispNameTags([...dispNameTags, name]);
    }
    closeModal();
  };
  const addUserNameTag = (name: string) => () => {
    if (!dispUserNameTags.includes(name)) {
      setUserNameDispTags([...dispUserNameTags, name]);
    }
    closeModal();
  };
  const addGeneralTag = (name: string) => () => {
    if (!dispGeneralTags.includes(name)) {
      setGeneralDispTags([...dispGeneralTags, name]);
    }
    closeModal();
  };
  const deleteNameTag = (name: string) => () => {
    setDispNameTags(dispNameTags.filter((tag) => tag !== name));
  };
  const deleteUserNameTag = (name: string) => () => {
    setUserNameDispTags(dispUserNameTags.filter((tag) => tag !== name));
  };
  const deleteGeneralTag = (name: string) => () => {
    setGeneralDispTags(dispGeneralTags.filter((tag) => tag !== name));
  };

  const createImgCardList = () => {
    // nameタグに何も無いならマイキャラリストにする
    if (dispNameTags.length === 0 && dispUserNameTags.length === 0) {
      return (
        <>
          {createAllCharaDispCard()}
          {props.mycharaList.filter((item) => !props.ignoreList.includes(item.name)).map((item) => createImgCard(item, true))}
        </>
      );
    } else if (dispCardList.length > 0) {
      return <>{dispCardList.map((item) => createImgCard(item, false))}</>;
    } else {
      // 0件
      return 'いないよ！';
    }
  };

  const createImgCard = (card: Card, isMyCharaList: boolean) => {
    const key = card.qr;

    return (
      <button key={key} className={'qritem'} onClick={isMyCharaList ? addNameTag(card.name) : clickCard(card)}>
        <Paper style={{ transform: 'translate(-50%, 0)', left: '50%', position: 'relative' }}>
          {!isMyCharaList && isNew(card.timestamp) ? <img className="newIcon" src="./img/icon_new.png" width={64} /> : ''}
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

  const createAllCharaDispCard = () => {
    return (
      <button key={'all'} className={'qritem'} onClick={addNameTag('全員')}>
        <Paper style={{ transform: 'translate(-50%, 0)', left: '50%', position: 'relative' }}>
          <img
            style={{ objectFit: 'contain' }}
            src={'./img/charaall.jpg'}
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
            <div>全キャラ表示</div>
          </div>
        </Paper>
      </button>
    );
  };

  const createDispTagList = () => {
    return (
      <div style={{ margin: 2 }}>
        {dispUserNameTags.map((tag) => (
          <Button key={tag} variant={'contained'} size={'small'} color={'success'} onClick={deleteUserNameTag(tag)} style={{ margin: 2 }}>
            {tag}
            <CloseIcon />
          </Button>
        ))}

        {dispNameTags.map((tag) => (
          <Button key={tag} variant={'contained'} size={'small'} color={'error'} onClick={deleteNameTag(tag)} style={{ margin: 2 }}>
            {tag}
            <CloseIcon />
          </Button>
        ))}

        {dispGeneralTags.map((tag) => (
          <Button key={tag} variant={'contained'} size={'small'} color={'info'} onClick={deleteGeneralTag(tag)} style={{ margin: 2 }}>
            {tag}
            <CloseIcon />
          </Button>
        ))}
      </div>
    );
  };

  return (
    <>
      <div>
        {/* メニューヘッダ */}
        <div className={'header'}>
          <div className={'header-inner'}>
            <Paper style={{ margin: 5, width: '95vw' }}>
              <div onClick={(e) => e.preventDefault()}>
                <TextField onChange={changeSearchWord} placeholder={'検索ワード'} fullWidth={true} />
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
        {dispNameTags.length === 0 && dispUserNameTags.length === 0 ? <div style={{ margin: 2 }}>表示するキャラを選んでね</div> : ''}
        {createDispTagList()}
        <div className="content">{createImgCardList()}</div>
        <div style={{ float: 'right', marginTop: -50, marginRight: 20, bottom: 0, position: 'sticky' }}>{props.status === 'processing' ? <CircularProgress /> : ''}</div>
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
            <div className={'modalInner'} style={{ backgroundColor: cardBackgroundVisiblity ? undefined : 'initial' }}>
              <div style={{ float: 'right' }}>
                <button className={'closeButton'} onClick={closeModal}>
                  x
                </button>
              </div>
              <div style={{ float: 'left' }} onClick={clickCardBackgroundVisiblity}>
                {cardBackgroundVisiblity ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </div>
              {cardBackgroundVisiblity ? (
                <>
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

                    <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'} style={{ fontSize: 'small', marginTop: 10 }}>
                      登録日
                    </Typography>
                    <Typography className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'}>{yyyymmdd(openCard.timestamp)}</Typography>

                    {/* タグ */}
                    <div style={{ marginTop: 30 }}>
                      {/* username */}
                      <Button
                        key={'username'}
                        style={{ margin: 5, letterSpacing: 0, padding: `1px 3px 1px 3px` }}
                        variant={'contained'}
                        color={'success'}
                        onClick={addUserNameTag(openCard.username)}
                      >
                        #{openCard.username}
                      </Button>
                      <Button
                        key={'name'}
                        style={{ margin: 5, letterSpacing: 0, padding: `1px 3px 1px 3px` }}
                        variant={'contained'}
                        color={'error'}
                        onClick={addNameTag(openCard.name)}
                      >
                        #{openCard.name}
                      </Button>
                      {openCard.tags.map((tag, index) => {
                        return (
                          <Button key={index} style={{ margin: 5, letterSpacing: 0, padding: `1px 3px 1px 3px` }} variant={'contained'} color={'info'} onClick={addGeneralTag(tag)}>
                            #{tag}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                ''
              )}
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
    status: state.notify.status,
    cardList: state.content.cardList,
    mycharaList: state.content.mycharaList,
    ignoreList: state.content.ignoreCharaList,
    qrSize: state.content.displaySetting.qrSize,
    theme: state.content.theme.mode,
  };
};

// action
const mapDispatchToProps = {
  changeNotify: actions.changeNotify,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
