import { select, call, put, take, takeEvery, race } from 'redux-saga/effects';
import * as actions from '../actions';
import { alertSaga, confirmSaga } from './dialog';
import { RootState } from '../reducers';
import { Card, GeneratorType } from '../types/global';
import { fetchJson } from './common';

export default function* rootSaga() {
  // DB初期設定
  yield call(initDB);
}

function* initDB() {
  try {
    const json: Card[] = yield call(fetchJson, 'https://raw.githubusercontent.com/aikatsukamen/primagi-friend-data/main/friend_card.json?t=' + new Date().getTime());
    yield put(actions.updateCardList(json));
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
