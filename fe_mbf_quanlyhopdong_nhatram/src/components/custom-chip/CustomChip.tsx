import { Box, Chip, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChipData, ICustomChipProps } from './types';

const ListItem = styled('li')(({ theme }) => ({
  margin: theme.spacing(0.2),
}));
const optionMapKey: { [key: string]: string } = {
  da_phat_song: 'Đã phát sóng',
  chua_phat_song: 'Trạm phát triển mạng',
  tinh: 'Tỉnh/TP',
  huyen: 'Quận/Huyện',
  xa: 'Phường/Xã',
  phongDai: 'Phòng/Đài',
  to: 'Tổ',
  trangThaiHoatDong: 'Trạng thái hoạt động',
  loaiCsht: 'Loại cơ sở hạ tầng',
  NGUNG_HOAT_DONG: 'Tạm dừng',
  HOAT_DONG: 'Hoạt động',
  chua_gui_phe_duyet: 'Chưa gửi phê duyệt',
  from: 'Từ ngày',
  maTram: 'Mã trạm',
  soHopDong: 'Số hợp đồng',
  soHopDongErp: 'Số hợp đồng ERP',
  ngayKyFrom: 'Ngày ký từ ngày',
  ngayKyTo: 'Ngày ký đến ngày',
  kyThanhToanFrom: 'Kỳ thanh toán từ ngày',
  kyThanhToanTo: 'Kỳ thanh toán đến ngày',
  ngayKetThucFrom: 'Ngày kết thúc từ ngày',
  ngayKetThucTo: 'Ngày kết thúc đến ngày',
  hinhThucDauTuId: 'Hình thức đầu tư',
  hinhThucKyHopDongId: 'Hình thức ký hợp đồng',
  doiTuongKyHopDongId: 'Đối tượng ký hợp đồng',
  tinhTrangThanhToan: 'Tình trạng thanh toán',
  idTinh: 'Tỉnh/TP',
  idHuyen: 'Quận/Huyện',
  idXa: 'Phường/Xã',
  phongDaiId: 'Phòng/Đài',
  tinhTrangHopDong: 'Tình trạng hợp đồng',
  TAT_CA: 'Tất cả',
  CAN_THANH_TOAN: 'Cần thanh toán',
  QUA_HAN: 'Quá hạn thanh toán',
};

export default function CustomChip({
  data,
  title,
  onDeletedChipTab,
  onDeletedChipMultiFilter,
}: ICustomChipProps) {
  const [chipData, setChipData] = useState<ChipData[]>([]);
  const handleDelete = (chipToDelete: ChipData) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    onDeletedChipTab?.();
    onDeletedChipMultiFilter?.();
  };
  useEffect(() => {
    if (data.length > 0) {
      setChipData(data);
    }
  }, [data]);
  return (
    <Box
      sx={{
        border: '1px dashed #ccc',
        padding: '4px',
        borderRadius: '8px',
        display: 'inline-flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 0.5,
        flexWrap: 'wrap',
        listStyle: 'none',
      }}
      component="ul"
    >
      <Typography variant="subtitle2">{optionMapKey[title] || title}:</Typography>
      {chipData?.map((item) => (
        <ListItem key={item.key}>
          <Chip
            label={optionMapKey[item.label] || item.label}
            color="primary"
            size="small"
            sx={{ borderRadius: '8px', backgroundColor: '#212b36' }}
            onDelete={handleDelete(item)}
          />
        </ListItem>
      ))}
    </Box>
  );
}
