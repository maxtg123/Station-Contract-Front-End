import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmHinhThucThanhToan } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmHinhThucThanhToanClient } from './client/dmHinhThucThanhToan';

export const useDmHinhThucThanhToansQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmHinhThucThanhToan>, Error>(
    [API_ENDPOINTS.DANH_MUC.HINH_THUC_THANH_TOAN],
    () => dmHinhThucThanhToanClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmHinhThucThanhToanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucThanhToanClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_THANH_TOAN);
    },
  });
};

export const useUpdateDmHinhThucThanhToanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucThanhToanClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_THANH_TOAN);
    },
  });
};

export const useDeleteDmHinhThucThanhToanMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmHinhThucThanhToanClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HINH_THUC_THANH_TOAN);
    },
  });
};
