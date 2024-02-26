import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmHinhThucKyHD } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmHinhThucKyHDClient } from './client/dmHinhThucKyHD';

export const useDmHinhThucKyHDQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmHinhThucKyHD>, Error>(
    [API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HD],
    () => dmHinhThucKyHDClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmHinhThucKyHDMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHDClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HD);
    },
  });
};

export const useUpdateDmHinhThucKyHDMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHDClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HD);
    },
  });
};

export const useDeleteDmHinhThucKyHDMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucKyHDClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_KY_HD);
    },
  });
};
