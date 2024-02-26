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
  tinhTrangThanhToan: '',
  idTinh: null,
  idHuyen: null,
  idXa: null,
  phongDai: null,
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

const HopDongXaHoiHoaFilterProvider = ({ children }: AppProps) => {
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

const useHopDongXaHoiHoaFilterContext = () => {
  const context = React.useContext(Context);
  if (context === undefined) {
    throw new Error(
      'useHopDongXaHoiHoaFilterContext must be used within a HopDongXaHoiHoaFilterProvider'
    );
  }
  return context;
};

export { HopDongXaHoiHoaFilterProvider, useHopDongXaHoiHoaFilterContext };
