import { call, put, take, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions';
import { Card } from '../types/global';
import { fetchJson, postJson } from './common';

export default function* rootSaga() {
  // DB初期設定
  yield call(initDB);
  // yield takeEvery(actions.updatePostFriendCard, postFriendCard);
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

// function* postFriendCard(action: ReturnType<typeof actions.updatePostFriendCard>) {
//   const data = action.payload;
//   try {
//     // https://docs.google.com/forms/d/e/1FAIpQLSfsg7oinHp22MDN1YUrUeRbNqPwv5AQ2icfLb99S6C2tvbbFQ/viewform
//     // ?usp=pp_url&entry.50175958=name&entry.1947963319=username&entry.1188605436=coordi
//     // &entry.363804438=5412345111111111111111111111111111111111111111111111&entry.2143851829=http://aaaaaaaa&entry.2079338561=hitokoto&entry.1368990265=tag1+tag2
//     const body = {
//       'entry.1947963319': data.username,
//       'entry.50175958': data.name,
//       'entry.1188605436': data.coordiname,
//       'entry.363804438': data.qr,
//       'entry.2143851829': data.imgUrl,
//       'entry.2079338561': data.comment,
//       'entry.1368990265': data.tags,
//     };
//     const url = 'https://docs.google.com/forms/d/1FAIpQLSfsg7oinHp22MDN1YUrUeRbNqPwv5AQ2icfLb99S6C2tvbbFQ/formResponse';
//     yield call(postJson, url, body);
//   } catch (e) {
//     yield call(errorHandler, { ...e, message: 'フォームへの投稿でエラーが起きました' });
//   }
// }
