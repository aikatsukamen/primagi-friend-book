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

  reader: {
    timer: number;
  };

  displaySetting: {
    qrSize: number;
    readerDeviceId: string;
  };
};

export const initial: ContentState = {
  cardList: [],
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

    case getType(actions.updateDispQr): {
      return {
        ...state,
        displaySetting: {
          ...state.displaySetting,
          qrSize: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
