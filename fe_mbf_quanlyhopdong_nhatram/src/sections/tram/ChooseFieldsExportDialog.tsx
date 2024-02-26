import { LoadingButton } from '@mui/lab';
import {
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
} from '@mui/material';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import { IHead } from 'src/@types/common';
import Iconify from 'src/components/iconify/Iconify';
import Scrollbar from 'src/components/scrollbar/Scrollbar';
import { useExportTramMutation } from 'src/data/tram';
import { getTransFormDataExportTram } from 'src/utils/tramUtils';

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
};

export default function ChooseFieldsExportDialog({ open, onClose, headLabel, selectRows }: Props) {
  const { mutate: exportChooseField, isLoading: exporting } = useExportTramMutation();
  const [checked, setChecked] = useState<IHead[]>([]);
  const [left, setLeft] = useState<IHead[]>(
    headLabel.filter((col) => col.id !== 'maTram' && col.id !== 'maDauTuXayDung')
  );
  const [right, setRight] = useState<IHead[]>(
    headLabel.filter((col) => col.id === 'maTram' || col.id === 'maDauTuXayDung')
  );

  const leftChecked = intersection(checked, left);

  const rightChecked = intersection(checked, right);

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

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(intersection(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };
  const handleExportExcel = () => {
    const transFormData = getTransFormDataExportTram(right);
    const newData = {
      ...transFormData,
      listId: selectRows,
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

  const customList = (title: React.ReactNode, items: IHead[]) => (
    <Card sx={{ borderRadius: 1.5 }}>
      <CardHeader
        avatar={
          <Checkbox
            onClick={handleToggleAll(
              items.filter((i) => i.id !== 'maTram' && i.id !== 'maDauTuXayDung')
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
        sx={{ minHeight: '30vh', maxWidth: 650, overflow: 'auto' }}
      >
        <Grid container spacing={1}>
          <Grid item xs={4}>
            {items.slice(0, Math.ceil(items.length / 3)).map((item: IHead) => {
              const labelId = `transfer-list-all-item-${item.id}-label`;
              return (
                <ListItemButton
                  key={item.id}
                  role="listitem"
                  onClick={() => {
                    if (item.id !== 'maTram' && item.id !== 'maDauTuXayDung') {
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
                      disabled={item.id === 'maTram' || item.id === 'maDauTuXayDung'}
                      disableRipple
                      checked={
                        item.id === 'maDauTuXayDung' ||
                        item.id === 'maTram' ||
                        checked.indexOf(item) !== -1
                      }
                      tabIndex={-1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={item.label} />
                </ListItemButton>
              );
            })}
          </Grid>
          <Grid item xs={4}>
            {items
              .slice(Math.ceil(items.length / 3), Math.ceil((2 * items.length) / 3))
              .map((item: IHead) => {
                const labelId = `transfer-list-all-item-${item.id}-label`;
                return (
                  <ListItemButton
                    key={item.id}
                    role="listitem"
                    onClick={() => {
                      if (item.id !== 'maTram' && item.id !== 'maDauTuXayDung') {
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
                        disabled={item.id === 'maTram' || item.id === 'maDauTuXayDung'}
                        disableRipple
                        checked={
                          item.id === 'maDauTuXayDung' ||
                          item.id === 'maTram' ||
                          checked.indexOf(item) !== -1
                        }
                        tabIndex={-1}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={item.label} />
                  </ListItemButton>
                );
              })}
          </Grid>
          <Grid item xs={4}>
            {items.slice(Math.ceil((2 * items.length) / 3)).map((item: IHead) => {
              const labelId = `transfer-list-all-item-${item.id}-label`;
              return (
                <ListItemButton
                  key={item.id}
                  role="listitem"
                  onClick={() => {
                    if (item.id !== 'maTram' && item.id !== 'maDauTuXayDung') {
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
                      disabled={item.id === 'maTram' || item.id === 'maDauTuXayDung'}
                      disableRipple
                      checked={
                        item.id === 'maDauTuXayDung' ||
                        item.id === 'maTram' ||
                        checked.indexOf(item) !== -1
                      }
                      tabIndex={-1}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={item.label} />
                </ListItemButton>
              );
            })}
          </Grid>
        </Grid>
      </List>
    </Card>
  );
  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="xl">
      <DialogContent sx={{ overflow: 'unset' }}>
        <Scrollbar sx={{ maxHeight: '85vh' }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            flexWrap="nowrap"
            sx={{ py: 3 }}
          >
            <Grid item xs={5.5}>
              {customList('Chọn', left)}
            </Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center" sx={{ p: 3 }}>
                <Button
                  color="inherit"
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedRight}
                  disabled={leftChecked.length === 0}
                  aria-label="move selected right"
                  sx={{ my: 1 }}
                >
                  <Iconify icon="eva:arrow-ios-forward-fill" width={18} />
                </Button>

                <Button
                  color="inherit"
                  variant="outlined"
                  size="small"
                  onClick={handleCheckedLeft}
                  disabled={rightChecked.length === 0}
                  aria-label="move selected left"
                  sx={{ my: 1 }}
                >
                  <Iconify icon="eva:arrow-ios-back-fill" width={18} />
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={5.5}>
              {customList('Chọn', right)}
            </Grid>
          </Grid>
        </Scrollbar>
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
    </Dialog>
  );
}
