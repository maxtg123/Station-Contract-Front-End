import { HopDongPheDuyetPaginator, PheDuyetListOfHopDongOptions } from 'src/@types/hopdong';
import { ICreatePheDuyetHopDongInput, IPheDuyetHopDongInput } from 'src/@types/hopdongmatbang';
import { API_ENDPOINTS } from 'src/constants/apiEndpoints';
import { HttpClient } from 'src/utils/httpClient';

export const pheduyetHopDongClient = {
  listPheDuyetOfHopDong: (options: PheDuyetListOfHopDongOptions) => {
    return HttpClient.get<HopDongPheDuyetPaginator>(
      `${API_ENDPOINTS.HOP_DONG}/${options.hopDongId}/list-phe-duyet`
    );
  },
  guiHopDongDiPheDuyet: (input: ICreatePheDuyetHopDongInput) =>
    HttpClient.post<any>(API_ENDPOINTS.PHE_DUYET_HOP_DONG.PHE_DUYET, input),
  xetDuyetHopDong: (input: IPheDuyetHopDongInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.PHE_DUYET_HOP_DONG.XET_DUYET, input);
  },
};
