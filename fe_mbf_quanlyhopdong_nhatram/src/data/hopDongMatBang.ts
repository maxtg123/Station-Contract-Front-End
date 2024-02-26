import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { IExportHopDong, IHopDongImportInput, ITrangThaiHopDong } from 'src/@types/hopdong';
import {
  HopDongPaginator,
  HopDongQueryOptions,
  IHopDong,
  IHopDongCreateInput,
  IHopDongUpdateInput,
} from 'src/@types/hopdongmatbang';
import {
  IExcelBangKeKhaiThanhToan,
  IExcelThanhToanChiHo,
  IThongKeHopDongThanhToan,
  ITransFormDataThanhToan,
} from 'src/@types/thanhtoan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { hopDongClient } from './client/hopDongMatBang';

export const useHopDongQuery = (options: Partial<HopDongQueryOptions>, useQueryOptions?: any) => {
  const queryInfo = useQuery<HopDongPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG, options],
    ({ queryKey, pageParam }) =>
      hopDongClient.paginated({ ...(queryKey[1] as Record<string, unknown>), ...pageParam }),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );

  return {
    ...queryInfo,
  };
};

export const useHopDongDetailQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<IHopDong>, Error>(
    [API_ENDPOINTS.HOP_DONG],
    () => hopDongClient.get({ id }),
    {
      keepPreviousData: true,
      enabled: !!id,
      ...options,
    }
  );

export const useThongKeHopDongThanhToanQuery = (
  options: { phongDaiId?: number; trangThaiHopDong?: ITrangThaiHopDong },
  useQueryOptions: any = {}
) =>
  useQuery<IThongKeHopDongThanhToan, Error>(
    [API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN],
    () => hopDongClient.thongKeHopDongThanhToan(`${API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN}`),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );
export const useCreateHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation((input: IHopDongCreateInput) => hopDongClient.createFormData(input), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useUpdateHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, input }: { id: number; input: IHopDongUpdateInput }) =>
      hopDongClient.updateFormData(id, input),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
      },
    }
  );
};

export const useDeleteDmHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(hopDongClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useThanhToanHopDongMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (dataThanhToanHopDong: ITransFormDataThanhToan[]) =>
      // Gọi API thanh toán hợp đồng với dữ liệu `data`
      hopDongClient.updateThanhToanHopDong(dataThanhToanHopDong),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
        queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN);
      },
    }
  );
};

export const useExportThanhToanChiHoMutation = () =>
  useMutation((data: IExcelThanhToanChiHo) => hopDongClient.export(data));

export const useImportHopDongMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: IHopDongImportInput[]) => hopDongClient.import(input), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useExportBangKeKhaiThanhToanMutation = () =>
  useMutation((data: IExcelBangKeKhaiThanhToan) => hopDongClient.exportBangKeKhaiThanhToan(data));

export const useDeleteHopDongNhapMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(hopDongClient.deleteHopDongNhap, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useExportHopDongMutation = () =>
  useMutation((data: IExportHopDong) =>
    hopDongClient.exportExcelHopDong(API_ENDPOINTS.HOP_DONG, data)
  );
