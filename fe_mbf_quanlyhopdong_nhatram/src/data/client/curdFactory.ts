import { ResponseInfo } from 'src/@types/common';
import { HttpClient } from 'src/utils/httpClient';

export function crudFactory<Type, QueryParams, InputType>(endpoint: string) {
  return {
    all(params: QueryParams) {
      return HttpClient.get<ResponseInfo<Type>>(endpoint, params);
    },
    get({ id }: { id: number }) {
      return HttpClient.get<ResponseInfo<Type>>(`${endpoint}/${id}`);
    },
    getListToId({ id }: { id: number }) {
      return HttpClient.get<ResponseInfo<Type>>(`${endpoint}/${id}`);
    },
    create(data: InputType) {
      return HttpClient.post<ResponseInfo<Type>>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
      return HttpClient.put<ResponseInfo<Type>>(`${endpoint}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient.delete<ResponseInfo<Type>>(`${endpoint}/${id}`);
    },
  };
}
