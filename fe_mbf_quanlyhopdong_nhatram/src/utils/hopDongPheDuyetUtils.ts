import { IHopDongDamPhanStatus, IHopDongPheDuyetStatus } from 'src/@types/hopdong';
import { LabelColor } from 'src/components/label';

export const getTrangThaiPheDuyet = (
  trangThaiRemote: IHopDongPheDuyetStatus
): { color: LabelColor; text: string } => {
  let color: LabelColor = 'primary';
  let text = '';
  switch (trangThaiRemote) {
    case 'CHO_PHE_DUYET':
      color = 'default';
      text = 'Đang chờ';
      break;
    case 'PHE_DUYET':
      color = 'success';
      text = 'Đã được xét duyệt';
      break;
    case 'TU_CHOI':
      color = 'error';
      text = 'Từ chối';
      break;
    case 'GUI_LAI':
      color = 'default';
      text = 'Đã gửi lại';
      break;
    case 'UPDATE_HOP_DONG':
      color = 'info';
      text = 'Đã cập nhật hợp đồng';
      break;
    default:
      break;
  }

  return {
    color,
    text,
  };
};
export const getTrangThaiDamPhan = (
  trangThaiRemote: IHopDongDamPhanStatus
): { color: LabelColor; text: string } => {
  let color: LabelColor = 'primary';
  let text = '';
  switch (trangThaiRemote) {
    case 'GUI_DAM_PHAN':
      color = 'default';
      text = 'Đang chờ';
      break;
    case 'PHE_DUYET':
      color = 'success';
      text = 'Đã được xét duyệt';
      break;
    case 'TU_CHOI':
      color = 'error';
      text = 'Từ chối';
      break;
    default:
      break;
  }

  return {
    color,
    text,
  };
};

export const getTypeXetDuyet = (
  type: 'hop_dong' | 'phu_luc'
): { color: LabelColor; text: string } => {
  let color: LabelColor = 'primary';
  let text = '';
  switch (type) {
    case 'hop_dong':
      color = 'primary';
      text = 'Xét duyệt hợp đồng';
      break;
    case 'phu_luc':
      color = 'info';
      text = 'Xét duyệt phụ lục';
      break;
    default:
      break;
  }

  return {
    color,
    text,
  };
};
