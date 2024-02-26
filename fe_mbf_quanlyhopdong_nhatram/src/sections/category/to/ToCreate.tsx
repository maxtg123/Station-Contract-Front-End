import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
} from '@mui/material';
import equal from 'fast-deep-equal';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { OptionTypeTram } from 'src/@types/common';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/FormProvider';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useCreateDmToMutation, useUpdateDmToMutation } from 'src/data/dmTo';
import { getAuthCredentials } from 'src/utils/authUtils';
import * as Yup from 'yup';

type FormValuesProps = {
  id?: string;
  ten: string;
  tenVietTat: string;
  maDataSite: string;
  phongDai: OptionTypeTram | null;
  ghiChu: string;
  afterSubmit?: string;
};

interface Props extends Omit<DialogProps, 'title'> {
  title: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
  initData?: FormValuesProps | null;
  onCreate?: VoidFunction;
}

export default function ToCreate({ title, open, onClose, initData, onCreate, ...other }: Props) {
  const [pdOptions, setPdOptions] = useState<OptionTypeTram[]>([]);
  const { data: listData } = useDmPhongDaisQuery({ refetchOnWindowFocus: false });

  const toSchema = Yup.object().shape({
    ten: Yup.string().required('Tên là trường bắt buộc'),
    maDataSite: Yup.string(),
    tenVietTat: Yup.string().required('Tên viết tắt là trường bắt buộc'),
    phongDai: Yup.object().required('Tên phòng đài là trường bắt buộc').nullable(),
  });
  const defaultValues = {
    ten: '',
    maDataSite: '',
    tenVietTat: '',
    phongDai: null,
    ghiChu: '',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(toSchema),
    defaultValues: initData || defaultValues,
  });
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: createTo, isLoading: creating } = useCreateDmToMutation();
  const { mutate: updateTo, isLoading: updating } = useUpdateDmToMutation();
  const { reset, handleSubmit } = methods;

  // set pd option
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: OptionTypeTram[] = [];
    if (listData) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = listData.elements.map((pd) => ({
          id: pd.id.toString(),
          ten: pd.ten,
        }));
      } else {
        newPdOptions = listData.elements
          .filter((pd) =>
            profile?.nguoiDungKhuVucList
              ? profile?.nguoiDungKhuVucList.filter((kv) => kv?.dmPhongDai?.id === pd.id)?.length >
                0
              : false
          )
          .map((pd) => ({ id: pd.id.toString(), ten: pd.ten }));
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [listData, pdOptions]);

  const onSubmit = async (data: FormValuesProps) => {
    if (initData && initData.id) {
      updateTo(
        { id: initData.id.toString(), ...data },
        {
          onSuccess: () => {
            enqueueSnackbar(`Cập nhật Tổ "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình cập nhật Tổ`, {
              variant: 'error',
            });
          },
        }
      );
    } else {
      createTo(
        {
          ...data,
        },
        {
          onSuccess: () => {
            enqueueSnackbar(`Thêm mới Tổ "${data.ten}" thành công`, {
              variant: 'success',
            });
            reset();
            onClose();
          },
          onError: () => {
            enqueueSnackbar(`Có lỗi trong quá trình thêm mới Tổ`, {
              variant: 'error',
            });
          },
        }
      );
    }
  };
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>
        <DialogContent sx={{ typography: 'body2' }}>
          <Stack spacing={3} mt={2}>
            <RHFTextField name="ten" label="Tên (*)" />
            <RHFTextField name="tenVietTat" label="Tên viết tắt(*)" />
            <RHFTextField name="maDataSite" label="Mã DataSite" />
            <RHFAutocomplete
              fullWidth
              name="phongDai"
              label="Phòng đài"
              options={pdOptions}
              getOptionLabel={(option: OptionTypeTram | string) => (option as OptionTypeTram).ten}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
            <RHFTextField name="ghiChu" label="Ghi chú" multiline minRows={3} maxRows={10} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Hủy
          </Button>
          <LoadingButton
            variant="contained"
            type="submit"
            color="primary"
            loading={creating || updating}
          >
            Lưu
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
