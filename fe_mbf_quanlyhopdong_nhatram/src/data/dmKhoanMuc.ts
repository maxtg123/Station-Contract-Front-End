import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmKhoanMuc } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmKhoanMucClient } from './client/dmKhoanMuc';

export const useDmKhoanMucQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmKhoanMuc>, Error>(
    [API_ENDPOINTS.DANH_MUC.KHOAN_MUC],
    () => dmKhoanMucClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmKhoanMucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmKhoanMucClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.KHOAN_MUC);
    },
  });
};

export const useUpdateDmKhoanMucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmKhoanMucClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.KHOAN_MUC);
    },
  });
};

export const useDeleteDmKhoanMucMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmKhoanMucClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.KHOAN_MUC);
    },
  });
};
