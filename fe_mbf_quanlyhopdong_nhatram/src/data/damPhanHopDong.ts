import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DamPhanListOptionQuery, HopDongDamPhanPaginator } from 'src/@types/damphan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { damPhanHopDongClient } from './client/damPhanHopDong';

export const useGiaoViecDamPhanHopDongMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(damPhanHopDongClient.giaoViecDamPhan, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
    onError: (e: any) => {
      if (e?.response?.status === 403) {
        enqueueSnackbar('Bạn không có quyền thực hiện chức năng này.', {
          variant: 'error',
        });
      }
    },
  });
};

export const useDamPhansOfHopDongQuery = (
  options: DamPhanListOptionQuery,
  useQueryOptions?: any
) => {
  return useQuery<HopDongDamPhanPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG, options, 'list-dam-phan'],
    () => damPhanHopDongClient.listDamPhanAndDetail(options),
    { ...useQueryOptions }
  );
};

export const useGuiNoiDungDamPhanMutation = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(damPhanHopDongClient.guiNoiDungDamPhanFormData, {
    onError: (e: any) => {
      if (e?.response?.status === 403) {
        enqueueSnackbar('Bạn không có quyền thực hiện chức năng này.', {
          variant: 'error',
        });
      }
    },
  });
};

export const useXetDuyetDamPhanMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  return useMutation(damPhanHopDongClient.xetDuyet, {
    onError: (e: any) => {
      if (e?.response?.status === 403) {
        enqueueSnackbar('Bạn không có quyền thực hiện chức năng này.', {
          variant: 'error',
        });
      }
    },
  });
};
