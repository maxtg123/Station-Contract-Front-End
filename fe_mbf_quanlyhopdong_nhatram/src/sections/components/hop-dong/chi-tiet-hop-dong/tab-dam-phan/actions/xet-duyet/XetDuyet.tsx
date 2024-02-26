import { Box, Button, Stack, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { IXetDuyetInput } from 'src/@types/damphan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { useXetDuyetDamPhanMutation } from 'src/data/damPhanHopDong';

const ConfirmDialog = dynamic(() => import('src/components/confirm-dialog/ConfirmDialog'));

type IAction = 'tu_choi' | 'phe_duyet';
type Props = {
  hopDongId: number;
  hopDongDamPhanId: number;
  tienTrinhId: number;
};
const XetDuyet = ({ hopDongId, hopDongDamPhanId, tienTrinhId }: Props) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [action, setAction] = useState<IAction | ''>('');
  const [ghiChu, setGhiChu] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const { mutate: xetDuyet, isLoading } = useXetDuyetDamPhanMutation();

  const handleXetDuyet = () => {
    if (action !== '') {
      const input: IXetDuyetInput = {
        hopDongId,
        hopDongDamPhanId,
        tienTrinhId,
        ghiChu,
        action,
      };
      xetDuyet(input, {
        onSuccess: () => {
          enqueueSnackbar(`Gửi xét duyệt đàm phán thành công`, {
            variant: 'success',
          });
          queryClient.invalidateQueries([API_ENDPOINTS.HOP_DONG, { hopDongId }, 'list-dam-phan']);
          setOpenConfirm(false);
        },
        onError: (error: any) => {
          const msg = 'Có lỗi trong quá trình gửi xét duỵệt nội dung đàm phán';
          enqueueSnackbar(msg, {
            variant: 'error',
          });
        },
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" width="100%" spacing={2} alignItems="center">
        <TextField
          multiline
          rows={3}
          sx={{ flex: 1 }}
          placeholder="Nhập lý do từ chối hoặc đồng ý phê duyệt"
          onChange={(e) => {
            setGhiChu(e.target.value.trim());
          }}
        />
        <Stack direction="column" spacing={1}>
          <Button
            variant="outlined"
            color="error"
            disabled={isLoading}
            onClick={() => {
              setAction('tu_choi');
              setOpenConfirm(true);
            }}
          >
            Từ chối
          </Button>
          <Button
            variant="outlined"
            color="primary"
            disabled={isLoading}
            onClick={() => {
              setAction('phe_duyet');
              setOpenConfirm(true);
            }}
          >
            Phê duyệt
          </Button>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title={
          action === 'tu_choi'
            ? 'Gửi từ chối nội dung đàm phán'
            : 'Gửi đồng ý phê duyệt nội dung đàm phán'
        }
        content="Bạn chắc chắn có muốn thực hiện thao tác này?"
        action={
          <Button
            variant="contained"
            color={action === 'tu_choi' ? 'error' : 'primary'}
            onClick={handleXetDuyet}
          >
            Đồng ý
          </Button>
        }
      />
    </Box>
  );
};

export default XetDuyet;
