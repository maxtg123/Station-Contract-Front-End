import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { IChange, IDamPhamForm, IDamPhanNoiDungCreateInput } from 'src/@types/damphan';
import FormProvider from 'src/components/hook-form/FormProvider';
import { CustomFile, MultiFilePreview } from 'src/components/upload';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { useGuiNoiDungDamPhanMutation } from 'src/data/damPhanHopDong';
import * as Yup from 'yup';
import DamPhanInput from './DamPhanInput';
import NoiDungDamPhan from './NoiDungDamPhan';
import NoiDungDamPhanForm from './NoiDungDamPhanForm';

const defaultValues: IDamPhamForm = {
  ghiChu: '',
  filesDinhKem: [],
  changesHopDong: [],
  hopDongTrams: [],
};

const DamPhanSchema = Yup.object().shape({
  ghiChu: Yup.string(),
  changesHopDong: Yup.array().of(
    Yup.object().shape({
      key: Yup.string().required('Tên là trường bắt buộc').typeError('Tên là trường bắt buộc'),
      value: Yup.string()
        .required('Nội dung là trường bắt buộc')
        .typeError('Nội dung là trường bắt buộc'),
    })
  ),
  hopDongTrams: Yup.array().of(
    Yup.object().shape({
      tramId: Yup.number().required(),
      changesTram: Yup.array().of(
        Yup.object().shape({
          key: Yup.string().required('Tên là trường bắt buộc').typeError('Tên là trường bắt buộc'),
          value: Yup.string()
            .required('Nội dung là trường bắt buộc')
            .typeError('Nội dung là trường bắt buộc'),
        })
      ),
    })
  ),
  filesDinhKem: Yup.array().of(Yup.mixed()),
});

/**
 * TODO: Gửi nội dung đàm phán
 * @param {
 * ghiChu: '',
 * filesDinhKem: selectedFiles,
 * changesHopDong: [],
 * hopDongTrams: [],
 * }:
 * //
 */

const DamPhan = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const {
    state: { rightBar, hopDong },
    dispatch,
  } = useChiTietHopDongContext();

  const queryClient = useQueryClient();
  const { mutate: guiNoiDung } = useGuiNoiDungDamPhanMutation();

  const { enqueueSnackbar } = useSnackbar();

  const methods = useForm<IDamPhamForm>({
    resolver: yupResolver(DamPhanSchema),
    defaultValues: {
      ...defaultValues,
      hopDongTrams:
        hopDong?.hopDongTramList.map((hdTram) => ({ tramId: hdTram.tramId, changesTram: [] })) ||
        [],
    },
    mode: 'all',
  });
  const { handleSubmit } = methods;

  const onSubmit = async (data: IDamPhamForm) => {
    if (!hopDong || !rightBar?.id) return;

    const changes: IChange[] = [];
    data.changesHopDong.forEach((changeHd) => {
      changes.push({
        key: changeHd.key,
        value: changeHd.value,
        tramId: null,
        ghiChu: changeHd.ghiChu,
      });
    });
    data.hopDongTrams.forEach((hdTram) => {
      hdTram.changesTram.forEach((change) => {
        changes.push({
          key: change.key,
          value: change.value,
          tramId: hdTram.tramId,
          ghiChu: change.ghiChu,
        });
      });
    });

    const input: IDamPhanNoiDungCreateInput = {
      hopDongId: hopDong?.id,
      hopDongDamPhanId: rightBar?.id,
      files: selectedFiles,
      ghiChu: data.ghiChu,
      noiDung: changes,
    };

    guiNoiDung(input, {
      onSuccess: () => {
        enqueueSnackbar(`Gửi nội dung đàm phán thành công`, {
          variant: 'success',
        });
        queryClient.invalidateQueries([
          API_ENDPOINTS.HOP_DONG,
          { hopDongId: hopDong.id },
          'list-dam-phan',
        ]);
        dispatch({ type: 'reset-data-right-bar' });
      },
      onError: (error: any) => {
        const msg = 'Có lỗi trong quá trình gửi nội dung đàm phán';
        enqueueSnackbar(msg, {
          variant: 'error',
        });
      },
    });
  };

  const handleRemoveFile = (fileToRemove: CustomFile | string) => {
    const filterFile = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(filterFile);
  };

  return (
    <Box sx={{ pt: 2, height: '100%' }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
          <Stack spacing={3}>
            <Typography sx={{ px: 2 }} variant="h6">
              Nội dung đàm phán
            </Typography>
            <Box sx={{ background: '#F9FAFB', pt: 2 }}>
              {rightBar?.data ? <NoiDungDamPhan /> : <NoiDungDamPhanForm />}
            </Box>
          </Stack>
          {selectedFiles.length > 0 && (
            <Box sx={{ mx: 2, mt: 2 }}>
              <MultiFilePreview
                files={selectedFiles}
                thumbnail={false}
                onRemove={handleRemoveFile}
              />
            </Box>
          )}
          <DamPhanInput
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            onSubmit={onSubmit}
          />
        </Stack>
      </FormProvider>
    </Box>
  );
};

export default DamPhan;
