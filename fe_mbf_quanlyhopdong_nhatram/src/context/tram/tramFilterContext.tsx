import React, { ReactNode, useMemo, useReducer } from 'react';
import { IFilterAdvancedTram, IFilterAdvancedTramForm } from 'src/@types/tram';

export type ITabTramTable = 'all' | 'da_phat_song' | 'chua_phat_song';

type SET_FORM_FILTER = {
  type: 'set-form-filter';
  payload: IFilterAdvancedTramForm;
};

type RESET_FORM_FILTER = {
  type: 'reset-form-filter';
};
type SET_ACTIVE_TAB_TABLE = {
  type: 'set-active-tab-table';
  payload: ITabTramTable;
};

type Action = SET_FORM_FILTER | RESET_FORM_FILTER | SET_ACTIVE_TAB_TABLE;

type Dispatch = (action: Action) => void;

const defaultFilterFields = {
  tinh: null,
  huyen: null,
  xa: null,
  phongDai: null,
  to: null,
  trangThaiHoatDong: '',
  fromDate: null,
  toDate: null,
  loaiCsht: null,
};

type State = {
  filterFormFields: IFilterAdvancedTramForm;
  filterTramFields: IFilterAdvancedTram;
  activeTab: ITabTramTable;
};

const INIT_STATE: State = {
  filterFormFields: defaultFilterFields,
  filterTramFields: defaultFilterFields,
  activeTab: 'all',
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  if (action.type === 'set-form-filter') {
    return {
      ...state,
      filterFormFields: action.payload,
      filterTramFields: {
        ...action.payload,
        tinh: action.payload?.tinh?.id,
        huyen: action.payload?.huyen?.id,
        xa: action.payload?.xa?.id,
        phongDai: action.payload?.phongDai?.id,
        to: action.payload?.to?.id,
        loaiCsht: action.payload?.loaiCsht?.id,
      } as IFilterAdvancedTram,
    };
  }
  if (action.type === 'reset-form-filter') {
    return {
      ...state,
      filterFormFields: defaultFilterFields,
      filterTramFields: defaultFilterFields,
    };
  }
  if (action.type === 'set-active-tab-table') {
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

const TramFilterProvider = ({ children }: AppProps) => {
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

const useTramFilterContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useTramFilterContext must be used within a TramFilterProvider');
  }
  return context;
};

export { TramFilterProvider, useTramFilterContext };
