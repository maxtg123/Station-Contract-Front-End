import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IDmLoaiHDPhuTro } from 'src/@types/category';
import { ResponseInfo } from 'src/@types/common';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { dmLoaiHDPhuTroClient } from './client/dmLoaiHDPhuTro';

export const useDmLoaiHDPhuTrosQuery = (options: any = {}) =>
  useQuery<ResponseInfo<IDmLoaiHDPhuTro>, Error>(
    [API_ENDPOINTS.DANH_MUC.HOP_DONG_PHU_TRO],
    () => dmLoaiHDPhuTroClient.all({}),
    {
      keepPreviousData: true,
      ...options,
    }
  );

export const useCreateDmLoaiHDPhuTroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHDPhuTroClient.create, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HOP_DONG_PHU_TRO);
    },
  });
};

export const useUpdateDmLoaiHDPhuTroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHDPhuTroClient.update, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HOP_DONG_PHU_TRO);
    },
  });
};

export const useDeleteDmLoaiHDPhuTroMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(dmLoaiHDPhuTroClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.DANH_MUC.HOP_DONG_PHU_TRO);
    },
  });
};
