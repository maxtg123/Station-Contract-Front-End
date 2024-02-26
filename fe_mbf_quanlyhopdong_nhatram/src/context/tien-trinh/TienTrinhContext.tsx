import React, { ReactNode, useMemo, useReducer } from 'react';

type TienTrinh = {
  id: number | null;
  status: 'success' | 'error' | null;
  message?: string;
  tongSo: number;
  hoanThanh: number;
  soLuongLoi: number;
};

type SET_TIEN_TRINH = {
  type: 'set-tien-trinh';
  payload: TienTrinh;
};

type REST_TIEN_TRINH = {
  type: 'reset-tien-trinh';
};

type Action = SET_TIEN_TRINH | REST_TIEN_TRINH;

type Dispatch = (action: Action) => void;

type State = {
  tienTrinh: TienTrinh;
};

const INIT_STATE: State = {
  tienTrinh: {
    id: null,
    status: null,
    message: '',
    tongSo: 0,
    hoanThanh: 0,
    soLuongLoi: 0,
  },
};

const TienTrinhContext = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(
  undefined
);

function reducer(state: State, action: Action) {
  if (action.type === 'set-tien-trinh') {
    return {
      ...state,
      tienTrinh: {
        ...action.payload,
      },
    };
  }
  if (action.type === 'reset-tien-trinh') {
    return {
      ...state,
      ...INIT_STATE,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const TienTrinhProvider = ({ children }: AppProps) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const memoizedValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <TienTrinhContext.Provider value={memoizedValue}>{children}</TienTrinhContext.Provider>;
};

const useTienTrinhContext = () => {
  const context = React.useContext(TienTrinhContext);
  if (context === undefined) {
    throw new Error('useTienTrinhContext must be used within a TienTrinhProvider');
  }
  return context;
};

export { TienTrinhProvider, useTienTrinhContext };
