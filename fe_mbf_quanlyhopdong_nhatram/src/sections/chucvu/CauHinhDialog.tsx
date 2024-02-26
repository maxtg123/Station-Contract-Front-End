import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Checkbox, FormControlLabel, FormHelperText, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import equal from 'fast-deep-equal';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { IAction, IChucVuPhanQuyenForm, IChucVuPhanQuyenInput, IModule } from 'src/@types/chucvu';
import { OptionType } from 'src/@types/common';
import { PHAN_QUYEN, listKeyChecked } from 'src/_mock/assets/chucvu';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useCreateChucVuMutation, useUpdateChucVuMutation } from 'src/data/chucvu';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { getAuthCredentials } from 'src/utils/authUtils';
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  ten: Yup.string().required('Tên là trường bắt buộc'),
  phongDai: Yup.object()
    .shape({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
    .typeError('Phòng/Đài là trường bắt buộc'),
  ghichu: Yup.string(),
  chucVuPhanQuyenList: Yup.array()
    .of(
      Yup.object().shape({
        module: Yup.string().required(),
        action: Yup.string().required(),
      })
    )
    .min(1),
});

const _defaultValues: IChucVuPhanQuyenForm = {
  ten: '',
  phongDai: null,
  ghichu: '',
  chucVuPhanQuyenList: [],
};

export interface SimpleDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  initData: IChucVuPhanQuyenForm | null;
}

export default function CauHinhDialog({ open, onClose, initData }: SimpleDialogProps) {
  const [pdOptions, setPdOptions] = useState<OptionType[]>([]);

  const methods = useForm<IChucVuPhanQuyenForm>({
    resolver: yupResolver(Schema),
    defaultValues: initData || _defaultValues,
  });
  const { formState, handleSubmit, setValue, control, reset } = methods;
  const { errors } = formState;
  const { replace } = useFieldArray({
    control,
    name: 'chucVuPhanQuyenList',
  });

  const { enqueueSnackbar } = useSnackbar();

  const { data: phongDai } = useDmPhongDaisQuery({ refetchOnWindowFocus: false });
  const { mutate: createChucVu, isLoading: creating } = useCreateChucVuMutation();
  const { mutate: updateChucVu, isLoading: updating } = useUpdateChucVuMutation();

  const handleClose = () => {
    onClose(false);
  };
  // set pd options
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: OptionType[] = [];
    if (phongDai) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = phongDai.elements.map((pd) => ({ value: pd.id.toString(), label: pd.ten }));
      } else {
        newPdOptions = phongDai.elements
          .filter((pd) =>
            profile?.nguoiDungKhuVucList
              ? profile?.nguoiDungKhuVucList.filter((kv) => kv?.dmPhongDai?.id === pd.id)?.length >
                0
              : false
          )
          .map((pd) => ({ value: pd.id.toString(), label: pd.ten }));
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [phongDai, pdOptions]);

  // checkbox
  const [checked, setChecked] = useState([] as string[]); // format: MODULE:ACTION
  // set init permissions in case update
  useEffect(() => {
    if (initData && initData.chucVuPhanQuyenList.length > 0) {
      const newChecked = initData.chucVuPhanQuyenList.map((p) => `${p.module}:${p.action}`);
      setChecked(newChecked);
    }
  }, [initData]);

  // set permission to form
  useEffect(() => {
    const newDt = checked.map((c) => {
      const [module, action] = c.split(':');
      return { module, action };
    }) as { module: IModule; action: IAction }[];
    replace(newDt);
  }, [checked, replace]);

  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setChecked(listKeyChecked);
    } else {
      setChecked([]);
    }
  };

  const handleChecked = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const onSubmit = async (data: IChucVuPhanQuyenForm) => {
    const input: IChucVuPhanQuyenInput = {
      ten: data.ten,
      phongDaiId: data.phongDai ? parseInt(data.phongDai.value, 10) : 0,
      ghichu: data?.ghichu || '',
      chucVuPhanQuyenList: data.chucVuPhanQuyenList,
    };
    if (initData && initData.id) {
      updateChucVu(
        { id: initData.id.toString(), ...input },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật chức vụ "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            handleClose();
          },
          onError: (error: any) => {
            const errorMsg = 'Có lỗi trong quá trình cập nhật chúc vụ';
            enqueueSnackbar(errorMsg, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createChucVu(input, {
        onSuccess: () => {
          enqueueSnackbar(`Thêm mới chức vụ "${input.ten}" thành công`, {
            variant: 'success',
          });
          reset();
          handleClose();
        },
        onError: (error: any) => {
          let errorMsg = 'Có lỗi trong quá trình thêm mới chức vụ';
          if (error?.response?.status === 409) {
            errorMsg = `Chức vụ "${data.ten}" tại phòng/đài "${data.phongDai?.label}" đã tồn tại. Không thể tạo mới thêm`;
          }
          enqueueSnackbar(errorMsg, {
            variant: 'error',
          });
        },
      });
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="md">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{!initData ? 'Tạo mới chức vụ' : 'Chỉnh sửa chức vụ'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={2}>
            <RHFTextField name="ten" label="Tên (*)" />
            <div>
              <RHFAutocomplete
                name="phongDai"
                label="Phòng/Đài (*)"
                options={pdOptions}
                getOptionLabel={(option: OptionType | string) => (option as OptionType).label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                onChange={(event: any, newValue) => {
                  setValue('phongDai', newValue as OptionType);
                }}
              />
            </div>
            <RHFTextField name="ghichu" label="Ghi chú" multiline minRows={3} maxRows={10} />
          </Stack>

          <h4 style={{ marginBottom: 10 }}>Phân quyền cho chức vụ này</h4>
          <div>
            <Stack
              spacing={2}
              alignItems="center"
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              sx={{ py: 1 }}
            >
              <span style={{ color: '#919EAB', fontWeight: 700, width: 150, fontSize: 13 }}>
                {'Full quyền'.toUpperCase()}
              </span>
              <FormControlLabel
                label="Chọn tất cả"
                control={
                  <Checkbox
                    checked={!!(checked.length > 0 && checked.length === listKeyChecked.length)}
                    indeterminate={checked.length > 0 && checked.length < listKeyChecked.length}
                    onChange={handleCheckAll}
                  />
                }
              />
            </Stack>
            {PHAN_QUYEN.map((item, i) => (
              <Stack
                spacing={2}
                alignItems="center"
                key={i}
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                sx={{ py: 1 }}
              >
                <span style={{ color: '#919EAB', fontWeight: 700, width: 150, fontSize: 13 }}>
                  {item.label.toUpperCase()}
                </span>
                {item.child.map((itemChild, j) => (
                  <FormControlLabel
                    label={itemChild.label}
                    key={j}
                    control={
                      <Checkbox
                        checked={checked.indexOf(`${item.key}:${itemChild.key}`) !== -1}
                        onChange={handleChecked(`${item.key}:${itemChild.key}`)}
                      />
                    }
                  />
                ))}
              </Stack>
            ))}
            {errors?.chucVuPhanQuyenList && (
              <FormHelperText error>Vui lòng chọn nhiều hơn một quyền cho chức vụ</FormHelperText>
            )}
          </div>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Huỷ
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            loading={creating || updating}
          >
            {initData ? 'Cập nhật' : 'Tạo'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
