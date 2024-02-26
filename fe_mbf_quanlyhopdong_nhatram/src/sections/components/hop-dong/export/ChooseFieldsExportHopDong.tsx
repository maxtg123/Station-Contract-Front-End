import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import { IHead } from 'src/@types/common';
import {
  IFilterAdvancedHopDong,
  ILoaiHopDong,
  ITrangThaiHopDong,
  ITrangThaiHopDongQuery,
} from 'src/@types/hopdong';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { TABLE_HEAD_IMPORT_HOP_DONG, sectionConfigs } from 'src/constants/hopdongmatbang.constant';
import { useExportHopDongMutation } from 'src/data/hopDongMatBang';
import { getTransFormDataExportHopDong } from 'src/utils/hopDongUtils';

// ----------------------------------------------------------------------

function not(a: IHead[], b: IHead[]) {
  return a.filter((headL) => b.indexOf(headL) === -1);
}

function intersection(a: IHead[], b: IHead[]) {
  return a.filter((headL) => b.indexOf(headL) !== -1);
}

function union(a: IHead[], b: IHead[]) {
  return [...a, ...not(b, a)];
}

type Props = {
  open: boolean;
  onClose: (value: boolean) => void;
  headLabel: IHead[];
  selectRows: string[];
  loaiHopDong: ILoaiHopDong;
  trangThaiHopDong: ITrangThaiHopDongQuery;
  filterName: string;
  filterAdvanced: IFilterAdvancedHopDong;
};

export default function ChooseFieldsExportHopDong({
  open,
  onClose,
  headLabel,
  selectRows,
  loaiHopDong,
  trangThaiHopDong,
  filterName,
  filterAdvanced,
}: Props) {
  let startArray = 0;
  const { mutate: exportChooseField, isLoading: exporting } = useExportHopDongMutation();
  const [checked, setChecked] = useState<IHead[]>([]);
  const sortDataHeadLabel = TABLE_HEAD_IMPORT_HOP_DONG.filter(
    (item) =>
      item.id !== 'chiTietLoi' &&
      item.id !== 'dongSo' &&
      item.id !== 'tinhTrang' &&
      item.id !== 'loaiTramVhkt' &&
      item.id !== 'loaiPhongMay' &&
      item.id !== 'loaiPhongMayPhatDien'
  ).sort((a, b) => {
    if (a.id === 'soHopDong') {
      return -1; // a sẽ được đặt trước b
    }
    if (b.id === 'soHopDong') {
      return 1; // b sẽ được đặt trước a
    }
    if (a.id === 'maTram') {
      return -1; // a sẽ được đặt trước b
    }
    if (b.id === 'maTram') {
      return 1; // b sẽ được đặt trước a
    }
    if (a.id === 'ghiChu' && b.id !== 'toTrinh') {
      return -1; // ghiChu sẽ được đặt trước các trường khác
    }
    if (a.id === 'toTrinh' && b.id !== 'ghiChu') {
      return 1; // các trường khác sẽ được đặt trước toTrinh
    }
    return 0;
  });
  const [left] = useState<IHead[]>(sortDataHeadLabel);
  useEffect(() => {
    setChecked(left);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    onClose(false);
  };

  const numberOfChecked = (items: IHead[]) => intersection(checked, items).length;

  const handleToggleAll = (items: IHead[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };
  const handleExportExcel = () => {
    const transFormData = getTransFormDataExportHopDong(checked);
    const transformUnCheckedData = getTransFormDataExportHopDong(not(left, checked));
    const newData = {
      ...filterAdvanced,
      search: filterName,
      loaiHopDong,
      trangThaiHopDong,
      listId: selectRows,
      listKey: transFormData,
      excludeKey: transformUnCheckedData,
    };
    exportChooseField(newData, {
      onSuccess: (res, variables, context) => {
        const contentDisposition = res.headers['content-disposition'];
        let fileName = 'Trạm.xlsx';
        if (contentDisposition) {
          const matches = contentDisposition.match(/filename=([^;]+)/);
          fileName = matches && matches.length > 1 ? matches[1] : 'file';
        }
        saveAs(res.data, fileName);
        handleClose();
      },
    });
  };

  const renderColumnList = (items: IHead[], start: number, end: number) =>
    items.slice(start, end).map((item: IHead) => {
      const labelId = `transfer-list-all-item-${item.id}-label`;
      return (
        <ListItemButton
          key={item.id}
          role="listitem"
          onClick={() => {
            if (item.id !== 'soHopDong' && item.id !== 'maTram') {
              const currentIndex = checked.indexOf(item);
              const newChecked = [...checked];
              if (currentIndex === -1) {
                newChecked.push(item);
              } else {
                newChecked.splice(currentIndex, 1);
              }
              setChecked(newChecked);
            }
          }}
        >
          <ListItemIcon>
            <Checkbox
              disabled={item.id === 'soHopDong' || item.id === 'maTram'}
              disableRipple
              checked={
                item.id === 'maTram' || item.id === 'soHopDong' || checked.indexOf(item) !== -1
              }
              tabIndex={-1}
              inputProps={{ 'aria-labelledby': labelId }}
            />
          </ListItemIcon>
          <ListItemText id={labelId} primary={item.label} />
        </ListItemButton>
      );
    });
  const customList = (title: React.ReactNode, items: IHead[]) => (
    <Card sx={{ borderRadius: 1.5 }}>
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(
              items.filter((i) => i.id !== 'soHopDong' && i.id !== 'maTram')
            )}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} được chọn`}
        sx={{ p: 2 }}
      />

      <Divider />
      <List
        dense
        component="div"
        role="list"
        sx={{ minHeight: '30vh', maxWidth: '100%', overflow: 'auto', pb: 0 }}
      >
        {sectionConfigs.map((section, index) => {
          const end = startArray + section.colSpan; // Tính toán giá trị của end dựa trên start và colSpan
          const columnList = renderColumnList(left, startArray, end); // Gọi hàm renderColumnList với start và end
          // Cập nhật giá trị của start cho vòng lặp tiếp theo
          startArray = end;
          return (
            <Box key={index}>
              <Stack direction="row" px={2} my={2}>
                <Typography variant="h6" flexBasis="30%">
                  {section.title}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    bgcolor: '#f4f6f8',
                    borderRadius: '8px',
                  }}
                  flex={1}
                >
                  {columnList}
                </Box>
              </Stack>
              <Divider sx={{ borderStyle: 'dashed' }} />
            </Box>
          );
        })}
      </List>
    </Card>
  );
  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="lg">
      <Scrollbar sx={{ maxHeight: '85vh' }}>
        <DialogContent sx={{ overflow: 'unset' }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            flexWrap="nowrap"
            sx={{ py: 3 }}
          >
            <Grid item xs={12}>
              {customList('Chọn', left)}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit" variant="outlined">
            Hủy
          </Button>
          <LoadingButton
            color="primary"
            variant="contained"
            onClick={handleExportExcel}
            loading={exporting}
          >
            Xuất dữ liệu
          </LoadingButton>
        </DialogActions>
      </Scrollbar>
    </Dialog>
  );
}
