// @mui
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Paper,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
// hooks
import useResponsive from '../../hooks/useResponsive';
//
import { DateRangePickerProps } from './types';

// ----------------------------------------------------------------------

export default function DateRangePicker({
  title = 'Chọn ngày',
  variant = 'input',
  //
  startDate,
  endDate,
  //
  onChangeStartDate,
  onChangeEndDate,
  //
  open,
  onClose,
  //
  isError,
}: DateRangePickerProps) {
  const isDesktop = useResponsive('up', 'md');

  const isCalendarView = variant === 'calendar';

  const onCancelDate = () => {
    onClose();
    onChangeStartDate(null);
    onChangeEndDate(null);
  }

  return (
    <Dialog
      fullWidth
      maxWidth={isCalendarView ? false : 'xs'}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          ...(isCalendarView && {
            maxWidth: 720,
          }),
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      <DialogContent
        sx={{
          ...(isCalendarView &&
            isDesktop && {
              overflow: 'unset',
            }),
        }}
      >
        <Stack
          spacing={isCalendarView ? 3 : 2}
          direction={isCalendarView && isDesktop ? 'row' : 'column'}
          justifyContent="center"
          sx={{
            pt: 1,
            '& .MuiCalendarPicker-root': {
              ...(!isDesktop && {
                width: 'auto',
              }),
            },
          }}
        >
          {isCalendarView ? (
            <>
              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DatePicker label="Từ ngày" value={startDate} onChange={onChangeStartDate} />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ borderRadius: 2, borderColor: 'divider', borderStyle: 'dashed' }}
              >
                <DatePicker label="Đến ngày" value={endDate} onChange={onChangeEndDate} />
              </Paper>
            </>
          ) : (
            <>
              <DatePicker label="Từ ngày" value={startDate} onChange={onChangeStartDate} />

              <DatePicker label="Đến ngày" value={endDate} onChange={onChangeEndDate} />
            </>
          )}
        </Stack>

        {isError && (
          <FormHelperText error sx={{ px: 8 }}>
            Ngày kết thúc phải lớn hơn ngày bắt đầu
          </FormHelperText>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onCancelDate}>
          Hủy
        </Button>

        <Button disabled={isError} variant="contained" onClick={onClose}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
