// routes
import {
  PATH_CATEGORY,
  PATH_CONFIGURATION,
  PATH_DASHBOARD,
  PATH_HOP_DONG_IBC,
  PATH_HOP_DONG_MAT_BANG,
  PATH_HOP_DONG_XA_HOI_HOA,
  PATH_SETTINGS,
  PATH_SETTING_PD,
} from 'src/routes/paths';
// components
import Iconify from 'src/components/iconify';
import { NavListProps } from 'src/components/nav-section';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  hopdong: icon('ic_folder'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
  history: icon('ic_menu_item'),
  banking: icon('ic_banking'),
  payment: icon('ic_invoice'),
  partner: icon('ic_booking'),
  station: <Iconify icon="eva:radio-fill" />,
  notification: icon('ic_chat'),
  setting: icon('ic_setting'),
  config: icon('ic_contrast'),
  blog: icon('ic_blog'),
  time: <Iconify icon="eva:clock-outline" />,
  calendar: icon('ic_calendar'),
  activityLog: icon('ic_activity_log'),
};

const navConfig: { subheader: string; items: NavListProps[] }[] = [
  // QUẢN LÝ HỢP ĐỒNG NHÀ TRẠM
  // ----------------------------------------------------------------------
  {
    subheader: 'QUẢN LÝ HỢP ĐỒNG NHÀ TRẠM',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.root, icon: ICONS.banking },
      {
        title: 'Hợp đồng mặt bằng',
        path: PATH_HOP_DONG_MAT_BANG.root,
        icon: ICONS.hopdong,
        children: [
          { title: 'Danh sách', path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.danh_sach },
          // { title: 'Thanh toán', path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.thanh_toan },
          {
            title: 'Đàm phán',
            path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.giao_viec,
            module: 'DAM_PHAN',
          },
          { title: 'Đối tác', path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.doi_tac },
          { title: 'Lịch sử', path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.lich_su },
          { title: 'Báo cáo', path: PATH_HOP_DONG_MAT_BANG.hopDongMatBang.bao_cao },
        ],
      },
      {
        title: 'Hợp đồng xã hội hóa',
        path: PATH_HOP_DONG_XA_HOI_HOA.root,
        icon: ICONS.hopdong,
        children: [
          { title: 'Danh sách', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.danh_sach },
          // { title: 'Thanh toán', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.thanh_toan },
          { title: 'Đàm phán', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.giao_viec },
          { title: 'Đối tác', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.doi_tac },
          { title: 'Lịch sử', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.lich_su },
          { title: 'Báo cáo', path: PATH_HOP_DONG_XA_HOI_HOA.hopDongXaHoiHoa.bao_cao },
        ],
      },
      {
        title: 'Hợp đồng IBC',
        path: PATH_HOP_DONG_IBC.root,
        icon: ICONS.hopdong,
        children: [
          { title: 'Danh sách', path: PATH_HOP_DONG_IBC.hopDongIbc.danh_sach },
          // { title: 'Thanh toán', path: PATH_HOP_DONG_IBC.hopDongIbc.thanh_toan },
          { title: 'Đàm phán', path: PATH_HOP_DONG_IBC.hopDongIbc.giao_viec },
          { title: 'Đối tác', path: PATH_HOP_DONG_IBC.hopDongIbc.doi_tac },
          { title: 'Lịch sử', path: PATH_HOP_DONG_IBC.hopDongIbc.lich_su },
          { title: 'Báo cáo', path: PATH_HOP_DONG_IBC.hopDongIbc.bao_cao },
        ],
      },
      { title: 'Trạm', path: PATH_DASHBOARD.station, icon: ICONS.station },
      { title: 'Thông báo', path: PATH_DASHBOARD.notification, icon: ICONS.notification },
      { title: 'Activity Log', path: PATH_DASHBOARD.activityLog, icon: ICONS.activityLog },
    ],
  },
  // PHÒNG ĐÀI
  //----------------------------------------------------------------------
  {
    subheader: 'CẤU HÌNH PHÒNG ĐÀI',
    items: [
      {
        title: 'Quản lý người dùng',
        path: PATH_SETTING_PD.nguoiDung,
        icon: ICONS.user,
        module: 'NGUOI_DUNG',
      },
      {
        title: 'Quản lý chức vụ',
        path: PATH_SETTING_PD.chucvu,
        icon: <Iconify icon="eva:lock-fill" />,
        module: 'CHUC_VU',
      },
    ],
  },
  // CẤU HÌNH HỆ THỐNG
  //----------------------------------------------------------------------
  {
    subheader: 'CẤU HÌNH HỆ THỐNG',
    items: [
      {
        title: 'Danh mục',
        path: PATH_CATEGORY.root,
        icon: <Iconify icon="tabler:category" />,
        module: 'DANH_MUC',
        children: [
          { title: 'Đối tượng ký hợp đồng', path: PATH_CATEGORY.category.doi_tuong },
          { title: 'Đơn vị dùng chung', path: PATH_CATEGORY.category.don_vi_dung_chung },
          { title: 'Hình thức ký hợp đồng', path: PATH_CATEGORY.category.hinh_thuc_ky_hop_dong },
          { title: 'Hình thức thanh toán', path: PATH_CATEGORY.category.hinh_thuc_thanh_toan },
          { title: 'Hình thức đầu tư', path: PATH_CATEGORY.category.hinh_thuc_dau_tu },
          { title: 'Khoản mục', path: PATH_CATEGORY.category.khoan_muc },
          { title: 'Khu vực trạm', path: PATH_CATEGORY.category.khu_vuc_tram },
          { title: 'Loại CSHT', path: PATH_CATEGORY.category.loai_csht },
          { title: 'Loại cột Anten', path: PATH_CATEGORY.category.loai_cot_anten },
          { title: 'Loại hạng mục CSHT', path: PATH_CATEGORY.category.loai_hang_muc_csht },
          { title: 'Loại phòng máy', path: PATH_CATEGORY.category.loai_phong_may },
          {
            title: 'Loại phòng máy phát điện',
            path: PATH_CATEGORY.category.loai_phong_may_phat_dien,
          },
          { title: 'Loại thiết bị ran', path: PATH_CATEGORY.category.loai_thiet_bi_ran },
          { title: 'Loại trạm', path: PATH_CATEGORY.category.loai_tram },
          { title: 'Loại trạm VHKT', path: PATH_CATEGORY.category.loai_tram_vhkt },
          { title: 'Phòng Đài', path: PATH_CATEGORY.category.phong_dai },
          { title: 'Tổ', path: PATH_CATEGORY.category.to },
          { title: 'Thuê phụ trợ', path: PATH_CATEGORY.category.loai_hd_phu_tro },
          { title: 'Thuế', path: PATH_CATEGORY.category.thue },
          { title: 'Tỉnh/Huyện', path: PATH_CATEGORY.category.tinh_huyen },
        ],
      },
      {
        title: 'Cấu hình IP',
        path: PATH_CONFIGURATION.configuration.configip,
        icon: ICONS.calendar,
      },
    ],
  },
  // CÀI ĐẶT HỆ THỐNG
  //----------------------------------------------------------------------
  {
    subheader: 'CÀI ĐẶT HỆ THỐNG',
    items: [
      {
        title: 'Cài đặt chu kỳ',
        path: PATH_SETTINGS.setting.cycle,
        icon: ICONS.blog,
      },
      {
        title: 'Cài đặt thời gian',
        path: PATH_SETTINGS.setting.time,
        icon: <Iconify icon="eva:clock-outline" />,
      },
      {
        title: 'Cài đặt nhắc nhở',
        path: PATH_SETTINGS.setting.remind,
        icon: ICONS.notification,
      },
    ],
  },
];

export default navConfig;
