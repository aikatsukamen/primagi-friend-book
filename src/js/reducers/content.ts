import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import customTheme from '../theme';
import { Theme } from '@mui/material';
import { Card } from '../types/global';
type Action = ActionType<typeof actions>;

export enum SortType {
  TIMESTAMP_ASC,
  TIMESTAMP_DESC,
  CHARA_NAME_ASC,
  CHARA_NAME_DESC,
}

export type ContentState = {
  /** カードリスト */
  cardList: Card[];
  /** マイキャラごとに1枚ずつ抜き出したリスト */
  mycharaList: Card[];
  /** お気に入りQRリスト */
  favList: {
    id: string;
    name: string;
    cards: string[];
  }[];
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
};

export const initial: ContentState = {
  cardList: [],
  mycharaList: [],
  ignoreCharaList: [],
  favList: [],
  sortType: SortType.TIMESTAMP_DESC,
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

    case getType(actions.changeSortType): {
      return {
        ...state,
        sortType: action.payload,
      };
    }

    case getType(actions.createFavorite): {
      const id = new Date().getTime() - 1665661000000;
      return {
        ...state,
        favList: [
          ...state.favList,
          {
            id: id.toString(),
            name: action.payload,
            cards: [],
          },
        ],
      };
    }

    case getType(actions.changeFavorite): {
      return {
        ...state,
        favList: state.favList.map((item) => {
          let name = item.name;
          if (item.id === action.payload.id) {
            name = action.payload.name;
          }
          return {
            ...item,
            name,
          };
        }),
      };
    }

    case getType(actions.deleteFavorite): {
      return {
        ...state,
        favList: state.favList.filter((item) => item.id !== action.payload),
      };
    }
    case getType(actions.favoriteAddCard): {
      return {
        ...state,
        favList: state.favList.map((item) => {
          return {
            ...item,
            cards: [...item.cards, action.payload.qr],
          };
        }),
      };
    }
    case getType(actions.favoriteDeleteCard): {
      return {
        ...state,
        favList: state.favList.map((item) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              cards: item.cards.filter((card) => card !== action.payload.qr),
            };
          } else {
            return item;
          }
        }),
      };
    }

    default:
      return state;
  }
};

export default reducer;
