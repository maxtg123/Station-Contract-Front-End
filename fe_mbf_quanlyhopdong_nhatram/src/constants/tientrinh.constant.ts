const tienTrinhModule = {
  HOP_DONG: 'HOP_DONG',
  TRAM: 'TRAM',
};
const tienTrinhAction = {
  HOP_DONG: {
    IMPORT: 'IMPORT',
    DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU: 'DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU',
    DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU:
      'DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU',
  },
  TRAM: {
    SYNCHRONIZED: 'SYNCHRONIZED',
  },
};
const tienTrinhMessage = {
  HOP_DONG: {
    IMPORT: {
      MAT_BANG: {
        SUCCESS: 'Import hợp đồng mặt bằng thành công',
        ERROR: 'Có lỗi trong quá trình import hợp đồng mặt bằng',
        LOADING: 'Đang import hợp đồng mặt bằng...',
      },
      XA_HOI_HOA: {
        SUCCESS: 'Import hợp đồng xã hội hóa thành công',
        ERROR: 'Có lỗi trong quá trình import hợp đồng xã hội hóa',
        LOADING: 'Đang import hợp đồng xã hội hóa...',
      },
      IBC: {
        SUCCESS: 'Import hợp đồng IBC thành công',
        ERROR: 'Có lỗi trong quá trình import hợp đồng IBC',
        LOADING: 'Đang import hợp đồng IBC...',
      },
    },
    DONG_BO_PHU_LUC_TU_CHUONG_TRINH_CU: {
      SUCCESS: 'Đồng bộ phụ lục hợp đồng từ chương trình cũ thành công',
      ERROR: 'Có lỗi trong quá trình đồng bộ phụ lục hợp đồng từ chương trình cũ',
      LOADING: 'Đang đồng bộ phụ lục hợp đồng từ chương trình cũ...',
    },
    DONG_BO_THONG_TIN_THU_HUONG_TU_CHUONG_TRINH_CU: {
      SUCCESS: 'Đồng bộ thông tin hợp đồng thụ hưởng từ chương trình cũ thành công',
      ERROR: 'Có lỗi trong quá trình đồng bộ thông tin hợp đồng thụ hưởng từ chương trình cũ',
      LOADING: 'Đang đồng bộ thông tin hợp đồng thụ hưởng từ chương trình cũ...',
    },
  },
  TRAM: {
    SYNCHRONIZED: {
      SUCCESS: 'Đồng bộ trạm PTM thành công',
      ERROR: 'Có lỗi trong quá trình đồng bộ trạm PTM',
      LOADING: 'Đang đồng bộ trạm PTM...',
    },
  },
};

export { tienTrinhAction, tienTrinhMessage, tienTrinhModule };
