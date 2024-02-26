import { useEffect, useMemo, useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
// ----------------------------------------------------------------------

import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { isNull } from 'lodash';
import { useForm } from 'react-hook-form';
import { IHopDongImportInput } from 'src/@types/hopdong';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import FormProvider from 'src/components/hook-form/FormProvider';
import TimelineImport from 'src/components/timeline/TimelineImport';
import {
  tienTrinhAction,
  tienTrinhMessage,
  tienTrinhModule,
} from 'src/constants/tientrinh.constant';
import { useTienTrinhContext } from 'src/context/tien-trinh/TienTrinhContext';
import { useImportHopDongIbcMutation } from 'src/data/hopDongIbc';
import ImportResult from 'src/sections/components/hop-dong/import/ImportResult';
import ProgressImport from 'src/sections/components/hop-dong/import/ProgressImport';
import UploadFileImport from 'src/sections/components/hop-dong/import/UploadFileImport';
import { addBgProcess } from 'src/utils/bgProcessLocalStorage';
import { transformDataReadFileExcelHopDongIbc } from 'src/utils/hopDongUtils';
import { readExcelFileImportHopDong } from 'src/utils/readFileExcel';
import * as Yup from 'yup';
import TableCustomImport from './TableCustomImport';
// ----------------------------------------------------------------------

const steps = ['Chọn file', 'Kiểm tra dữ liệu', 'Import dữ liệu', 'Kết quả'];
type Props = {
  onClose: VoidFunction;
  onStepFinal: (value: number) => void;
};
type FormValuesProps = {
  radExcelMethod: string;
  afterSubmit?: string;
};
export default function LinearAlternativeImport({ onClose, onStepFinal }: Props) {
  const {
    state: { tienTrinh },
    dispatch,
  } = useTienTrinhContext();

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [file, setFile] = useState<File | null>(null);
  const [dataExcel, setDataExcel] = useState<any[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataValid, setDataValid] = useState<IHopDongImportInput[]>([]);

  const [isImportSuccess, setIsImportSuccess] = useState(false);
  const [isImportError, setIsImportError] = useState(false);

  const [totalAfterImport, setTotalAfterImport] = useState({
    tongSo: 0,
    hoanThanh: 0,
    soLuongLoi: 0,
  });

  const { mutate: importHopDong } = useImportHopDongIbcMutation();
  const isStepSkipped = (step: number) => skipped.has(step);
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    if (activeStep === 1) {
      handleOpenConfirm();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      onStepFinal(activeStep + 1);
    }
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const onChangeFile = (data: File | null) => {
    setFile(data);
  };
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  useMemo(async () => {
    if (file !== null) {
      const result = await readExcelFileImportHopDong(file);
      const transformedData = transformDataReadFileExcelHopDongIbc(result);
      setDataExcel(transformedData);
    }
  }, [file]);
  const radExeclImportSchema = Yup.object().shape({
    radExcelMethod: Yup.string().required('Vui lòng chọn phương thức lưu'),
  });
  const defaultValues = {
    radExcelMethod: 'create',
  };
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(radExeclImportSchema),
    defaultValues,
  });
  const { reset, setError, handleSubmit } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      // console.log(data);
    } catch (error) {
      console.error(error);
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };
  const handleGetDataValid = (data: IHopDongImportInput[]) => {
    setDataValid(data);
  };
  const handleImportHopDong = () => {
    if (dataValid.length > 0) {
      importHopDong(dataValid, {
        onSuccess(res) {
          const resIdImport = res.data;
          if (resIdImport)
            addBgProcess({
              id: resIdImport,
              module: tienTrinhModule.HOP_DONG,
              action: tienTrinhAction.HOP_DONG.IMPORT,
              messageSuccess: tienTrinhMessage.HOP_DONG.IMPORT.IBC.SUCCESS,
              messageError: tienTrinhMessage.HOP_DONG.IMPORT.IBC.ERROR,
              messageLoading: tienTrinhMessage.HOP_DONG.IMPORT.IBC.LOADING,
            });
        },
        onError(error, variables, context) {
          console.log(error);
        },
      });
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      onStepFinal(activeStep + 1);
    }
    handleCloseConfirm();
  };
  useEffect(() => {
    if (!isNull(tienTrinh.id)) {
      if (tienTrinh.status === 'success') {
        setIsImportSuccess(true);
      } else {
        setIsImportError(true);
      }
      // chuyển step đến kết quả tiến trình
      if (activeStep !== 0) {
        setActiveStep((prevActiveStep) => prevActiveStep + 2);
      }
      setTotalAfterImport(tienTrinh);
      dispatch({ type: 'reset-tien-trinh' });
    }
  }, [activeStep, dispatch, tienTrinh]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {!(activeStep === 0 || activeStep === 1 || activeStep === 2) ? (
        <Paper
          sx={{
            p: 3,
            my: 1,
            minHeight: 120,
          }}
        >
          {isImportSuccess && (
            <ImportResult
              title="Lưu dữ liệu thành công"
              onClose={onClose}
              isSuccess
              messageSuccess={`${totalAfterImport.tongSo - totalAfterImport.soLuongLoi}/${
                totalAfterImport.tongSo
              } dòng dữ liệu được lưu thành công`}
            />
          )}
          {isImportError && (
            <ImportResult
              isSuccess={false}
              title="Kết quả lưu dữ liệu"
              onClose={onClose}
              messageSuccess={`${totalAfterImport.tongSo - totalAfterImport.soLuongLoi}/${
                totalAfterImport.tongSo
              } dòng dữ liệu được lưu thành công`}
              messageError={`${totalAfterImport.soLuongLoi}/${totalAfterImport.tongSo} dòng dữ liệu lỗi`}
            />
          )}
        </Paper>
      ) : (
        <>
          {activeStep === 0 && (
            <Paper
              sx={{
                p: 3,
                minHeight: 120,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <UploadFileImport onChangeFile={onChangeFile} />
                  {/* <Box sx={{ p: 3 }}>
                    <Typography variant="h6">Phương thức lưu</Typography>
                    <Stack direction="column">
                      <RHFRadioGroup
                        name="radExcelMethod"
                        spacing={1}
                        sx={{ mt: 2 }}
                        options={[
                          { value: 'create', label: 'Thêm' },
                          { value: 'update', label: 'Cập nhật' },
                        ]}
                      />
                    </Stack>
                  </Box> */}
                </Grid>
                <Grid item xs={4}>
                  <TimelineImport />
                </Grid>
              </Grid>
            </Paper>
          )}
          {activeStep === 1 && (
            <Paper
              sx={{
                p: 5,
                minHeight: 120,
              }}
            >
              <TableCustomImport data={dataExcel} onDataValid={handleGetDataValid} />
            </Paper>
          )}
          {activeStep === 2 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 20,
              }}
            >
              <ProgressImport />
            </Box>
          )}
          {(activeStep === 0 || activeStep === 1) && (
            <Box sx={{ display: 'flex', marginBottom: '20px' }}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                color="inherit"
                variant="outlined"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Trở về
              </Button>
              <Button
                variant="contained"
                type="submit"
                onClick={handleNext}
                disabled={
                  file === null || (activeStep === 1 && dataExcel.length !== dataValid.length)
                }
              >
                {activeStep === steps.length - 1 ? 'Kết thúc' : 'Tiếp tục'}
              </Button>
            </Box>
          )}
        </>
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Cảnh báo"
        content={
          <>
            Bạn có chắc chắn muốn tiến hành import {dataValid.length} dòng dữ liệu hợp đồng{' '}
            <span style={{ color: 'blue', fontWeight: 'bold' }}>IBC</span> không. Đây là import hợp
            đồng <span style={{ color: 'blue', fontWeight: 'bold' }}>IBC</span>. Bạn hãy kiểm tra kỹ
            lại một lần nữa?
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            type="button"
            color="primary"
            loading={false}
            onClick={handleImportHopDong}
          >
            Tiến hành import
          </LoadingButton>
        }
      />
    </FormProvider>
  );
}
