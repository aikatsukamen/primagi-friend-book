import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@mui/styles';
import * as actions from '../../../actions';
import { RootState } from '../../../reducers';
import { Button, CircularProgress, Paper, TextField, Typography, Menu, MenuItem } from '@mui/material';
import { Card } from '../../../types/global';
import Modal from '../../molecules/Modal';
import { binStrToByte, isNew, yyyymmdd } from '../../../common/util';
import Qrcode from '../../molecules/Qrcode';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoFavoriteIcon from '@mui/icons-material/FavoriteBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import { SortType } from '../../../reducers/content';

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

  const [sortType, setSortType] = React.useState<SortType>(props.sortType);
  const changeSortType = () => {
    if (sortType >= 3) {
      setSortType(0);
      props.changeSortType(0);
    } else {
      setSortType(sortType + 1);
      props.changeSortType(sortType + 1);
    }
  };

  // タグ
  const [dispNameTags, setDispNameTags] = React.useState<string[]>([]);
  const [dispUserNameTags, setUserNameDispTags] = React.useState<string[]>([]);
  const [dispGeneralTags, setGeneralDispTags] = React.useState<string[]>([]);
  const [viewFavoriteId, setViewFavoriteId] = React.useState<string | null>(null);

  // favListのアンカー
  const [favCardAnchorEl, setFavCardAnchorEl] = React.useState<null | HTMLElement>(null);
  const [favAnchorEl, setFavAnchorEl] = React.useState<null | HTMLElement>(null);

  useEffect(() => {
    setDispCardList(props.cardList);
  }, [JSON.stringify(props.cardList)]);

  useEffect(() => {
    // フィルターとか検索契機
    let newDispCardList: typeof dispCardList = JSON.parse(JSON.stringify(props.cardList));

    // お気に入り
    const favList = props.favList.find((item) => item.id === viewFavoriteId);
    if (favList) {
      const favCards = favList ? favList.cards : [];
      newDispCardList = newDispCardList.filter((item) => {
        return favCards.includes(item.qr);
      });
    }

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

    // ソート
    switch (sortType) {
      case SortType.CHARA_NAME_ASC: {
        newDispCardList = newDispCardList.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        break;
      }
      case SortType.CHARA_NAME_DESC: {
        newDispCardList = newDispCardList.sort((a, b) => {
          if (a.name > b.name) return -1;
          if (a.name < b.name) return 1;
          return 0;
        });
        break;
      }
      case SortType.TIMESTAMP_ASC: {
        newDispCardList = newDispCardList.sort((a, b) => {
          if (a.timestamp > b.timestamp) return 1;
          if (a.timestamp < b.timestamp) return -1;
          return 0;
        });
        break;
      }
      case SortType.TIMESTAMP_DESC: {
        newDispCardList = newDispCardList.sort((a, b) => {
          if (a.timestamp > b.timestamp) return -1;
          if (a.timestamp < b.timestamp) return 1;
          return 0;
        });
        break;
      }
    }

    setDispCardList(newDispCardList);
  }, [searchWord, JSON.stringify(dispNameTags), JSON.stringify(dispGeneralTags), JSON.stringify(dispUserNameTags), sortType, viewFavoriteId]);

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
      if (name !== '全員' && dispNameTags.includes('全員')) {
        setDispNameTags([...dispNameTags.filter((item) => item !== '全員'), name]);
      } else {
        setDispNameTags([...dispNameTags, name]);
      }
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
  const deleteViewFavoriteTag = () => {
    setViewFavoriteId(null);
  };

  const createImgCardList = () => {
    // nameタグに何も無いならマイキャラリストにする
    if (dispNameTags.length === 0 && dispUserNameTags.length === 0 && viewFavoriteId === null) {
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

        {viewFavoriteId ? (
          <Button key={viewFavoriteId} variant={'contained'} size={'small'} color={'info'} onClick={deleteViewFavoriteTag} style={{ margin: 2 }}>
            {props.favList.find((fav) => fav.id === viewFavoriteId)?.name ?? 'こわれてます'}
            <CloseIcon />
          </Button>
        ) : (
          ''
        )}
      </div>
    );
  };

  const createSortButtonMsg = () => {
    switch (sortType) {
      case SortType.CHARA_NAME_ASC:
        return 'キャラ名\n▲昇順';
      case SortType.CHARA_NAME_DESC:
        return 'キャラ名\n▼降順';
      case SortType.TIMESTAMP_ASC:
        return '登録日時\n▲昇順';
      case SortType.TIMESTAMP_DESC:
        return '登録日時\n▼降順';
    }
  };

  const createFavListMenu = () => {
    const open = Boolean(favAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setFavAnchorEl(event.currentTarget);
    };
    // メニューの各項目クリック
    const handleClose = (id: string) => () => {
      setFavAnchorEl(null);
      if (!id) return;
      if (id === 'new') {
        // 新規追加
        const dialog = globalThis.prompt('作成するお気に入りの名前を入れてね');
        if (dialog) {
          props.createFavorite(dialog);
        }
      } else {
        // お気に入りビュー
        setViewFavoriteId(id);
        // タグはリセット
        setDispNameTags([]);
        setGeneralDispTags([]);
        setUserNameDispTags([]);
      }
    };

    const handleDeleteFavorite = (id: string) => (event: any) => {
      event.stopPropagation();
      const name = props.favList.find((item) => item.id === id)?.name;
      const confirmed = confirm(`「${name}」をほんとに消す？`);
      if (confirmed) {
        props.deleteFavorite(id);
        // タグからも消す
        if (viewFavoriteId === id) {
          setViewFavoriteId(null);
        }
      }
    };

    return (
      <div>
        <Button
          id="basic-button"
          color={'inherit'}
          variant={'contained'}
          style={{ margin: 10, marginTop: 0, marginBottom: 0, padding: 0, height: '100%' }}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <FavoriteIcon color={'error'} sx={{ fontSize: 40 }} />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={favAnchorEl}
          open={open}
          onClose={handleClose('')}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {props.favList.map((item) => {
            return (
              <MenuItem key={`${item.id}`} onClick={handleClose(item.id)}>
                <DeleteIcon color={'error'} onClick={handleDeleteFavorite(item.id)} style={{ marginRight: 10 }} /> <span>{item.name}</span>
              </MenuItem>
            );
          })}
          <MenuItem key={`new`} onClick={handleClose('new')}>
            ＊新規作成
          </MenuItem>
        </Menu>
      </div>
    );
  };

  /** カード一覧の方で表示するお気に入り登録・削除メニュー */
  const createAddFavMenu = () => {
    const open = Boolean(favCardAnchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setFavCardAnchorEl(event.currentTarget);
    };
    // メニューの各項目クリック
    const handleClose = () => {
      setFavCardAnchorEl(null);
    };

    const handleFavorite = (favid: string, qr: string, isRegistered: boolean) => (event: any) => {
      event.stopPropagation();
      if (isRegistered) {
        props.favoriteDeleteCard(favid, qr);
        console.log(`delete ${favid}, ${qr}`);
      } else {
        props.favoriteAddCard(favid, qr);
        console.log(`add ${favid}, ${qr}`);
      }
    };
    console.log(props.favList);

    return (
      <div>
        <Button
          id="basic-button"
          color={'inherit'}
          variant={'contained'}
          style={{ margin: 10, marginTop: 0, marginBottom: 0, height: '100%' }}
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          className={props.theme === 'light' ? 'bokashi' : 'bokashiDark'}
        >
          お気に入りに追加
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={favCardAnchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {props.favList.map((item) => {
            const isRegistered = item.cards.includes(openCard.qr);
            return (
              <MenuItem key={`${item.id}`} onClick={handleFavorite(item.id, openCard.qr, isRegistered)}>
                {isRegistered ? <FavoriteIcon /> : <NoFavoriteIcon />}
                {item.name}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  };

  return (
    <>
      <div>
        {/* メニューヘッダ */}
        <div className={'header'}>
          <div className={'header-inner'} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 65px', padding: 5 }}>
            {/* 検索 */}
            <Paper>
              <div onClick={(e) => e.preventDefault()}>
                <TextField onChange={changeSearchWord} placeholder={'検索ワード'} fullWidth={true} />
              </div>
            </Paper>
            {/* お気に入りメニュー */}
            {createFavListMenu()}
            {/* ソート */}
            <Button onClick={changeSortType} variant="contained" style={{ fontSize: 'small', padding: 0 }}>
              {createSortButtonMsg()}
            </Button>
          </div>
        </div>

        {/* リスト */}
        {dispNameTags.length === 0 && dispUserNameTags.length === 0 && viewFavoriteId === null ? <div style={{ margin: 2 }}>表示するキャラを選んでね</div> : ''}
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

                    {props.favList.length !== 0 && createAddFavMenu()}
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
    sortType: state.content.sortType,
    favList: state.content.favList,
  };
};

// action
const mapDispatchToProps = {
  changeNotify: actions.changeNotify,
  changeSortType: actions.changeSortType,
  createFavorite: actions.createFavorite,
  deleteFavorite: actions.deleteFavorite,
  favoriteAddCard: actions.favoriteAddCard,
  favoriteDeleteCard: actions.favoriteDeleteCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
