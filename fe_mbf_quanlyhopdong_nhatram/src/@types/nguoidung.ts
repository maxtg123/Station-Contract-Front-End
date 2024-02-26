import { IDmPhongDai, IDmTo } from './category';
import { IChucVuRow } from './chucvu';

export type IGioiTinh = 'NAM' | 'NU';
export type ITrangThaiNguoiDung = 'HOAT_DONG' | 'NGUNG_HOAT_DONG';

export type IKhuVuc = {
  chucVu: IChucVuRow | null;
  loai: 'CHINH' | 'KHU_VUC';
  dmPhongDai: IDmPhongDai | null;
  dmTo: IDmTo | null;
};

export type INguoiDung = {
  id: number;
  email: string;
  gioiTinh: IGioiTinh;
  createdAt: number | Date;
  soDienThoai: string;
  hoTen: string;
  trangThai: ITrangThaiNguoiDung;
  nguoiDungKhuVucList: IKhuVuc[];
};

export type INguoiDungForm = {
  id?: number;
  email: string;
  gioiTinh: 'NAM' | 'NU';
  soDienThoai: string;
  hoTen: string;
  khuVucList: IKhuVuc[];
  trangThai: ITrangThaiNguoiDung;
};

export type INguoiDungInput = {
  email: string;
  hoTen: string;
  gioiTinh: 'NAM' | 'NU';
  soDienThoai: string;
  nguoiDungKhuVucList: {
    phongDaiChucVuId: number;
    phongDaiId: number;
    toId: number | null;
    loai: 'CHINH' | 'KHU_VUC';
  }[];
  trangThai: ITrangThaiNguoiDung;
};
