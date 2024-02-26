/* eslint-disable func-names */
import { differenceInCalendarMonths } from 'date-fns';
import * as Yup from 'yup';

const DEFAULT_MONEY = 100000000;

export const HopDongSchema = Yup.object().shape({
  soHopDong: Yup.string().required('Số hợp đồng là trường bắt buộc'),
  soHopDongERP: Yup.string(),
  hinhThucKy: Yup.object().shape({
    id: Yup.number()
      .required('Hãy chọn hình thức ký hợp đồng')
      .typeError('Hãy chọn hình thức ký hợp đồng'),
    ten: Yup.string(),
  }),
  hinhThucDauTu: Yup.object().shape({
    id: Yup.number().required('Hãy chọn hình thức đầu tư').typeError('Hãy chọn hình thức đầu tư'),
    ten: Yup.string(),
  }),
  doiTuongKy: Yup.object().shape({
    id: Yup.number()
      .required('Hãy chọn đối tượng ký hợp đồng')
      .typeError('Hãy chọn đối tượng ký hợp đồng'),
    ten: Yup.string(),
  }),
  ngayKy: Yup.date().required('Hãy nhập Ngày ký hợp đồng').typeError('Hãy nhập Ngày ký hợp đồng'),
  ngayKetThuc: Yup.date().typeError('Hãy nhập Ngày kết thúc hợp đồng').required(),
  coKyQuy: Yup.boolean().required().default(false),
  giaKyQuy: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === '') {
        return null; // Chuyển giá trị rỗng thành undefined
      }
      return value;
    })
    .nullable()
    .default(0),
  ghiChu: Yup.string(),
  // Thong tin doi tac
  tenDoiTac: Yup.string().required('Tên đối tác là trường bắt buộc'),
  sdt: Yup.string().required('Số điện thoại là trường bắt buộc'),
  soCMND: Yup.string().required('Số CMND/CCCD là trường bắt buộc'),
  diaChiLienHe: Yup.string(),
  // Thong tin thu huong
  chuTaiKhoan: Yup.string().required('Chủ tài khoản là trường bắt buộc'),
  soTaiKhoan: Yup.string().required('Số tài khoản là trường bắt buộc'),
  nganHangChiNhanh: Yup.string().required('Ngân hàng - Chi nhánh là trường bắt buộc'),
  // Gia thue
  thueVAT: Yup.number()
    .nullable()
    .transform((_, val) => (val === Number(val) ? val : null))
    .typeError('Thuế là trường số'),
  khoanMuc: Yup.object().nullable(),
  hinhThucThanhToan: Yup.object().shape({
    id: Yup.number()
      .required('Hình thức thanh toán là trường bắt buộc')
      .typeError('Hình thức thanh toán là trường bắt buộc'),
    ten: Yup.string(),
  }),
  chuKyNgay: Yup.number()
    .integer()
    .required()
    .default(0)
    .typeError('Chu kỳ năm là trường bắt buộc'),
  chuKyThang: Yup.number()
    .integer()
    .required()
    .default(0)
    .typeError('Chu kỳ tháng là trường bắt buộc'),
  chuKyNam: Yup.number()
    .integer()
    .required()
    .default(0)
    .typeError('Chu kỳ ngày là trường bắt buộc'),
  filesDinhKem: Yup.array().of(Yup.mixed()),
  filesGiayToSuHuu: Yup.array().of(Yup.mixed()),
  filesPhuLuc: Yup.array().of(Yup.mixed()),
  ghiChuPhuLuc: Yup.string(),
  hangMucs: Yup.array().of(
    Yup.object().shape({
      tram: Yup.object().shape({
        id: Yup.number().required().typeError('Mã trạm hoặc mã trạm ĐTXD là trường bắt buộc'),
      }),
      giaThueTram: Yup.number().required().typeError('Giá thuê trạm (+VAT) là trường bắt buộc'),
      dienKhoan: Yup.object().shape({
        added: Yup.boolean().default(false),
        gia: Yup.number().required().typeError('Giá là trường bắt buộc'),
      }),
      // Phu tro
      phuTroList: Yup.array().of(
        Yup.object().shape({
          gia: Yup.number().positive().required().typeError('Giá là trường bắt buộc'),
          hienThiThongTinChiTiet: Yup.boolean().default(true),
          dmPhuTroId: Yup.number().required().typeError('Vui lòng chọn loại phụ trợ'),
        })
      ),
      // Chu ky thanh toan
      hopDongKyThanhToanList: Yup.array().of(
        Yup.object().shape({
          gia: Yup.number().required('Giá là trường bắt buộc'),
          tuNgay: Yup.date().required().typeError('Từ ngày là trường bắt buộc'),
          denNgay: Yup.date().required().typeError('Đến ngày là trường bắt buộc'),
          daThanhToan: Yup.bool(),
        })
      ),
      ngayBatDauTT: Yup.date().required('Ngày bắt đầu yêu cầu thanh toán là trường bắt buộc.'),
      // Dùng chung
      isDungChung: Yup.boolean().default(false),
      loaiHangMucCsht: Yup.object()
        .shape({})
        .nullable()
        .when('isDungChung', {
          is: true,
          then: Yup.object().shape({
            id: Yup.number()
              .required('Loại hạng mục CSHT là trường bắt buộc')
              .typeError('Loại hạng mục CSHT là trường bắt buộc'),
            ten: Yup.string(),
          }),
          otherwise: Yup.object().shape({}).nullable(),
        }),
      maDonViDungChung: Yup.string(),
      donViDungChung: Yup.object().nullable(),
      thoiDiemPhatSinh: Yup.date().nullable().default(null),
      ngayLapDatThietBi: Yup.date().nullable().default(null),
      ngayBatDauDungChung: Yup.date().nullable().default(null),
      ngayKetThucDungChung: Yup.date().nullable().default(null),
      filesDungChung: Yup.array().of(Yup.mixed()),
    })
  ),
  maSoThue: Yup.string().test('isRequired', 'Mã số thuế là trường bắt buộc', function (value) {
    const { path, parent, createError } = this;

    // Kiểm tra xem trường maSoThue có phải là trường bắt buộc không
    if (parent.ngayKy && parent.ngayKetThuc && parent.hangMucs) {
      const totalPriceGiaThue = parent.hangMucs.reduce(
        (accumulator: any, currentValue: any) => accumulator + currentValue.giaThueTram,
        0
      );
      const monthsDiff = differenceInCalendarMonths(parent.ngayKetThuc, parent.ngayKy);
      const calculateWithCondition =
        monthsDiff >= 12 ? totalPriceGiaThue * 12 : totalPriceGiaThue * monthsDiff;

      if (calculateWithCondition >= DEFAULT_MONEY && !value) {
        return createError({ path, message: 'Mã số thuế là trường bắt buộc' });
      }
    }

    return true;
  }),
});
