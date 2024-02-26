import { useSnackbar } from 'notistack';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { HopDongPheDuyetPaginator, PheDuyetListOfHopDongOptions } from 'src/@types/hopdong';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { pheduyetHopDongClient } from './client/pheduyetHopDong';

export const usePheDuyetsOfHopDongQuery = (
  options: PheDuyetListOfHopDongOptions,
  useQueryOptions?: any
) => {
  return useQuery<HopDongPheDuyetPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG, options, 'list-phe-duyet'],
    () => pheduyetHopDongClient.listPheDuyetOfHopDong(options),
    { ...useQueryOptions }
  );
};

export const useCreateHopDongPheDuyetMutation = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(pheduyetHopDongClient.guiHopDongDiPheDuyet, {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
      queryClient.invalidateQueries(API_ENDPOINTS.PHE_DUYET_HOP_DONG.PHE_DUYET);
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

export const useXetDuyetHopDongMutation = () => {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation(pheduyetHopDongClient.xetDuyetHopDong, {
    onError: (e: any) => {
      if (e?.response?.status === 403) {
        enqueueSnackbar('Bạn không có quyền thực hiện chức năng này.', {
          variant: 'error',
        });
      }
    },
  });
};
