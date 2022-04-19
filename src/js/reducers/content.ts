import { ActionType, getType } from 'typesafe-actions';
import * as actions from '../actions';
import customTheme from '../theme';
import { Theme } from '@mui/material';
type Action = ActionType<typeof actions>;

export type ContentState = {
  cardList: {
    id: number;
    name: string;
    qr: string;
    image: string;
  }[];

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

const initial: ContentState = {
  theme: {
    mode: 'light',
    theme: customTheme('light'),
  },
  cardList: [],
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

    case getType(actions.updateReaderTimer): {
      return {
        ...state,
        reader: {
          ...state.reader,
          timer: action.payload,
        },
      };
    }

    default:
      return state;
  }
};

export default reducer;
