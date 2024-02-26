import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputBase,
  Paper,
  Stack,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DialogAnimate } from 'src/components/animate';
import FormProvider from 'src/components/hook-form/FormProvider';
import * as Yup from 'yup';

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
  open: boolean;
  onClose: VoidFunction;
  onSave: ({ comment }: { comment: string }) => void;
  type: 'gui-lai-phe-duyet';
};
const HopDongSendDiffDialog = ({ open, onClose, type, onSave }: Props) => {
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const { control, reset, handleSubmit } = methods;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (data: FormValuesProps) => {
    onSave(data);
  };

  return (
    <DialogAnimate open={open} onClose={handleClose}>
      <DialogTitle>Gửi lại hợp đồng phê duyệt</DialogTitle>
      <DialogContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                    placeholder="Ghi chú..."
                    sx={{ px: 1 }}
                    error={!!error}
                  />
                );
              }}
            />

            <Stack direction="row" alignItems="center">
              <Stack direction="row" flexGrow={1} />
              <Stack direction="row" alignItems="center" gap={2}>
                <Button type="submit" variant="contained">
                  Gửi phê duyệt
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* <ConfirmDialog
            open={openConfirm}
            onClose={() => {
              handleCloseConfirm();
            }}
            title="Xác nhận"
            content={
              type === 'dong_y'
                ? 'Bạn chắc chắn đồng ý phê duyệt hợp đồng? Khi đồng ý thành công các thông tin chỉnh sửa trong quá trình phê duyệt sẽ được cập nhật lên hợp đồng hiện hữu'
                : 'Bạn chắc chắn từ chối phê duyệt hợp đồng?'
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
          /> */}
        </FormProvider>
      </DialogContent>

      <DialogActions sx={{ pt: 0 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Hủy
        </Button>
      </DialogActions>
    </DialogAnimate>
  );
};

export default HopDongSendDiffDialog;
