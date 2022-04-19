import { createAction } from 'typesafe-actions';
import { RootState } from '../reducers';
import { DialogState } from '../reducers/notify';

const OPEN_NOTIFY = 'OPEN_NOTIFY';
const CLOSE_NOTIFY = 'CLOSE_NOTIFY';
const OPEN_DIALOG = 'OPEN_DIALOG';
const CLOSE_DIALOG = 'CLOSE_DIALOG';

const RELOAD_TWEET_LIST = 'RELOAD_TWEET_LIST';

const DIALOG_YES = 'DIALOG_YES';
const DIALOG_NO = 'DIALOG_NO';

const UPLOAD_MEDIA = 'UPLOAD_MEDIA';
const STORE_MEDIA = 'STORE_MEDIA';
const DELETE_MEDIA = 'DELETE_MEDIA';

const LOGIN_DISCORD = 'LOGIN_DISCORD';
const LOGOUT_DISCORD = 'LOGOUT_DISCORD';
const STORE_DISCORD_USER_NAME = 'STORE_DISCORD_USER_NAME';

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

/** ツイートリロードボタン */
export const reloadTweetList = createAction(RELOAD_TWEET_LIST);

/** アップロードするファイルを取消 */
export const deleteMedia = createAction(DELETE_MEDIA, (action) => {
  return (index: number) => action(index);
});

// Discord
/** ログインする */
export const loginDiscord = createAction(LOGIN_DISCORD, (action) => {
  return () => action();
});

/** ログアウトする */
export const logoutDiscord = createAction(LOGOUT_DISCORD, (action) => {
  return () => action();
});

/** Discordのユーザ名を格納 */
export const storeDiscordUserName = createAction(STORE_DISCORD_USER_NAME, (action) => {
  return (username: string | null) => action(username);
});

// テーマ設定
const UPDATE_THEME = 'UPDATE_THEME';
export const updateTheme = createAction(UPDATE_THEME, (action) => {
  return (mode: 'light' | 'dark') => action(mode);
});

// コードリーダーのデバイスを変更
const UPDATE_READER_DEVICE = 'UPDATE_READER_DEVICE';
export const updateReaderDevice = createAction(UPDATE_READER_DEVICE, (action) => {
  return (deviceId: string) => action(deviceId);
});
// コードリーダーが動いてるタイマー
const UPDATE_READER_TIMER = 'UPDATE_READER_TIMER';
export const updateReaderTimer = createAction(UPDATE_READER_TIMER, (action) => {
  return (timer: number) => action(timer);
});
