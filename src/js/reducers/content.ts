import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import customTheme from '../theme';
import { Theme } from '@mui/material';
import { Card } from '../types/global';
type Action = ActionType<typeof actions>;

export enum SortType {
  CREATE_TIME_ASC,
  CREATE_TIME_DESC,
  NAME_ASC,
  NAME_DESC,
}

export type ContentState = {
  /** カードリスト */
  cardList: Card[];
  /** マイキャラごとに1枚ずつ抜き出したリスト */
  mycharaList: Card[];
  /** お気に入りQRリスト */
  favList: {
    [qr: string]: number;
  };
  /** ソート種別 */
  sortType: SortType;
  theme: {
    mode: 'light' | 'dark';
    theme: Theme;
  };
  /** リストから除外するリスト */
  ignoreCharaList: string[];

  reader: {
    timer: number;
  };

  displaySetting: {
    qrSize: number;
    readerDeviceId: string;
  };

  /** データ登録のときの所有者名 */
  defaultUsername: string;
  /** 自分のマイキャラ名のリスト */
  mycharaNameList: string[];
};

export const initial: ContentState = {
  cardList: [],
  mycharaList: [],
  ignoreCharaList: [],
  favList: {},
  sortType: SortType.CREATE_TIME_ASC,
  theme: {
    mode: 'light',
    theme: customTheme('light'),
  },
  reader: {
    timer: 0,
  },
  displaySetting: {
    qrSize: 100,
    readerDeviceId: '',
  },
  defaultUsername: '',
  mycharaNameList: [],
};

const reducer = (state: ContentState = initial, action: Action): ContentState => {
  switch (action.type) {
    case getType(actions.updateTheme): {
      return {
        ...state,
        theme: {
          mode: action.payload,
          theme: customTheme(action.payload),
        },
      };
    }

    case getType(actions.updateReaderDevice): {
      return {
        ...state,
        displaySetting: {
          ...state.displaySetting,
          readerDeviceId: action.payload,
        },
      };
    }

    case getType(actions.updateCardList): {
      return {
        ...state,
        cardList: action.payload,
      };
    }

    case getType(actions.updateMycharaList): {
      return {
        ...state,
        mycharaList: action.payload,
      };
    }

    case getType(actions.updateMycharaIgnoreList): {
      return {
        ...state,
        ignoreCharaList: action.payload,
      };
    }

    case getType(actions.updateDispQr): {
      return {
        ...state,
        displaySetting: {
          ...state.displaySetting,
          qrSize: action.payload,
        },
      };
    }

    case getType(actions.updateDefaultUsername): {
      return {
        ...state,
        defaultUsername: action.payload,
      };
    }

    case getType(actions.addMycharaName): {
      return {
        ...state,
        mycharaNameList: [...state.mycharaNameList, action.payload],
      };
    }

    case getType(actions.deleteMycharaName): {
      return {
        ...state,
        mycharaNameList: state.mycharaNameList.filter((item) => item !== action.payload),
      };
    }

    default:
      return state;
  }
};

export default reducer;
