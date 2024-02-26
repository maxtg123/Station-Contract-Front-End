/* eslint-disable no-nested-ternary */
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { InputBase, Paper, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { IHopDongPheDuyet } from 'src/@types/hopdong';
import type { IPheDuyetHopDongInput, ITrangThaiPheDuyet } from 'src/@types/hopdongmatbang';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import FormProvider from 'src/components/hook-form/FormProvider';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { useHopDongDetailQuery } from 'src/data/hopDongMatBang';
import { useXetDuyetHopDongMutation } from 'src/data/pheduyetHopDong';
import * as Yup from 'yup';
// ----------------------------------------------------------------------

type FormValuesProps = {
  comment: string;
};

const CommentSchema = Yup.object().shape({
  comment: Yup.string(),
});

const defaultValues = {
  comment: '',
};

type Props = {
  formType: 'xet_duyet' | 'gui_lai';
};
export default function PheDuyetCommentForm({ formType = 'xet_duyet' }: Props) {
  const {
    state: { rightBar, hopDong, hopDongForm },
    dispatch,
  } = useChiTietHopDongContext();
  const data = rightBar?.data as IHopDongPheDuyet;

  const [openConfirm, setOpenConfirm] = useState(false);
  const [type, setType] = useState<'dong_y' | 'tu_choi' | 'gui_lai'>('dong_y');
  const [loadingEditForm, setIsLoadingEditForm] = useState(false);

  const queryClient = useQueryClient();
  const { mutate: xetDuyet, isLoading } = useXetDuyetHopDongMutation();
  const { refetch } = useHopDongDetailQuery(hopDong ? hopDong?.id : 0, {
    refetchOnWindowFocus: false,
    enabled: !!hopDong?.id,
  });

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const { control, reset, handleSubmit } = methods;

  const onSubmit = async (values: FormValuesProps) => {
    try {
      if (!rightBar || rightBar.type !== 'phe_duyet' || !rightBar.data || !hopDong || !hopDong.id) {
        return;
      }
      let _trangThaiPheDuyet: ITrangThaiPheDuyet = 'PHE_DUYET';
      let messageSuccess = '';
      if (type === 'dong_y') {
        _trangThaiPheDuyet = 'PHE_DUYET';
        messageSuccess = 'Đồng ý phê duyệt thành công';
      } else if (type === 'tu_choi') {
        _trangThaiPheDuyet = 'TU_CHOI';
        messageSuccess = 'Từ chối phê duyệt thành công';
      } else if (type === 'gui_lai') {
        _trangThaiPheDuyet = 'GUI_LAI';
        messageSuccess = 'Gửi lại xét duyệt thành công';
      }
      const input: IPheDuyetHopDongInput = {
        hopDongId: hopDong.id,
        hopDongPheDuyetId: data.id,
        ghiChu: values.comment || '',
        trangThaiPheDuyet: _trangThaiPheDuyet,
        changeLog: '',
      };
      xetDuyet(input, {
        onSuccess() {
          dispatch({ type: 'toggle-refresh-phe-duyet' });
          enqueueSnackbar(messageSuccess, {
            variant: 'success',
          });
          handleCloseConfirm();
          reset();
          if (type === 'dong_y') {
            queryClient.invalidateQueries({
              predicate: (query) => {
                return query.queryKey[0] === API_ENDPOINTS.HOP_DONG;
              },
            });
          }
        },
        onError(error, variables, context) {
          const msg = 'Có lỗi trong quá trình gửi xét duyệt hợp đồng';
          enqueueSnackbar(msg, {
            variant: 'error',
          });
          handleCloseConfirm();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleApproval = () => {
    setType('dong_y');
    handleOpenConfirm();
  };

  const handleReject = () => {
    setType('tu_choi');
    handleOpenConfirm();
  };

  const handleGuiLai = () => {
    setType('gui_lai');
    handleOpenConfirm();
  };

  const handleOpenEditHopDongForm = async () => {
    if (hopDong) {
      setIsLoadingEditForm(true);
      refetch().then(async ({ isSuccess, data: newData }) => {
        if (isSuccess) {
          dispatch({ type: 'set-data-hop-dong', payload: newData.elements[0] });
          dispatch({ type: 'open-edit-hop-dong' });
        }
        setIsLoadingEditForm(false);
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {data.trangThaiPheDuyetMoiNhat !== 'PHE_DUYET' && (
        <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
          <Controller
            name="comment"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <InputBase
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ý kiến xét duyệt..."
                  sx={{ px: 1 }}
                  error={!!error}
                />
              );
            }}
          />

          <Stack direction="row" alignItems="center">
            <Stack direction="row" flexGrow={1}>
              <LoadingButton loading={loadingEditForm} onClick={handleOpenEditHopDongForm}>
                Chỉnh sửa hợp đồng
              </LoadingButton>
            </Stack>
            <Stack direction="row" alignItems="center" gap={2}>
              {formType === 'xet_duyet' && (
                <>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    color="error"
                    loading={isLoading}
                    onClick={handleReject}
                  >
                    Từ chối
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    variant="contained"
                    loading={isLoading}
                    onClick={handleApproval}
                  >
                    Đồng ý
                  </LoadingButton>
                </>
              )}
              {formType === 'gui_lai' && (
                <LoadingButton
                  type="button"
                  variant="contained"
                  loading={isLoading}
                  onClick={handleGuiLai}
                >
                  Gửi lại
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </Paper>
      )}

      <ConfirmDialog
        open={openConfirm}
        onClose={() => {
          handleCloseConfirm();
        }}
        title="Xác nhận"
        content={
          type === 'dong_y'
            ? 'Bạn chắc chắn đồng ý phê duyệt hợp đồng? Khi đồng ý thành công các thông tin chỉnh sửa trong quá trình phê duyệt sẽ được cập nhật lên hợp đồng hiện hữu'
            : type === 'tu_choi'
            ? 'Bạn chắc chắn từ chối phê duyệt hợp đồng?'
            : type === 'gui_lai'
            ? 'Bạn chắc chắn muốn gửi lại xét duyệt?'
            : ''
        }
        action={
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            Chắc chắn
          </LoadingButton>
        }
      />
    </FormProvider>
  );
}
