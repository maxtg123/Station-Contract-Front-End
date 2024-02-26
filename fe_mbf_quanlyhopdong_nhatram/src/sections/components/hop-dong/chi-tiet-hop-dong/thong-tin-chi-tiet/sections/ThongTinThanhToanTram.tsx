import { Stack, Typography } from '@mui/material';
import isUndefined from 'lodash/isUndefined';
import { IHopDongKyThanhToan, IHopDongTramList } from 'src/@types/hopdong';
import { statusMappingsHopDong } from 'src/@types/thanhtoan';
import Iconify from 'src/components/iconify/Iconify';
import Label from 'src/components/label/Label';
import { fCurrencyVND } from 'src/utils/formatNumber';
import { fDate } from 'src/utils/formatTime';
import { getTinhTrangThanhToanOfHD } from 'src/utils/hopDongUtils';

type IProps = {
  data: IHopDongTramList;
};

const ThongTinThanhToanTram = ({ data }: IProps) => {
  let statusData;
  const kyThanhToan = data.hopDongTramKyThanhToanList.find(
    (item: IHopDongKyThanhToan) => item.daThanhToanNgay === null
  );
  const filteredData = data.hopDongTramKyThanhToanList.filter(
    (item: IHopDongKyThanhToan) => item.daThanhToanNgay !== null
  );
  const daThanhToanDenNgay = filteredData.length > 0 ? filteredData[filteredData.length - 1] : null;
  if (!isUndefined(kyThanhToan)) {
    const dateKyThanhToan = {
      tuNgay: kyThanhToan.tuNgay,
      denNgay: kyThanhToan.denNgay,
    };
    const resultStatusHopDong = getTinhTrangThanhToanOfHD(dateKyThanhToan);
    statusData = statusMappingsHopDong[resultStatusHopDong as keyof typeof statusMappingsHopDong];
  }
  return (
    <>
      <Typography
        variant="subtitle2"
        gutterBottom
        sx={{ color: '#1963AE', fontWeight: '700', mb: '16px' }}
      >
        THÔNG TIN THANH TOÁN CỦA TRẠM
      </Typography>
      <Stack direction="row" spacing={2} mb={1}>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Trạng thái thanh toán:
        </Typography>{' '}
        {!kyThanhToan && (
          <Label
            variant="soft"
            color={statusMappingsHopDong.DA_THANH_TOAN.color}
            sx={{ textTransform: 'capitalize' }}
            startIcon={<Iconify icon={statusMappingsHopDong.DA_THANH_TOAN.icon} />}
          >
            {statusMappingsHopDong.DA_THANH_TOAN.label}
          </Label>
        )}
        {statusData && (
          <Label
            variant="soft"
            color={statusData.color}
            sx={{ textTransform: 'capitalize' }}
            startIcon={<Iconify icon={statusData.icon} />}
          >
            {statusData.label}
          </Label>
        )}
      </Stack>
      <Typography variant="body2" gutterBottom>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Giá thuê trạm (+VAT):
        </Typography>{' '}
        {fCurrencyVND(data.giaThue)}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Ngày bắt đầu yêu cầu thanh toán:
        </Typography>{' '}
        {data?.ngayBatDauYeuCauThanhToan ? fDate(data.ngayBatDauYeuCauThanhToan) : null}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Đã thanh toán đến ngày:
        </Typography>{' '}
        {daThanhToanDenNgay?.tuNgay ? fDate(daThanhToanDenNgay.tuNgay) : null}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Kỳ thanh toán kế tiếp:
        </Typography>{' '}
        {!isUndefined(kyThanhToan) ? (
          <span>{`${fDate(kyThanhToan.tuNgay)} - ${fDate(kyThanhToan.denNgay)} `}</span>
        ) : null}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Typography component="span" variant="body2" sx={{ fontWeight: '700' }}>
          Điện khoán:
        </Typography>{' '}
        {fCurrencyVND(data.giaDienKhoan)}
      </Typography>
    </>
  );
};

export default ThongTinThanhToanTram;
