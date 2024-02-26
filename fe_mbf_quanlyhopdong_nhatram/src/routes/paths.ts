// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_HOP_DONG_MAT_BANG = '/hop-dong-mat-bang';
const ROOTS_HOP_DONG_XA_HOI_HOA = '/hop-dong-xa-hoi-hoa';
const ROOTS_HOP_DONG_IBC = '/hop-dong-ibc';
const ROOTS_PAYMENT = '/thanh-toan';
const ROOTS_STATION = '/tram';
const ROOTS_ASSIGN = '/giao-viec';
const ROOTS_HISTORY = '/lich-su';
const ROOTS_REPORT = '/bao-cao';
const ROOTS_NOTIFICATION = '/thong-bao';
const ROOTS_ACTIVITY_LOG = '/activity-log';

const ROOTS_CONFIGURATION = '/cau-hinh';
const ROOTS_SETTING_PD = '/cau-hinh-phongdai';
const ROOTS_SETTINGS = '/cai-dat';
const ROOTS_CATEGORY = '/danh-muc';
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/dang-nhap',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  payment: ROOTS_PAYMENT,
  station: ROOTS_STATION,
  assign: ROOTS_ASSIGN,
  history: ROOTS_HISTORY,
  report: ROOTS_REPORT,
  notification: ROOTS_NOTIFICATION,
  activityLog: ROOTS_ACTIVITY_LOG,
};
export const PATH_CONFIGURATION = {
  root: ROOTS_CONFIGURATION,
  configuration: {
    category: path(ROOTS_CONFIGURATION, '/danh-muc'),
    // decentralization: path(ROOTS_CONFIGURATION, '/phan-quyen'),
    configip: path(ROOTS_CONFIGURATION, '/ip'),
  },
};

export const PATH_SETTING_PD = {
  nguoiDung: path(ROOTS_SETTING_PD, '/nguoi-dung'),
  chucvu: path(ROOTS_SETTING_PD, '/chuc-vu'),
};

export const PATH_SETTINGS = {
  root: ROOTS_SETTINGS,
  setting: {
    cycle: path(ROOTS_SETTINGS, '/chu-ky'),
    time: path(ROOTS_SETTINGS, '/thoi-gian'),
    remind: path(ROOTS_SETTINGS, '/nhac-nho'),
  },
};
export const PATH_HOP_DONG_MAT_BANG = {
  root: ROOTS_HOP_DONG_MAT_BANG,
  hopDongMatBang: {
    danh_sach: path(ROOTS_HOP_DONG_MAT_BANG, '/danh-sach'),
    bao_cao: path(ROOTS_HOP_DONG_MAT_BANG, '/bao-cao'),
    thanh_toan: path(ROOTS_HOP_DONG_MAT_BANG, '/thanh-toan'),
    giao_viec: path(ROOTS_HOP_DONG_MAT_BANG, '/giao-viec'),
    lich_su: path(ROOTS_HOP_DONG_MAT_BANG, '/lich-su'),
    doi_tac: path(ROOTS_HOP_DONG_MAT_BANG, '/doi-tac'),
  },
};
export const PATH_HOP_DONG_XA_HOI_HOA = {
  root: ROOTS_HOP_DONG_XA_HOI_HOA,
  hopDongXaHoiHoa: {
    danh_sach: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/danh-sach'),
    bao_cao: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/bao-cao'),
    thanh_toan: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/thanh-toan'),
    giao_viec: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/giao-viec'),
    lich_su: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/lich-su'),
    doi_tac: path(ROOTS_HOP_DONG_XA_HOI_HOA, '/doi-tac'),
  },
};
export const PATH_HOP_DONG_IBC = {
  root: ROOTS_HOP_DONG_IBC,
  hopDongIbc: {
    danh_sach: path(ROOTS_HOP_DONG_IBC, '/danh-sach'),
    bao_cao: path(ROOTS_HOP_DONG_IBC, '/bao-cao'),
    thanh_toan: path(ROOTS_HOP_DONG_IBC, '/thanh-toan'),
    giao_viec: path(ROOTS_HOP_DONG_IBC, '/giao-viec'),
    lich_su: path(ROOTS_HOP_DONG_IBC, '/lich-su'),
    doi_tac: path(ROOTS_HOP_DONG_IBC, '/doi-tac'),
  },
};
export const PATH_CATEGORY = {
  root: ROOTS_CATEGORY,
  category: {
    loai_csht: path(ROOTS_CATEGORY, '/loai-csht'),
    loai_hang_muc_csht: path(ROOTS_CATEGORY, '/loai-hang-muc-csht'),
    hinh_thuc_dau_tu: path(ROOTS_CATEGORY, '/hinh-thuc-dau-tu'),
    doi_tuong: path(ROOTS_CATEGORY, '/doi-tuong'),
    loai_cot_anten: path(ROOTS_CATEGORY, '/loai-cot-anten'),
    phong_dai: path(ROOTS_CATEGORY, '/phong-dai'),
    to: path(ROOTS_CATEGORY, '/to'),
    tinh_huyen: path(ROOTS_CATEGORY, '/tinh-huyen'),
    thue: path(ROOTS_CATEGORY, '/thue'),
    loai_phong_may: path(ROOTS_CATEGORY, '/loai-phong-may'),
    loai_hd_phu_tro: path(ROOTS_CATEGORY, '/hop-dong-phu-tro'),
    hinh_thuc_thanh_toan: path(ROOTS_CATEGORY, '/hinh-thuc-thanh-toan'),
    loai_thiet_bi_ran: path(ROOTS_CATEGORY, '/loai-thiet-bi-ran'),
    hinh_thuc_ky_hop_dong: path(ROOTS_CATEGORY, '/hinh-thuc-ky-hop-dong'),
    loai_tram: path(ROOTS_CATEGORY, '/loai-tram'),
    khu_vuc_tram: path(ROOTS_CATEGORY, '/khu-vuc-tram'),
    loai_phong_may_phat_dien: path(ROOTS_CATEGORY, '/loai-phong-may-phat-dien'),
    loai_tram_vhkt: path(ROOTS_CATEGORY, '/loai-tram-vhkt'),
    don_vi_dung_chung: path(ROOTS_CATEGORY, '/don-vi-dung-chung'),
    khoan_muc: path(ROOTS_CATEGORY, '/khoan-muc'),
  },
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
};
