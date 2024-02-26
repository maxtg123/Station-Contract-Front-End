import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiPhongMayPhatDien } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmdmLoaiPhongMayPhatDienClient } from './client/dmLoaiPhongMayPhatDien';

export const useDmLoaiPhongMayPhatDiensQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiPhongMayPhatDien>, Error>(
    [API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY_PHAT_DIEN],
    () => dmdmLoaiPhongMayPhatDienClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateLoaiPhongMayPhatDienMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmdmLoaiPhongMayPhatDienClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY_PHAT_DIEN);
    },
  });
};

export const useUpdateLoaiPhongMayPhatDienMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmdmLoaiPhongMayPhatDienClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY_PHAT_DIEN);
    },
  });
};

export const useDeleteLoaiPhongMayPhatDienMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmdmLoaiPhongMayPhatDienClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.LOAI_PHONG_MAY_PHAT_DIEN);
    },
  });
};
