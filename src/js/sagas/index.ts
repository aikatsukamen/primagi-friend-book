import { call, put } from 'redux-saga/effects';
import * as actions from '../actions';
import { Card } from '../types/global';
import { fetchJson } from './common';

export default function* rootSaga() {
  // DB初期設定
  yield call(initDB);
}

function* initDB() {
  try {
    let json: Card[] = yield call(fetchJson, 'https://aikatsukamen.github.io/primagi-friend-data/friend_card.json?t=' + new Date().getTime());
    yield put(actions.updateCardList(json));

    json = yield call(fetchJson, 'https://aikatsukamen.github.io/primagi-friend-data/mychara.json?t=' + new Date().getTime());
    yield put(actions.updateMycharaList(json));
    yield put(actions.updateStatus('ok'));
  } catch (e) {
    yield call(errorHandler, e);
  }
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
