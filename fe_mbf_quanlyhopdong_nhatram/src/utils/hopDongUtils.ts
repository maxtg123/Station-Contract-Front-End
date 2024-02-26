/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
import {
  add,
  addDays,
  differenceInDays,
  eachMonthOfInterval,
  getDaysInMonth,
  getMonth,
  getYear,
  isSameMonth,
  lastDayOfMonth,
  startOfDay,
  startOfMonth,
  subDays,
} from 'date-fns';
import { IHead } from 'src/@types/common';
import {
  IChuKy,
  IDataDanhMuc,
  IHopDongImportInput,
  IImportHopDong,
  ILoaiHopDong,
  ITinhTrangHopDong,
} from 'src/@types/hopdong';
import { IHopDong, IHopDongForm } from 'src/@types/hopdongmatbang';
import { CONFIG_DATE_THANH_TOAN } from 'src/@types/thanhtoan';
import { LabelColor } from 'src/components/label';
import { COLUMN_MAPPING_HOP_DONG_IBC } from 'src/constants/hopdongibc.constant';
import { COLUMN_MAPPING } from 'src/constants/hopdongmatbang.constant';
import { COLUMN_MAPPING_HOP_DONG_XA_HOI_HOA } from 'src/constants/hopdongxahoihoa.constant';
import { storagePath, urlsToFiles } from './fileUtils';
import { convertDateStringtoDate, fTimestamp, parseDateString, parseDuration } from './formatTime';

export const generateChuKy = ({
  ngayBatDauYeuCauThanhToan,
  ngayKetThucHopDong,
  chuKyNam,
  chuKyThang,
  chuKyNgay,
  giaThueHangThang = 0,
}: {
  ngayBatDauYeuCauThanhToan: Date;
  ngayKetThucHopDong: Date;
  chuKyNam: number;
  chuKyThang: number;
  chuKyNgay: number;
  giaThueHangThang: number;
}): IChuKy[] => {
  const _ngayBatDauYeuCauThanhToan = startOfDay(ngayBatDauYeuCauThanhToan);
  const _ngayKetThucHopDong = startOfDay(ngayKetThucHopDong);
  if (_ngayBatDauYeuCauThanhToan.getTime() >= _ngayKetThucHopDong.getTime()) {
    return [];
  }
  if (chuKyNam < 0 || chuKyThang < 0 || chuKyNgay < 0) {
    return [];
  }
  if (chuKyNam === 0 && chuKyThang === 0 && chuKyNgay === 0) {
    return [];
  }

  let tempDate: Date = _ngayBatDauYeuCauThanhToan;
  const result: IChuKy[] = [];
  let check = true;
  while (check) {
    let newTempDate = tempDate;
    newTempDate = add(newTempDate, {
      years: chuKyNam > 0 ? chuKyNam : 0,
      months: chuKyThang > 0 ? chuKyThang : 0,
      days: chuKyNgay > 0 ? chuKyNgay : 0,
    });

    newTempDate = subDays(newTempDate, 1); // cuoi thang

    if (newTempDate.getTime() >= _ngayKetThucHopDong.getTime()) {
      newTempDate = _ngayKetThucHopDong; // ky cuoi khong can tru
      check = false;
    }

    const from: Date = tempDate;
    const to: Date = newTempDate;
    result.push({
      from,
      to,
      gia: calculatorMoneyBetweenFromTo({ from, to, giaHangThang: giaThueHangThang }),
    });
    tempDate = addDays(newTempDate, 1);
  }
  return result;
};

export const calculatorMoneyBetweenFromTo = ({
  from,
  to,
  giaHangThang = 0,
}: {
  from: Date;
  to: Date;
  giaHangThang: number;
}): number => {
  let total = 0;
  if (isSameMonth(from, to)) {
    const daysInMonth = getDaysInMonth(from);
    const diffDays = differenceInDays(to, from) + 1;
    // console.log('daysInMonth: ', daysInMonth);
    // console.log('differenceInDays: ', diffDays);
    total = Math.round((giaHangThang / daysInMonth) * diffDays);
  } else {
    eachMonthOfInterval({
      start: from,
      end: to,
    }).forEach((date) => {
      if (isSameMonth(date, from)) {
        const daysInMonth = getDaysInMonth(from);
        const _price = Math.round(
          (giaHangThang / daysInMonth) * (differenceInDays(lastDayOfMonth(from), from) + 1)
        );
        total += _price;
      } else if (isSameMonth(date, to)) {
        const daysInMonth = getDaysInMonth(to);
        const _price = Math.round(
          (giaHangThang / daysInMonth) * (differenceInDays(to, startOfMonth(to)) + 1)
        );
        total += _price;
      } else {
        total += Number(giaHangThang);
      }
    });
  }

  return total;
};

export const transformRowToForm = async (dataRow: IHopDong): Promise<IHopDongForm> => {
  const parsedFiles = await urlsToFiles(dataRow.hopDongFileModels.map((f) => storagePath(f.path)));
  const files = dataRow.hopDongFileModels.map((hdFile, i) => ({
    ...hdFile,
    createdAt: new Date(hdFile.createdAt),
    status: 'old' as const,
    file: parsedFiles[i],
  }));
  const result: IHopDongForm = {
    id: dataRow.id,
    soHopDong: dataRow.soHopDong || '',
    soHopDongERP: dataRow.soHopDongErp || '',
    hinhThucKy: dataRow.dmHinhThucKyHopDong
      ? { id: dataRow.dmHinhThucKyHopDong.id, ten: dataRow.dmHinhThucKyHopDong.ten }
      : null,
    hinhThucDauTu: dataRow.dmHinhThucDauTu
      ? { id: dataRow.dmHinhThucDauTu.id, ten: dataRow.dmHinhThucDauTu.ten }
      : null,
    doiTuongKy: dataRow.dmDoiTuongKyHopDong
      ? { id: dataRow.dmDoiTuongKyHopDong.id, ten: dataRow.dmDoiTuongKyHopDong.ten }
      : null,
    khoanMuc: dataRow.dmKhoanMuc
      ? { id: dataRow.dmKhoanMuc.id, ten: dataRow.dmKhoanMuc.ten }
      : null,
    ngayKy: new Date(dataRow.ngayKy),
    ngayKetThuc: new Date(dataRow.ngayKetThuc),
    coKyQuy: Boolean(dataRow.coKyQuy),
    giaKyQuy: dataRow.giaKyQuy || null,
    ghiChu: dataRow.ghiChu || '',
    tenDoiTac: dataRow.hopDongDoiTac.ten || '',
    sdt: dataRow.hopDongDoiTac.soDienThoai || '',
    soCMND: dataRow.hopDongDoiTac.cccd || '',
    maSoThue: dataRow.hopDongDoiTac.maSoThue || '',
    diaChiLienHe: dataRow.hopDongDoiTac.diaChi || '',
    chuTaiKhoan: dataRow.hopDongDoiTac.chuTaiKhoan || '',
    soTaiKhoan: dataRow.hopDongDoiTac.soTaiKhoan || '',
    nganHangChiNhanh: dataRow.hopDongDoiTac.nganHangChiNhanh || '',
    thueVAT: dataRow.thueVat,
    hinhThucThanhToan: dataRow.dmHinhThucThanhToan
      ? { id: dataRow.dmHinhThucThanhToan.id, ten: dataRow.dmHinhThucThanhToan.ten }
      : null,
    chuKyNam: dataRow.chuKyNam,
    chuKyThang: dataRow.chuKyThang,
    chuKyNgay: dataRow.chuKyNgay,
    remoteFiles: dataRow.hopDongFileModels,
    filesDinhKem: [],
    filesGiayToSuHuu: [],
    filesPhuLuc: [],
    hopDongPhuLucModels: dataRow.hopDongPhuLucModels,
    ghiChuPhuLuc: '',
    hangMucs: dataRow.hopDongTramList.map((hdTram) => ({
      status: 'old',
      tram: {
        id: Number(hdTram.tram.id),
        ma: hdTram.tram.maTram || '',
        maDTXD: hdTram.tram.maDauTuXayDung || '',
        maErp: hdTram.tram.maTramErp || '',
      },
      giaThueTram: hdTram.giaThue,
      dienKhoan: {
        added: !!hdTram.giaDienKhoan,
        gia: hdTram.giaDienKhoan || 0,
      },
      phuTroList: hdTram.hopDongTramPhuTroList.map((pt) => ({
        dmPhuTroId: pt.dmLoaiHopDongPhuTro.id,
        gia: pt.gia,
        hienThiThongTinChiTiet: pt.hienThiThongTinChiTiet,
      })),
      hopDongKyThanhToanList: hdTram.hopDongTramKyThanhToanList.map((ky) => ({
        tuNgay: new Date(ky.tuNgay),
        denNgay: new Date(ky.denNgay),
        gia: ky.giaTien,
        daThanhToanNgay: ky.daThanhToanNgay ? new Date(ky.daThanhToanNgay) : null,
        daThanhToan: !!ky.daThanhToanNgay,
      })),
      ngayBatDauTT: hdTram.ngayBatDauYeuCauThanhToan
        ? new Date(hdTram.ngayBatDauYeuCauThanhToan)
        : new Date(),
      // Dùng chung
      isDungChung: !!hdTram.hopDongTramDungChung,
      loaiHangMucCsht: hdTram?.hopDongTramDungChung?.dmLoaiHangMucCSHT
        ? {
            id: hdTram.hopDongTramDungChung.dmLoaiHangMucCSHT.id,
            ten: hdTram.hopDongTramDungChung.dmLoaiHangMucCSHT.ten,
          }
        : null,
      maDonViDungChung: hdTram?.hopDongTramDungChung?.maTramDonViDungChung || '',
      donViDungChung: hdTram?.hopDongTramDungChung?.dmDonViDungChung
        ? {
            id: hdTram.hopDongTramDungChung.dmDonViDungChung.id,
            ten: hdTram.hopDongTramDungChung.dmDonViDungChung.ten,
          }
        : null,
      thoiDiemPhatSinh: hdTram?.hopDongTramDungChung?.thoiDiemPhatSinh
        ? new Date(hdTram.hopDongTramDungChung.thoiDiemPhatSinh)
        : null,
      ngayLapDatThietBi: hdTram?.hopDongTramDungChung?.ngayLapDatThietBi
        ? new Date(hdTram.hopDongTramDungChung.ngayLapDatThietBi)
        : null,
      ngayBatDauDungChung: hdTram?.hopDongTramDungChung?.ngayBatDauDungChung
        ? new Date(hdTram.hopDongTramDungChung.ngayBatDauDungChung)
        : null,
      ngayKetThucDungChung: hdTram?.hopDongTramDungChung?.ngayKetThucDungChung
        ? new Date(hdTram.hopDongTramDungChung.ngayKetThucDungChung)
        : null,
      filesDungChung: files.filter(
        (file) => file.loai === 'FILE_DUNG_CHUNG' && file.hopDongTramId === hdTram.id
      ),
    })),
  };

  if (dataRow.id) {
    result.filesDinhKem = files.filter((f) => f.loai === 'FILE_HOP_DONG');
    result.filesGiayToSuHuu = files.filter((f) => f.loai === 'FILE_GIAY_TO_SO_HUU');
    result.filesPhuLuc = files.filter((f) => f.loai === 'FILE_PHU_LUC');
  }
  return result;
};

export const getTinhTrangThanhToanOfHD = ({
  tuNgay,
  denNgay,
}: {
  tuNgay: Date | number;
  denNgay: Date | number;
}): '' | 'CAN_THANH_TOAN' | 'QUA_HAN' => {
  const result = '';
  const ngayHienTai = new Date();

  if (fTimestamp(denNgay) < fTimestamp(ngayHienTai)) {
    return 'QUA_HAN';
  }

  const dateQuery = addDays(new Date(), CONFIG_DATE_THANH_TOAN);
  const monthQuery = getMonth(dateQuery) + 1 + 1;
  const yearQuery = getYear(dateQuery);
  const monthKyTiepTheoTuNgay = getMonth(tuNgay) + 1;
  const yearKyTiepTheoTuNgay = getYear(tuNgay);
  if (monthKyTiepTheoTuNgay <= monthQuery && yearKyTiepTheoTuNgay <= yearQuery) {
    return 'CAN_THANH_TOAN';
  }
  return result;
};
export const transformDataReadFileExcel = (data: any[]): any[] => {
  const headerRow = data[0]; // Chỉnh sửa: Loại bỏ khoảng trắng thừa
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowData: any = {};

    for (let j = 0; j < headerRow.length; j++) {
      const columnName = COLUMN_MAPPING[headerRow[j]]; // Chỉnh sửa: Lấy tên cột từ COLUMN_MAPPING
      if (columnName === 'giaThue' && row[j] === '') {
        rowData[columnName] = 0;
      } else {
        rowData[columnName] = row[j];
      }
    }

    result.push(rowData);
  }
  return result;
};

export const transformDataReadFileExcelHopDongXaHoiHoa = (data: any[]): any[] => {
  const headerRow = data[0]; // Chỉnh sửa: Loại bỏ khoảng trắng thừa
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowData: any = {};

    for (let j = 0; j < headerRow.length; j++) {
      const columnName = COLUMN_MAPPING_HOP_DONG_XA_HOI_HOA[headerRow[j]]; // Chỉnh sửa: Lấy tên cột từ COLUMN_MAPPING
      if (columnName === 'giaThue' && row[j] === '') {
        rowData[columnName] = 0;
      } else {
        rowData[columnName] = row[j];
      }
    }

    result.push(rowData);
  }
  return result;
};
export const transformDataReadFileExcelHopDongIbc = (data: any[]): any[] => {
  const headerRow = data[0]; // Chỉnh sửa: Loại bỏ khoảng trắng thừa
  const result = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const rowData: any = {};

    for (let j = 0; j < headerRow.length; j++) {
      const columnName = COLUMN_MAPPING_HOP_DONG_IBC[headerRow[j]]; // Chỉnh sửa: Lấy tên cột từ COLUMN_MAPPING
      if (columnName === 'giaThue' && row[j] === '') {
        rowData[columnName] = 0;
      } else {
        rowData[columnName] = row[j];
      }
    }
    result.push(rowData);
  }
  return result;
};

export const getTransFormDataImportHopDong = (
  value: IImportHopDong,
  dataDanhMuc: IDataDanhMuc,
  loaiHopDong: ILoaiHopDong
): IHopDongImportInput => {
  // tìm danh mục
  //-----------------------------------------------------------------------------
  const findTram = dataDanhMuc.dataTram.find((item) => item.maTram === value.maTram);
  const findHinhThucKyId = dataDanhMuc.dataHinhThucKyHopDong.find(
    (item) => item.ten === value.hinhThucKyHopDong
  );
  const findHinhThucDauTuId = dataDanhMuc.dataHinhThucDauTu.find(
    (item) => item.ten === value.hinhThucDauTu
  );
  const findDoiTuongKyHopDongId = dataDanhMuc.dataDoiTuongKyHopDong.find(
    (item) => item.ten === value.doiTuongKyHopDong
  );
  const findThueVat = dataDanhMuc.dataThueVAt.find((item) => item.soThue === Number(value.thueVAT));
  const findHinhThucThanhToanId = dataDanhMuc.dataHinhThucThanhToan.find(
    (item) => item.ten === value.hinhThucThanhToan
  );
  const findPhongDaiId = dataDanhMuc.dataPhongDai.find((item) => item.ten === value.phongDai);
  const findToId = dataDanhMuc.dataTo.find((item) => item.ten === value.to);
  const findTinhId = dataDanhMuc.dataTinh.find((item) => item.ten === value.tinh);
  const findHuyenId = dataDanhMuc.dataHuyen.find((item) => item.ten === value.huyen);
  const findXaId = dataDanhMuc.dataXa.find((item) => item.ten === value.xa);
  const findKhuVucId = dataDanhMuc.dataKhuVuc.find((item) => item.ten === value.khuVuc);
  const findLoaiCshtId = dataDanhMuc.dataLoaiCsht.find((item) => item.ten === value.loaiCSHT);
  const findLoaiTramId = dataDanhMuc.dataLoaiTram.find((item) => item.ten === value.loaiTram);
  const findLoaiCotAntenId = dataDanhMuc.dataLoaiCotAnten.find(
    (item) => item.ten === value.loaiCotAnten
  );
  const findLoaiPhongMayId = dataDanhMuc.dataLoaiPhongMay.find(
    (item) => item.ten === value.loaiPhongMay
  );
  const findLoaiPhongMayPhatDienId = dataDanhMuc.dataLoaiPhongMayPhatDien.find(
    (item) => item.ten === value.loaiPhongMayPhatDien
  );
  const findLoaiTramVhktId = dataDanhMuc.dataLoaiTramVhkt.find(
    (item) => item.ten === value.loaiTramVhkt
  );
  const findLoaiHangMucCshtId = dataDanhMuc.dataLoaiHangMucCsht.find(
    (item) => item.ten === value.loaiHangMucCsht
  );
  const findKhoanMucId = dataDanhMuc.dataKhoanMuc.find((item) => item.ma === value.khoanMuc);
  const findDonViDungChungId = dataDanhMuc.dataDonViDungChung.find(
    (item) => item.ten === value.donViDungChung
  );
  const splitValueLoaiThietBiRan = value.loaiThietBiRan.split('-');
  const filterLoaiThietBiRan = dataDanhMuc.dataLoaiThietBiRan.filter((item) =>
    splitValueLoaiThietBiRan.includes(item.ten)
  );
  //-------------------------------------------------------------------------------

  const dataChuKyThanhToan = parseDuration(value.chuKyThanhToan);

  // Phụ trợ
  //-------------------------------------------------------------------------------
  const listHDPhuTro: { gia: number; hienThiThongTinChiTiet: boolean; dmPhuTroId: number }[] = [];
  dataDanhMuc.dataHDPhuTro.forEach((item) => {
    if (value.thuePhongMay === 'Có' && item.ten === 'Thuê phòng máy') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'Thuê phòng máy đặt máy nổ cố định') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (
      value.thuePhongMay === 'Có' &&
      item.ten === 'Thuê bảo vệ, hỗ trợ vận hành khai thác máy nổ và PCCC cho trạm'
    ) {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'Thuê MPĐ dự phòng') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'Thuê cột anten') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'Vị trí anten') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'Tiếp đất, chống sét') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
    if (value.thuePhongMay === 'Có' && item.ten === 'HT điện indoor (tủ nguồn, CB,...)') {
      listHDPhuTro.push({ dmPhuTroId: item.id, gia: item.gia, hienThiThongTinChiTiet: true });
    }
  });
  //---------------------------------------------------------------------------------

  const parseGiaThue =
    value.giaThue === 0 ? 0 : parseInt(value.giaThue.toString().replace(/,/g, ''), 10);

  // Hợp đồng kỳ thanh toán
  //------------------------------------------------------
  const ngayBatDauYeuCauThanhToan = parseDateString(
    value.ngayBatDauYeuCauThanhToan.replace(/[\r\n]/g, '')
  );
  const ngayKetThucHopDong = parseDateString(value.ngayKetThucHopDong.replace(/[\r\n]/g, ''));
  const daThanhToanDenNgay = parseDateString(value.daThanhToanDenNgay.replace(/[\r\n]/g, ''));

  let hopDongKyThanhToanListData: {
    tuNgay: Date;
    denNgay: Date;
    giaTien: number;
    daThanhToanNgay?: Date;
  }[] = [];
  if (value.daThanhToanDenNgay) {
    // Kỳ đã thanh toán
    const newDataGenChuKyDaThanhToan = {
      ngayBatDauYeuCauThanhToan,
      ngayKetThucHopDong: daThanhToanDenNgay,
      chuKyNam: dataChuKyThanhToan.years,
      chuKyThang: dataChuKyThanhToan.months,
      chuKyNgay: dataChuKyThanhToan.days,
      giaThueHangThang: parseGiaThue,
    };

    try {
      const dataHopDongKyDaThanhToan = generateChuKy(newDataGenChuKyDaThanhToan);
      const hopDongKyDaThanhToanList = dataHopDongKyDaThanhToan.map((ck) => ({
        tuNgay: ck.from,
        denNgay: ck.to,
        giaTien: ck.gia,
        daThanhToanNgay: ck.to,
      }));

      // Kỳ chưa thanh toán
      const addOneDateDaThanhToanDenNgay = addDays(daThanhToanDenNgay, 1);

      const newDataGenChuKyChuaThanhToan = {
        ngayBatDauYeuCauThanhToan: addOneDateDaThanhToanDenNgay,
        ngayKetThucHopDong,
        chuKyNam: dataChuKyThanhToan.years,
        chuKyThang: dataChuKyThanhToan.months,
        chuKyNgay: dataChuKyThanhToan.days,
        giaThueHangThang: parseGiaThue,
      };
      const dataHopDongKyChuaThanhToan = generateChuKy(newDataGenChuKyChuaThanhToan);
      const hopDongKyChuaThanhToanList = dataHopDongKyChuaThanhToan.map((ck) => ({
        tuNgay: ck.from,
        denNgay: ck.to,
        giaTien: ck.gia,
      }));
      const mergeDataHopDongKyThanhToan =
        hopDongKyChuaThanhToanList.concat(hopDongKyDaThanhToanList);
      hopDongKyThanhToanListData = mergeDataHopDongKyThanhToan;
    } catch (error) {
      console.log(error);
    }
  } else {
    const newDataGenChuKy = {
      ngayBatDauYeuCauThanhToan,
      ngayKetThucHopDong,
      chuKyNam: dataChuKyThanhToan.years,
      chuKyThang: dataChuKyThanhToan.months,
      chuKyNgay: dataChuKyThanhToan.days,
      giaThueHangThang: parseGiaThue,
    };
    const dataHopDongKyThanhToan = generateChuKy(newDataGenChuKy);
    const hopDongKyThanhToanList = dataHopDongKyThanhToan.map((ck) => ({
      tuNgay: ck.from,
      denNgay: ck.to,
      giaTien: ck.gia,
    }));
    hopDongKyThanhToanListData = hopDongKyThanhToanList;
  }
  const daPhatSong = value.tinhTrangPhatSong === 'Đã phát sóng';

  //--------------------------------------------------------
  const result: IHopDongImportInput = {
    tramId: findTram?.id || null,
    soHopDong: value.soHopDong,
    soHopDongErp: value.soHopDongErp,
    hinhThucKyId: findHinhThucKyId?.id || null,
    hinhThucDauTuId: findHinhThucDauTuId?.id || null,
    doiTuongKyId: findDoiTuongKyHopDongId?.id || null,
    khoanMucId: findKhoanMucId?.id || null,
    coKyQuy: value.kyQuy === 'Có',
    giaKyQuy: value.giaKyQuy,
    ngayKy: convertDateStringtoDate(value.ngayKyHopDong),
    ngayKetThuc: convertDateStringtoDate(value.ngayKetThucHopDong),
    ghiChu: value.ghiChu,
    giaThue: parseGiaThue,
    thueVat: findThueVat?.soThue || null,
    hinhThucThanhToanId: findHinhThucThanhToanId?.id || null,
    chuKyNam: dataChuKyThanhToan.years,
    chuKyThang: dataChuKyThanhToan.months,
    chuKyNgay: dataChuKyThanhToan.days,
    ngayBatDauYeuCauThanhToan: convertDateStringtoDate(value.ngayBatDauYeuCauThanhToan),
    giaDienKhoan: value.giaDienKhoan,
    loaiPhongMayId: findLoaiPhongMayId?.id || null,
    loaiPhongMayPhatDienId: findLoaiPhongMayPhatDienId?.id || null,
    loaiTramVhktId: findLoaiTramVhktId?.id || null,
    loaiHopDong,
    tram: {
      id: findTram?.id || null,
      phongDaiId: Number(findPhongDaiId?.id) || null,
      toId: findToId?.id || null,
      maTram: value.maTram,
      maTramErp: value.maTramErp,
      ten: value.tenTram,
      tinhId: findTinhId?.id || null,
      huyenId: findHuyenId?.id || null,
      xaId: findXaId?.id || null,
      diaChi: value.diaChiDatTram,
      kinhDo: value?.kinhDo?.toString() || null,
      viDo: value?.viDo?.toString() || null,
      khuVucId: findKhuVucId?.id || null,
      ngayPhatSong: convertDateStringtoDate(value.ngayPhatSong),
      loaiCshtId: findLoaiCshtId?.id || null,
      loaiTramId: findLoaiTramId?.id || null,
      loaiCotAngtenId: findLoaiCotAntenId?.id || null,
      doCaoAngten: value.doCaoCotAnten,
      dmLoaiThietBiRanList: filterLoaiThietBiRan || null,
      maDauTuXayDung: value.maDTXD,
      trangThaiHoatDong: 'HOAT_DONG',
      daPhatSong,
    },
    hopDongDoiTac: {
      ten: value.hoTenChuNha,
      soDienThoai: value.soDienThoai,
      cccd: value.cccd,
      maSoThue: value.maSoThue,
      diaChi: value.diaChiLienHe,
      chuTaiKhoan: value.chuTaiKhoan,
      soTaiKhoan: value.soTaiKhoan,
      nganHangChiNhanh: value.nganHangChiNhanh,
    },
    hopDongDungChung: null,
    hopDongPhuTroList: listHDPhuTro || null,
    hopDongKyThanhToanList: hopDongKyThanhToanListData,
    hopDongPhuLucList: null,
  };
  if (
    findLoaiHangMucCshtId?.id ||
    value.maTramDonViDungChung ||
    value.donViDungChung ||
    value.thoiDiemPhatSinh ||
    convertDateStringtoDate(value.ngayLapDatThietBi) ||
    convertDateStringtoDate(value.ngayBatDauDungChung) ||
    convertDateStringtoDate(value.ngayKetThucDungChung)
  ) {
    result.hopDongDungChung = {
      loaiHangMucCSHTId: findLoaiHangMucCshtId?.id || null,
      maTramDonViDungChung: value.maTramDonViDungChung,
      donViDungChungId: findDonViDungChungId?.id || null,
      thoiDiemPhatSinh: convertDateStringtoDate(value.thoiDiemPhatSinh),
      ngayLapDatThietBi: convertDateStringtoDate(value.ngayLapDatThietBi),
      ngayBatDauDungChung: convertDateStringtoDate(value.ngayBatDauDungChung),
      ngayKetThucDungChung: convertDateStringtoDate(value.ngayKetThucDungChung),
    };
  }
  return result;
};

export const checkPaymentCycle = (input: string) => {
  const regex = /^(?:(\d+)\s+năm)?\s*(?:(\d+)\s+tháng)?\s*(?:(\d+)\s+ngày)?$/;
  const match = input.match(regex);

  if (!match) {
    return false;
  }

  const [, years, months, days] = match;
  const hasYears = years && parseInt(years, 10) > 0;
  const hasMonths = months && parseInt(months, 10) > 0;
  const hasDays = days && parseInt(days, 10) > 0;

  return hasYears || hasMonths || hasDays || (months && !hasDays);
};

export const getTransFormDataExportHopDong = (checked: IHead[]) => {
  const result: Record<string, boolean> = {};
  checked.forEach((item) => {
    result[item.id] = item.checked ?? false;
  });
  let convertStringKey = '';
  const keys = Object.keys(result);
  convertStringKey = keys.join(';');
  return convertStringKey;
};

export const removeDuplicatesHopDong = (arr: IHopDong[]): IHopDong[] => {
  const result: IHopDong[] = [];
  const ids: Set<number> = new Set();

  // eslint-disable-next-line no-restricted-syntax
  for (const element of arr) {
    if (!ids.has(element.id)) {
      result.push(element);
      ids.add(element.id);
    }
  }

  return result;
};
export const transformTinhTrangHopDong = ({ value }: { value: ITinhTrangHopDong }) => {
  let txt: string = value;
  let color: LabelColor = 'success';

  switch (value) {
    case 'TAI_KY':
      txt = 'Tái ký';
      color = 'primary';
      break;
    case 'KY_MOI':
      txt = 'Ký mới';
      break;
    case 'DI_DOI':
      txt = 'Di dời';
      color = 'info';
      break;
    case 'THANH_LY':
      txt = 'Thanh lý';
      color = 'warning';
      break;
    default:
      break;
  }

  return { txt, color };
};
