import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { alertSaga, confirmSaga } from './dialog';
import { RootState } from '../reducers';
import { GeneratorType } from '../types/global';
import { fetchJson } from './common';

export default function* rootSaga() {
  // テーマ設定
  // yield call(setTheme);
  // // 設定読み込み
  // yield call(fetchConfig);
  // yield takeEvery(actions.loginDiscord, oauthDiscord);
  // yield takeEvery(actions.reloadTweetList, fetchTweetListAndApplyState);
  // yield takeEvery(actions.submitTweet, submitTweet);
  // yield takeEvery(actions.deleteTweet, deleteTweet);
  // yield takeEvery(actions.uploadMedia, uploadMedia);
  // yield takeEvery(actions.deleteMedia, deleteMedia);
  // yield takeEvery(actions.addReplyTweet, addReplyTweet);
  // yield takeEvery(actions.addAttachUrl, addRetweet);
  // yield takeEvery(actions.logoutDiscord, logoutDiscord);
  // yield call(loginCheck);
  // yield put(actions.storeDiscordUserName('テストユーザ'));
  // // ツイート情報
  // yield call(fetchTweetListAndApplyState);
  // // ゲーム情報
  // yield call(fetchGameListAndApplyState);
}

function* errorHandler(error: any) {
  try {
    const message = (error.message as string) || '予期せぬエラーが発生しました。';
    yield put(actions.changeNotify(true, 'error', message));
    yield put(actions.updateStatus('error'));
  } catch (e) {
    console.error('★激辛だ★');
  }
}

// function* setTheme() {
//   try {
//     const theme = localStorage.getItem('theme');
//     if (!theme) {
//       // まだテーマが設定されてない場合はOSのテーマ設定を取得して適用
//       if (window.matchMedia('(prefers-color-scheme: dark)').matches == true) {
//         console.log('ダークモードだ');
//         yield put(actions.updateTheme('dark'));
//       } else {
//         console.log('ダークモードじゃない');
//       }
//     } else {
//       if (['light', 'dark'].includes(theme)) {
//         yield put(actions.updateTheme(theme as any));
//       }
//     }
//   } catch (e) {
//     //
//   }
// }
