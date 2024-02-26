import React, { ReactNode, useMemo, useReducer } from 'react';

export type ITabValue =
  | 'active'
  | 'chua_gui_phe_duyet'
  | 'da_gui_phe_duyet'
  | 'can_phe_duyet'
  | 'da_phe_duyet';

type SET_ACTIVE_TAB = {
  type: 'set-active-tab';
  payload: ITabValue;
};

type Action = SET_ACTIVE_TAB;

type Dispatch = (action: Action) => void;

type State = {
  activeTab: ITabValue;
};

const INIT_STATE: State = {
  activeTab: 'active',
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
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

const ListHopDongProvider = ({ children }: AppProps) => {
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

const useListHopDongContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useListHopDongContext must be used within a ListHopDongProvider');
  }
  return context;
};

export { ListHopDongProvider, useListHopDongContext };
