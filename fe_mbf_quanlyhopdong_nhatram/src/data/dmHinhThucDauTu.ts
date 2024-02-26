import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmHinhThucDauTu } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmHinhThucDauTuClient } from './client/dmHinhThucDauTu';

export const useDmHinhThucDauTusQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmHinhThucDauTu>, Error>(
    [API_ENDPOINTS.DANH_MUC.HINH_THUC_DAU_TU],
    () => dmHinhThucDauTuClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmHinhThucDauTuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucDauTuClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_DAU_TU);
    },
  });
};

export const useUpdateDmHinhThucDauTuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucDauTuClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_DAU_TU);
    },
  });
};

export const useDeleteDmHinhThucDauTuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucDauTuClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_DAU_TU);
    },
  });
};
