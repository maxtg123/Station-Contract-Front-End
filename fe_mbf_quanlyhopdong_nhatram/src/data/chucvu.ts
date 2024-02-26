import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IChucVuRow } from 'src/@types/chucvu';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { chucvuClient } from './client/chucvu';

export const useChucvusQuery = (options: any = {}) => {
  const queryInfo = useQuery<ResponseInfo<IChucVuRow>, Error>(
    [API_ENDPOINTS.CHUC_VU],
    () => chucvuClient.all({}),
    {
      ...options,
    }
  );
  return {
    ...queryInfo,
    data: queryInfo.data?.elements?.map((dt) => ({
      ...dt,
      usedStatus: dt.nguoiDungKhuVucList.length > 0,
    })),
  };
};

export const useCreateChucVuMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(chucvuClient.create, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CHUC_VU);
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

export const useUpdateChucVuMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(chucvuClient.update, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CHUC_VU);
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

export const useDeleteChucVuMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(chucvuClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CHUC_VU);
    },
    onError(e: any) {
      enqueueSnackbar('Bạn không có quyền thực hiện chức năng này.', {
        variant: 'error',
      });
    },
  });
};
