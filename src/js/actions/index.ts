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
