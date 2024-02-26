import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { INguoiDung } from 'src/@types/nguoidung';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { nguoiDungClient } from './client/nguoidung';

export const useNguoiDungsQuery = (options: any = {}) =>
  useQuery<ResponseInfo<INguoiDung>, Error>(
    [API_ENDPOINTS.NGUOI_DUNG],
    () => nguoiDungClient.all({}),
    {
      ...options,
    }
  );

export const useCreateNguoiDungMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(nguoiDungClient.create, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NGUOI_DUNG);
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

export const useUpdateNguoiDungMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  return useMutation(nguoiDungClient.update, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NGUOI_DUNG);
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

export const useDeleteNguoiDungMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(nguoiDungClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NGUOI_DUNG);
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
