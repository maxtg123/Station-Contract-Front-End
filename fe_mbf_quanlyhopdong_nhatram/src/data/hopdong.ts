import { useMutation, useQuery } from 'react-query';
import { ResponseInfo } from 'src/@types/common';
import { IOldFilesHopDong } from 'src/@types/hopdong';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { hopDongClient } from './client/hopdong';

export const useGetPhuLucsHopDongFromWebCu = (options: any = {}) =>
  useMutation((data: []) => hopDongClient.getPhuLucFromWebCu());
export const useGetHopDongThuHuongFromWebCu = (options: any = {}) =>
  useMutation((data: []) => hopDongClient.getHopDongThuHuongFromWebCu());

export const useOldFilesHopDong = ({ soHopDong }: { soHopDong: string }, options: any = {}) =>
  useQuery<ResponseInfo<IOldFilesHopDong>, Error>(
    [API_ENDPOINTS.HOP_DONG_OLD_FILES, { soHopDong }],
    () => hopDongClient.getOldFiles({ soHopDong }),
    { refetchOnWindowFocus: false, ...options }
  );
