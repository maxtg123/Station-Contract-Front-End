import { LoadingButton } from '@mui/lab';
import { Button, IconButton, InputBase, Paper, Stack, Tooltip } from '@mui/material';
import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { IDamPhamForm } from 'src/@types/damphan';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import Iconify from 'src/components/iconify/Iconify';

type IDamPhanInputProps = {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  onSubmit: (data: IDamPhamForm) => void;
};

const DamPhanInput = ({ selectedFiles, setSelectedFiles, onSubmit }: IDamPhanInputProps) => {
  const { setValue, formState, handleSubmit } = useFormContext<IDamPhamForm>();
  const { isSubmitting } = formState;
  const [confirmDialog, setConfirmDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files) {
      const fileList = Array.from(files);
      fileList.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          path: file.name,
        })
      );
      setSelectedFiles([...selectedFiles, ...fileList]);
    }
  };
  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };
  const handleOpenConfirmDialog = () => {
    setConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setConfirmDialog(false);
  };
  return (
    <Stack direction="row" spacing={2} sx={{ py: 3, px: 2.5 }}>
      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1 }}>
        <InputBase
          fullWidth
          multiline
          rows={4}
          placeholder="Nhập nội dung ghi chú..."
          sx={{ px: 1 }}
          name="ghiChu"
          onChange={(e) => {
            setValue('ghiChu', e.target.value.trim());
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />
        <Stack direction="row" alignItems="center">
          <Stack direction="row" flexGrow={1}>
            <Tooltip title="Thêm files đính kèm">
              <IconButton size="small" onClick={handleClickAttach}>
                <Iconify icon="eva:attach-2-fill" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Button variant="contained" type="button" onClick={handleOpenConfirmDialog}>
            Gửi kết quả
          </Button>
        </Stack>
      </Paper>

      <ConfirmDialog
        open={confirmDialog}
        onClose={() => {
          handleCloseConfirmDialog();
        }}
        title="Xác nhận"
        content="Bạn có chắc chắn gửi đàm phán hợp đồng này?"
        action={
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Chắc chắn
          </LoadingButton>
        }
      />
    </Stack>
  );
};

export default DamPhanInput;
