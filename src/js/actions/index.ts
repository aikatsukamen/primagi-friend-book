import { action, createAction } from 'typesafe-actions';
import { RootState } from '../reducers';
import { SortType } from '../reducers/content';
import { DialogState } from '../reducers/notify';
import { Card } from '../types/global';

const OPEN_NOTIFY = 'OPEN_NOTIFY';
const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const DIALOG_YES = 'DIALOG_YES';
const DIALOG_NO = 'DIALOG_NO';

const UPDATE_STATUS = 'UPDATE_STATUS';
export const updateStatus = createAction(UPDATE_STATUS, (action) => {
  return (status: RootState['notify']['status']) => action(status);
});

/** 通知欄表示 */
export const changeNotify = createAction(OPEN_NOTIFY, (action) => {
  return (show: boolean, type: 'info' | 'warning' | 'error', message: string, closable?: boolean) => action({ show, type, message, closable: closable === false ? false : true });
});
/** 通知欄閉じる */
export const closeNotify = createAction(CLOSE_NOTIFY);

/** ダイアログ表示 */
export const changeDialog = createAction(OPEN_DIALOG, (action) => {
  return (args: Partial<DialogState>) => action(args);
});
/** ダイアログ閉じる */
export const closeDialog = createAction(CLOSE_DIALOG);

export const dialogYes = createAction(DIALOG_YES, (action) => {
  return (args: any) => action(args);
});
export const dialogNo = createAction(DIALOG_NO, (action) => {
  return (args: any) => action(args);
});

// テーマ設定
const UPDATE_THEME = 'UPDATE_THEME';
export const updateTheme = createAction(UPDATE_THEME, (action) => {
  return (mode: 'light' | 'dark') => action(mode);
});

// コードリーダーのデバイスを変更
const UPDATE_READER_DEVICE = 'UPDATE_READER_DEVICE';
/** コードリーダーのデバイスIDを選択 */
export const updateReaderDevice = createAction(UPDATE_READER_DEVICE, (action) => {
  return (deviceId: string) => action(deviceId);
});

const UPDATE_DISP_QR = 'UPDATE_DISP_QR';
export const updateDispQr = createAction(UPDATE_DISP_QR, (action) => {
  return (size: number) => action(size);
});

const UPDATE_SORT_TYPE = 'UPDATE_SORT_TYPE';
export const updateSortType = createAction(UPDATE_SORT_TYPE, (action) => {
  return (type: SortType) => action(type);
});

const UPDATE_FAV_LIST = 'UPDATE_FAV_LIST';
export const updateFavList = createAction(UPDATE_FAV_LIST, (action) => {
  return (qr: string, value: number | undefined) => action({ qr, value });
});

const UPDATE_CARD_LIST = 'UPDATE_CARD_LIST';
export const updateCardList = createAction(UPDATE_CARD_LIST, (action) => {
  return (cardList: Card[]) => action(cardList);
});

const UPDATE_MYCHARA_LIST = 'UPDATE_MYCHARA_LIST';
export const updateMycharaList = createAction(UPDATE_MYCHARA_LIST, (action) => {
  return (cardList: Card[]) => action(cardList);
});

const UPDATE_MYCHARA_IGNORE_LIST = 'UPDATE_MYCHARA_IGNORE_LIST';
export const updateMycharaIgnoreList = createAction(UPDATE_MYCHARA_IGNORE_LIST, (action) => {
  return (nameList: string[]) => action(nameList);
});

// デフォルトユーザー名を更新
const UPDATE_DEFAULT_USERNAME = 'UPDATE_DEFAULT_USERNAME';
export const updateDefaultUsername = createAction(UPDATE_DEFAULT_USERNAME, (action) => {
  return (name: string) => action(name);
});

// マイキャラ名を更新
const ADD_MYCHARA_NAME = 'ADD_MYCHARA_NAME';
export const addMycharaName = createAction(ADD_MYCHARA_NAME, (action) => {
  return (name: string) => action(name);
});
const DELETE_MYCHARA_NAME = 'DELETE_MYCHARA_NAME';
export const deleteMycharaName = createAction(DELETE_MYCHARA_NAME, (action) => {
  return (name: string) => action(name);
});

// // フォーム登録
// const POST_FRIEND_CARD = 'POST_FRIEND_CARD';
// export const updatePostFriendCard = createAction(POST_FRIEND_CARD, (action) => {
//   return (obj: { username: string; name: string; coordiname: string; qr: string; imgUrl: string; comment: string; tags: string }) => action(obj);
// });
/** ソート順変更 */
const CHANGE_SORT_TYPE = 'CHANGE_SORT_TYPE';
export const changeSortType = createAction(CHANGE_SORT_TYPE, (action) => {
  return (sortType: SortType) => action(sortType);
});

/** お気に入り作成 */
const CREATE_FAVORITE = 'CREATE_FAVORITE';
export const createFavorite = createAction(CREATE_FAVORITE, (action) => {
  return (name: string) => action(name);
});

/** お気に入り名変更 */
const CHANGE_FAVORITE = 'CHANGE_FAVORITE';
export const changeFavorite = createAction(CHANGE_FAVORITE, (action) => {
  return (id: string, name: string) => action({ id, name });
});

/** お気に入り削除 */
const DELETE_FAVORITE = 'DELETE_FAVORITE';
export const deleteFavorite = createAction(DELETE_FAVORITE, (action) => {
  return (id: string) => action(id);
});

/** お気に入りにカード追加 */
const FAVORITE_ADD_CARD = 'FAVORITE_ADD_CARD';
export const favoriteAddCard = createAction(FAVORITE_ADD_CARD, (action) => {
  return (id: string, qr: string) => action({ id, qr });
});

/** お気に入りからカード削除 */
const FAVORITE_DELETE_CARD = 'FAVORITE_DELETE_CARD';
export const favoriteDeleteCard = createAction(FAVORITE_DELETE_CARD, (action) => {
  return (id: string, qr: string) => action({ id, qr });
});
