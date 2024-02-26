import React, { ReactNode, useMemo, useReducer } from 'react';

export type ITabValue =
  | 'doi_tac'
  | 'gia_thue'
  | 'chu_ky_thanh_toan'
  | 'files_hop_dong'
  | 'files_giay_to_so_huu'
  | 'dung_chung'
  | 'phu_luc';

type SET_FORM_TYPE = {
  type: 'set-form-type';
  payload: 'create' | 'update';
};
type SET_AGREE_LAST_CONFIRM = {
  type: 'set-agree-last-confirm';
  payload: boolean;
};
type SET_ACTIVE_TAB = {
  type: 'set-active-tab';
  payload: ITabValue;
};

type Action = SET_FORM_TYPE | SET_AGREE_LAST_CONFIRM | SET_ACTIVE_TAB;

type Dispatch = (action: Action) => void;

type State = {
  formType: 'create' | 'update' | null;
  agreeLastConfirm: boolean;
  activeTab: ITabValue;
};

const INIT_STATE: State = {
  formType: null,
  agreeLastConfirm: false,
  activeTab: 'doi_tac',
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  if (action.type === 'set-form-type') {
    return {
      ...state,
      formType: action.payload,
    };
  }
  if (action.type === 'set-agree-last-confirm') {
    return {
      ...state,
      agreeLastConfirm: action.payload,
    };
  }
  if (action.type === 'set-active-tab') {
    return {
      ...state,
      activeTab: action.payload,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const CreateHopDongIbcProvider = ({ children }: AppProps) => {
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

const useCreateHopDongIbcContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useCreateHopDongIbcContext must be used within a CreateHopDongIbcProvider');
  }
  return context;
};

export { CreateHopDongIbcProvider, useCreateHopDongIbcContext };
