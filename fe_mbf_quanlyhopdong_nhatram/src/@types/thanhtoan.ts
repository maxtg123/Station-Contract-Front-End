// export type IHopDongThanhToan = Pick<
//   IHopDong,
//   | 'id'
//   | 'chuKyNam'
//   | 'chuKyNgay'
//   | 'chuKyThang'
//   | 'soHopDong'
//   | 'soHopDongErp'
//   | 'tram'
//   | 'giaThue'
//   | 'hopDongKyThanhToanList'
//   | 'createdAt'
// > & { ngayThanhToan?: string };

export type ITransFormDataThanhToan = {
  hopHongTramId: number;
  ngayThanhToan: Date;
};

export type IThongKeHopDongThanhToan = {
  ALL: number;
  QUA_HAN: number;
  CHUAN_BI: number;
  CAN: number;
};

export const CONFIG_DATE_THANH_TOAN = 15;

type LabelColor = 'error' | 'info' | 'warning';

export const statusMappingsHopDong = {
  QUA_HAN: {
    label: 'Quá hạn thanh toán',
    color: 'error' as LabelColor,
    icon: 'eva:close-circle-outline',
  },
  SAP_DEN_HAN: {
    label: 'Sắp đến kỳ thanh toán',
    color: 'info' as LabelColor,
    icon: 'ic:round-receipt',
  },
  CAN_THANH_TOAN: {
    label: 'Cần thanh toán',
    color: 'warning' as LabelColor,
    icon: 'eva:alert-triangle-outline',
  },
  DA_THANH_TOAN: {
    label: 'Đã thanh toán',
    color: 'success' as LabelColor,
    icon: 'eva:done-all-outline',
  },
};

export type IExcelThanhToanChiHo = {
  listHopDongTramId: number[];
  ngayLap: Date;
};
export type IExcelBangKeKhaiThanhToan = {
  listHopDongTramId: number[];
  kyThanhToan: Date | null;
};

export type IListTramByHopDong = { hopDongId: string; listTramId: string[] };
