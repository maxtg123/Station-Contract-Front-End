import { Checkbox, FormControlLabel, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { IChucVuRow } from 'src/@types/chucvu';
import { PHAN_QUYEN } from 'src/_mock/assets/chucvu';

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  selectedChucVu?: IChucVuRow | null;
}

export default function XemQuyenNguoiDung(props: SimpleDialogProps) {
  const { onClose, open, selectedChucVu } = props;
  const handleClose = () => {
    onClose(false);
  };

  if (!selectedChucVu) {
    handleClose();
  }

  // checkbox
  const [checked, setChecked] = useState<string[]>([]); // format module:action

  useEffect(() => {
    setChecked(
      selectedChucVu ? selectedChucVu.chucVuPhanQuyenList.map((p) => `${p.module}:${p.action}`) : []
    );
  }, [selectedChucVu]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md">
      {selectedChucVu && (
        <>
          <DialogTitle>
            Danh sách quyền, chức vụ của {` `}
            {selectedChucVu.ten}:
          </DialogTitle>

          <DialogContent>
            <div>
              {PHAN_QUYEN.map((item, key) => (
                <Stack
                  spacing={2}
                  alignItems="center"
                  key={key}
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  sx={{ py: 1 }}
                >
                  <span style={{ color: '#919EAB', fontWeight: 700, width: 150, fontSize: 13 }}>
                    {item.label.toUpperCase()}
                  </span>
                  {item.child.map((itemChild, keyChild) => (
                    <FormControlLabel
                      label={itemChild.label}
                      key={keyChild}
                      control={
                        <Checkbox
                          disabled
                          checked={checked.indexOf(`${item.key}:${itemChild.key}`) !== -1}
                        />
                      }
                    />
                  ))}
                </Stack>
              ))}
            </div>
          </DialogContent>
        </>
      )}

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
