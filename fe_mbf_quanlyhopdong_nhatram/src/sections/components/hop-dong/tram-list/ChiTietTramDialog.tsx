import { Box, Chip, CircularProgress, Dialog, Grid, Stack, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import sortBy from 'lodash/sortBy';
import { IDmLoaiThietBiRan } from 'src/@types/category';
import Label from 'src/components/label/Label';
import { TABLE_HEAD } from 'src/constants/tram.constant';
import { useTramQuery } from 'src/data/tram';
import { fDate } from 'src/utils/formatTime';

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  id: number;
}

export default function ChiTietTramDialog(props: SimpleDialogProps) {
  const { onClose, open, id } = props;

  const { data, isLoading } = useTramQuery(id, { refetchOnWindowFocus: false });

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md">
      <DialogTitle>Chi tiết trạm {` `}</DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
      >
        {isLoading ? (
          <Box>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} columns={12} width="100%" mb={4}>
            {TABLE_HEAD.map((cell) => {
              const remoteTram = data?.elements?.[0];
              let value = get(remoteTram, cell.value);
              if (remoteTram) {
                if (!isNil(cell.type)) {
                  if (cell.type === 'Date') {
                    value = fDate(value);
                  }
                }

                if (!isNil(cell.format) && value !== null) {
                  value = cell.format.replace('#value', value);
                }
              }

              let Component = null;
              if (cell.id === 'trangThaiHoatDong') {
                Component = (
                  <Label
                    variant="soft"
                    color={value === 'HOAT_DONG' ? 'success' : 'error'}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {value === 'HOAT_DONG' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </Label>
                );
              } else if (cell.id === 'dmLoaiThietBiRanList' && isArray(value)) {
                Component = (
                  <Stack direction="row" flexWrap="wrap">
                    {sortBy(value, ['ten']).map((ran: IDmLoaiThietBiRan, i: number) => (
                      <Chip
                        size="small"
                        key={ran.id}
                        label={ran.ten}
                        sx={{ mr: i === value.length - 1 ? 0 : 1, mb: 1, color: 'text.secondary' }}
                      />
                    ))}
                  </Stack>
                );
              } else {
                Component = (
                  <Typography
                    variant="body2"
                    component="p"
                    gutterBottom
                    sx={{ textTransform: 'none' }}
                  >
                    {value || ''}
                  </Typography>
                );
              }
              return (
                <Grid item xs={4} key={cell.id}>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      component="p"
                      gutterBottom
                      sx={{ textTransform: 'none' }}
                    >
                      {cell.label}
                    </Typography>
                    {Component}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
