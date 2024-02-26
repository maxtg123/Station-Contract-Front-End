import React, { ReactNode, useMemo, useReducer } from 'react';
import { IHopDongDamPhanTienTrinh } from 'src/@types/damphan';
import { IHopDongPheDuyet } from 'src/@types/hopdong';
import { IHopDong, IHopDongForm } from 'src/@types/hopdongmatbang';

type ITypeRightBar = 'phe_duyet' | 'dam_phan';

type SET_DATA_FOR_RIGHT_BAR = {
  type: 'set-data-for-right-bar';
  payload: {
    id: number;
    type: ITypeRightBar;
    data: IHopDongPheDuyet | IHopDongDamPhanTienTrinh | null;
  };
};
type RESET_DATA_RIGHT_BAR = {
  type: 'reset-data-right-bar';
};
type SET_DATA_HOP_DONG = {
  type: 'set-data-hop-dong';
  payload: IHopDong;
};
type TOGGLE_REFRESH_PHE_DUYET = {
  type: 'toggle-refresh-phe-duyet';
};
type OPEN_EDIT_HOP_DONG = {
  type: 'open-edit-hop-dong';
};
type CLOSE_EDIT_HOP_DONG = {
  type: 'close-edit-hop-dong';
};

type Action =
  | SET_DATA_FOR_RIGHT_BAR
  | RESET_DATA_RIGHT_BAR
  | SET_DATA_HOP_DONG
  | TOGGLE_REFRESH_PHE_DUYET
  | OPEN_EDIT_HOP_DONG
  | CLOSE_EDIT_HOP_DONG;

type Dispatch = (action: Action) => void;

type State = {
  rightBar: {
    id: number;
    type: ITypeRightBar;
    data: IHopDongPheDuyet | IHopDongDamPhanTienTrinh | null;
  } | null;
  hopDong: IHopDong | null;
  hopDongForm: IHopDongForm | null;
  refetchPheDuyet: boolean;
  openEditHopDong: boolean;
};

const INIT_STATE: State = {
  rightBar: null,
  hopDong: null,
  hopDongForm: null,
  refetchPheDuyet: false,
  openEditHopDong: false,
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  if (action.type === 'set-data-for-right-bar') {
    return {
      ...state,
      rightBar: action.payload,
    };
  }
  if (action.type === 'reset-data-right-bar') {
    return {
      ...state,
      rightBar: null,
    };
  }
  if (action.type === 'set-data-hop-dong') {
    return {
      ...state,
      hopDong: action.payload,
    };
  }
  if (action.type === 'toggle-refresh-phe-duyet') {
    return {
      ...state,
      refetchPheDuyet: !state.refetchPheDuyet,
    };
  }
  if (action.type === 'open-edit-hop-dong') {
    return {
      ...state,
      openEditHopDong: true,
    };
  }
  if (action.type === 'close-edit-hop-dong') {
    return {
      ...state,
      openEditHopDong: false,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const ChiTietHopDongProvider = ({ children }: AppProps) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const memoizedValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return <Context.Provider value={memoizedValue}>{children}</Context.Provider>;
};

const useChiTietHopDongContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useChiTietHopDongContext must be used within a ChiTietHopDongProvider');
  }
  return context;
};

export { ChiTietHopDongProvider, useChiTietHopDongContext };
