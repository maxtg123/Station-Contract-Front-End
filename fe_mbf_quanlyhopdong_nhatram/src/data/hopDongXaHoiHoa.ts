import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { IHopDongImportInput, ITrangThaiHopDong } from 'src/@types/hopdong';
import {
  HopDongXaHoiHoaPaginator,
  HopDongXaHoiHoaQueryOptions,
  IHopDongXaHoiHoa,
  IHopDongXaHoiHoaCreateInput,
  IHopDongXaHoiHoaUpdateInput,
} from 'src/@types/hopdongxahoihoa';
import {
  IExcelBangKeKhaiThanhToan,
  IExcelThanhToanChiHo,
  IThongKeHopDongThanhToan,
  ITransFormDataThanhToan,
} from 'src/@types/thanhtoan';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { hopDongXaHoiHoaClient } from './client/hopDongXaHoiHoa';

export const useHopDongXaHoiHoaQuery = (
  options: Partial<HopDongXaHoiHoaQueryOptions>,
  useQueryOptions?: any
) => {
  const queryInfo = useQuery<HopDongXaHoiHoaPaginator, Error>(
    [API_ENDPOINTS.HOP_DONG, options],
    ({ queryKey, pageParam }) =>
      hopDongXaHoiHoaClient.paginated({
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

export const useHopDongXaHoiHoaDetailQuery = (id: number, options: any = {}) =>
  useQuery<ResponseInfo<IHopDongXaHoiHoa>, Error>(
    [API_ENDPOINTS.HOP_DONG],
    () => hopDongXaHoiHoaClient.get({ id }),
    {
      keepPreviousData: true,
      enabled: !!id,
      ...options,
    }
  );

export const useThongKeHopDongXaHoiHoaThanhToanQuery = (
  options: { phongDaiId?: number; trangThaiHopDong?: ITrangThaiHopDong },
  useQueryOptions: any = {}
) =>
  useQuery<IThongKeHopDongThanhToan, Error>(
    [API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN],
    () =>
      hopDongXaHoiHoaClient.thongKeHopDongThanhToan(
        `${API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN}`
      ),
    {
      keepPreviousData: true,
      ...useQueryOptions,
    }
  );
export const useCreateHopDongXaHoiHoaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (input: IHopDongXaHoiHoaCreateInput) => hopDongXaHoiHoaClient.createFormData(input),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
      },
    }
  );
};

export const useUpdateHopDongXaHoiHoaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, input }: { id: number; input: IHopDongXaHoiHoaUpdateInput }) =>
      hopDongXaHoiHoaClient.updateFormData(id, input),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
      },
    }
  );
};

export const useDeleteDmHopDongXaHoiHoaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(hopDongXaHoiHoaClient.delete, {
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useThanhToanHopDongXaHoiHoaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (dataThanhToanHopDong: ITransFormDataThanhToan[]) =>
      // Gọi API thanh toán hợp đồng với dữ liệu `data`
      hopDongXaHoiHoaClient.updateThanhToanHopDong(dataThanhToanHopDong),
    {
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
        queryClient.invalidateQueries(API_ENDPOINTS.THONG_KE_HOP_DONG_THANH_TOAN);
      },
    }
  );
};

export const useExportThanhToanChiHoMutation = () =>
  useMutation((data: IExcelThanhToanChiHo) => hopDongXaHoiHoaClient.export(data));

export const useImportHopDongXaHoiHoaMutation = () => {
  const queryClient = useQueryClient();
  return useMutation((input: IHopDongImportInput[]) => hopDongXaHoiHoaClient.import(input), {
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.HOP_DONG);
    },
  });
};

export const useExportBangKeKhaiThanhToanMutation = () =>
  useMutation((data: IExcelBangKeKhaiThanhToan) =>
    hopDongXaHoiHoaClient.exportBangKeKhaiThanhToan(data)
  );
