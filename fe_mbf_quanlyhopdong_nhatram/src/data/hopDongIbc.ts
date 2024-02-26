import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { IHopDongImportInput, ITrangThaiHopDong } from 'src/@types/hopdong';
import {
  HopDongIbcPaginator,
  HopDongIbcQueryOptions,
  IHopDongIbc,
  IHopDongIbcCreateInput,
  IHopDongIbcUpdateInput,
} from 'src/@types/hopdongibc';
import {
  IExcelBangKeKhaiThanhToan,
  IExcelThanhToanChiHo,
  IThongKeHopDongThanhToan,
  ITransFormDataThanhToan,
} from 'src/@types/thanhtoan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { hopDongIbcClient } from './client/hopDongIbc';

export const useHopDongIbcQuery = (
  options: Partial<HopDongIbcQueryOptions>,
  useQueryOptions?: any
) => {
  const queryInfo = useQuery<HopDongIbcPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG, options],
    ({ queryKey, pageParam }) =>
      hopDongIbcClient.paginated({
        ...(queryKey[1] as Record<string, unknown>),
        ...pageParam,
      }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return {
    ...queryInfo,
  };
};

export const useHopDongIbcDetailQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<IHopDongIbc>, Error>(
    [API_ENDPOINTS.HOP_DONG],
    () => hopDongIbcClient.get({ id }),
    {
      keepPreviousData: true,
      enabled: !!id,
      ...options,
    }
  );

export const useThongKeHopDongIbcThanhToanQuery = (
  options: { phongDaiId?: number; trangThaiHopDong?: ITrangThaiHopDong },
  useQueryOptions: any = {}
) =>
  useQuery<IThongKeHopDongThanhToan, Error>(
    [API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN],
    () => hopDongIbcClient.thongKeHopDongThanhToan(`${API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN}`),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );
export const useCreateHopDongIbcMutation = () => {
  const queryClient = useQueryClient();

  return useMutation((input: IHopDongIbcCreateInput) => hopDongIbcClient.createFormData(input), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useUpdateHopDongIbcMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, input }: { id: number; input: IHopDongIbcUpdateInput }) =>
      hopDongIbcClient.updateFormData(id, input),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
      },
    }
  );
};

export const useDeleteDmHopDongIbcMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(hopDongIbcClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useThanhToanHopDongIbcMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (dataThanhToanHopDong: ITransFormDataThanhToan[]) =>
      // Gọi API thanh toán hợp đồng với dữ liệu `data`
      hopDongIbcClient.updateThanhToanHopDong(dataThanhToanHopDong),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
        queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN);
      },
    }
  );
};

export const useExportThanhToanChiHoMutation = () =>
  useMutation((data: IExcelThanhToanChiHo) => hopDongIbcClient.export(data));

export const useImportHopDongIbcMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: IHopDongImportInput[]) => hopDongIbcClient.import(input), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useExportBangKeKhaiThanhToanMutation = () =>
  useMutation((data: IExcelBangKeKhaiThanhToan) =>
    hopDongIbcClient.exportBangKeKhaiThanhToan(data)
  );
