import React, { ReactNode, useMemo, useReducer } from 'react';
import { IFilterAdvancedHopDong, IFilterAdvancedHopDongForm } from 'src/@types/hopdong';

type SET_FORM_FILTER = {
  type: 'set-form-filter';
  payload: IFilterAdvancedHopDongForm;
};

type RESET_FORM_FILTER = {
  type: 'reset-form-filter';
};

type Action = SET_FORM_FILTER | RESET_FORM_FILTER;

type Dispatch = (action: Action) => void;

const defaultFilterFields = {
  from: null,
  to: null,
  maTram: null,
  soHopDong: '',
  soHopDongErp: '',
  ngayKyFrom: null,
  ngayKyTo: null,
  ngayKetThucFrom: null,
  ngayKetThucTo: null,
  hinhThucDauTuId: null,
  hinhThucKyHopDongId: null,
  doiTuongKyHopDongId: null,
  tinhTrangThanhToan: null,
  idTinh: null,
  idHuyen: null,
  idXa: null,
  phongDaiId: null,
  tinhTrangHopDong: null,
  kyThanhToanFrom: null,
  kyThanhToanTo: null,
};

type State = {
  filterFormFields: IFilterAdvancedHopDongForm;
  filterHopDongFields: IFilterAdvancedHopDong;
};

const INIT_STATE: State = {
  filterFormFields: defaultFilterFields,
  filterHopDongFields: defaultFilterFields,
};

const Context = React.createContext<{ state: State; dispatch: Dispatch } | undefined>(undefined);

function reducer(state: State, action: Action) {
  if (action.type === 'set-form-filter') {
    return {
      ...state,
      filterFormFields: action.payload,
      filterHopDongFields: {
        ...action.payload,
        maTram: action.payload?.maTram?.ten,
        hinhThucDauTuId: action.payload?.hinhThucDauTuId?.id,
        hinhThucKyHopDongId: action.payload?.hinhThucKyHopDongId?.id,
        doiTuongKyHopDongId: action.payload?.doiTuongKyHopDongId?.id,
        idTinh: action.payload.idTinh?.id,
        idHuyen: action.payload?.idHuyen?.id,
        idXa: action.payload.idXa?.id,
        phongDaiId: action.payload.phongDaiId?.id,
        tinhTrangHopDong: action.payload.tinhTrangHopDong?.id,
        tinhTrangThanhToan: action.payload.tinhTrangThanhToan?.id,
      } as IFilterAdvancedHopDong,
    };
  }
  if (action.type === 'reset-form-filter') {
    return {
      ...state,
      filterFormFields: defaultFilterFields,
      filterHopDongFields: defaultFilterFields,
    };
  }
  return state;
}

interface AppProps {
  children: ReactNode;
}

const HopDongFilterProvider = ({ children }: AppProps) => {
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

const useHopDongFilterContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error('useHopDongFilterContext must be used within a HopDongFilterProvider');
  }
  return context;
};

export { HopDongFilterProvider, useHopDongFilterContext };
