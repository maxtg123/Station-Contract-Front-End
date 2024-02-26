import React, { ReactNode, useMemo, useReducer } from 'react';

type SET_AGREE_LAST_CONFIRM = {
  type: 'set-agree-last-confirm';
  payload: boolean;
};

type Action = SET_AGREE_LAST_CONFIRM;

type Dispatch = (action: Action) => void;

type State = {
  agreeLastConfirm: boolean;
};

const INIT_STATE: State = {
  agreeLastConfirm: false,
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  if (action.type === 'set-agree-last-confirm') {
    return {
      ...state,
      agreeLastConfirm: action.payload,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const CreateTramProvider = ({ children }: AppProps) => {
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

const useCreateTramContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useCreateTramContext must be used within a CreateTramProvider');
  }
  return context;
};

export { CreateTramProvider, useCreateTramContext };
