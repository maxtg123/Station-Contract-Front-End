import { IKhuVuc } from './nguoidung';

export interface ILoginInput {
  username: string;
  password: string;
}

export interface IProfile {
  id: number;
  email: string;
  hoTen: string;
  gioiTinh: 'NAM' | 'NU';
  soDienThoai: string;
  nguoiDungKhuVucList: IKhuVuc[] | null; // null when super admin
}
export interface IAuthResponse {
  token: string;
  profile: IProfile;
}
