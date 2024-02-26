import React, { ReactNode, useMemo, useReducer } from 'react';
import { IHopDong } from 'src/@types/hopdongmatbang';

export type ITabValue =
  | 'doi_tac'
  | 'hang_muc'
  | 'files_hop_dong'
  | 'files_giay_to_so_huu'
  | 'phu_luc'
  | 'tra_cuu';
export type ITramOpt = { id: number; ma: string; maDTXD: string; maErp: string };

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
type SET_TRAM_OPTIONS = {
  type: 'set-tram-opts';
  payload: ITramOpt[];
};
type SET_DATA_HOP_DONG = {
  type: 'set-data-hop-dong';
  payload: IHopDong;
};

type Action =
  | SET_FORM_TYPE
  | SET_AGREE_LAST_CONFIRM
  | SET_ACTIVE_TAB
  | SET_TRAM_OPTIONS
  | SET_DATA_HOP_DONG;

type Dispatch = (action: Action) => void;

type State = {
  formType: 'create' | 'update' | null;
  agreeLastConfirm: boolean;
  activeTab: ITabValue;
  tramOptions: ITramOpt[];
  hopDong: IHopDong | null;
};

const INIT_STATE: State = {
  formType: null,
  agreeLastConfirm: false,
  activeTab: 'doi_tac',
  tramOptions: [],
  hopDong: null,
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
  if (action.type === 'set-tram-opts') {
    return {
      ...state,
      tramOptions: action.payload,
    };
  }
  if (action.type === 'set-data-hop-dong') {
    return {
      ...state,
      hopDong: action.payload,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const CreateHopDongProvider = ({ children }: AppProps) => {
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

const useCreateHopDongContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useCreateHopDongContext must be used within a CreateHopDongProvider');
  }
  return context;
};

export { CreateHopDongProvider, useCreateHopDongContext };
