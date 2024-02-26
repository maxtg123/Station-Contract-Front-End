import {
  IDmHuyen,
  IDmLoaiCotAnten,
  IDmLoaiCsht,
  IDmLoaiThietBiRan,
  IDmLoaiTram,
  IDmPhongDai,
  IDmTinh,
  IDmTo,
  IDmTramKhuVuc,
  IDmXa,
} from './category';
import { OptionTypeTram, PaginationQueryOptions, PaginatorInfo } from './common';

export type ITram = {
  id: number;
  toId: number;
  maTram: string;
  maTramErp: string;
  siteNameErp: string;
  ten: string;
  maDauTuXayDung: string;
  tinhId: number;
  huyenId: number;
  xaId: number;
  diaChi: string;
  kinhDo: string;
  viDo: string;
  khuVucId: number;
  ngayPhatSong: Date | null;
  loaiCshtId: number;
  loaiTramId: number;
  loaiCotAngtenId: number;
  doCaoAngten: number;
  dmTinh: IDmTinh;
  dmHuyen: IDmHuyen;
  dmXa: IDmXa;
  dmPhongDai: IDmPhongDai;
  dmTo: IDmTo;
  dmLoaiCotAngten: IDmLoaiCotAnten;
  dmLoaiCsht: IDmLoaiCsht;
  dmLoaiThietBiRanList: IDmLoaiThietBiRan[];
  dmLoaiTram: IDmLoaiTram;
  dmTramKhuVuc: IDmTramKhuVuc;
  ghiChu: string;
  trangThaiHoatDong: 'HOAT_DONG' | 'NGUNG_HOAT_DONG' | boolean;
  daPhatSong: boolean;
};
export type ITramForm = {
  id?: number;
  dmPhongDai: OptionTypeTram | null;
  dmTo: OptionTypeTram | null;
  maTram: string;
  maTramErp: string;
  siteNameErp: string;
  ten: string;
  maDTXD: string;
  dmTinh: OptionTypeTram | null;
  dmHuyen: OptionTypeTram | null;
  dmXa: OptionTypeTram | null;
  diaChi: string;
  kinhDo: string;
  viDo: string;
  dmTramKhuVuc: OptionTypeTram | null;
  ngayPhatSong: Date | number | null;
  dmLoaiCsht: OptionTypeTram | null;
  dmLoaiTram: OptionTypeTram | null;
  dmLoaiCotAngten: OptionTypeTram | null;
  dmLoaiThietBiRanList: OptionTypeTram[] | null;
  daPhatSong: boolean;
  doCaoAngten: number;
  ghiChu: string;
  trangThaiHoatDong: boolean;
};

export type ITramInput = {
  phongDaiId: number;
  toId: number;
  maTram: string;
  maTramErp: string;
  siteNameErp: string;
  ten: string;
  maDauTuXayDung: string;
  tinhId: number;
  huyenId: number;
  xaId: number;
  diaChi: string;
  kinhDo: string;
  viDo: string;
  khuVucId: number;
  ngayPhatSong: Date | null;
  loaiCshtId: number;
  loaiTramId: number;
  loaiCotAngtenId: number;
  doCaoAngten: number;
  dmLoaiThietBiRanList: OptionTypeTram[];
  ghiChu: string;
  trangThaiHoatDong: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
  daPhatSong: boolean;
};

export type IFilterTram = {
  search: string;
};

export interface TramQueryOptions extends PaginationQueryOptions {
  search: string;
  responseType?: number; // 0: get all, 1: pagination, default is 1
  trangThaiPhatSong?: boolean;
}

export interface TramPaginator extends PaginatorInfo<ITram> {}

export type IFilterAdvancedTram = {
  tinh: string | null;
  huyen: string | null;
  xa: string | null;
  phongDai: string | null;
  to: string | null;
  trangThaiHoatDong: string | null;
  loaiCsht: string | null;
};

export type IFilterAdvancedTramForm = {
  tinh: OptionTypeTram | null;
  huyen: OptionTypeTram | null;
  xa: OptionTypeTram | null;
  phongDai: OptionTypeTram | null;
  to: OptionTypeTram | null;
  trangThaiHoatDong: string | null;
  loaiCsht: OptionTypeTram | null;
};

export type IThongKeTram = {
  TAT_CA: number;
  CHUA_PHAT_SONG_HOAT_DONG: number;
  PHAT_SONG_HOAT_DONG: number;
  CHUA_PHAT_SONG_NGUNG_HOAT_DONG: number;
  PHAT_SONG_NGUNG_HOAT_DONG: number;
  HOAT_DONG: number;
  NGUNG_HOAT_DONG: number;
};

export type IDataExportTram = {
  export_all_column?: boolean;
  listId: string[];
  maTram?: boolean;
  maDauTuXayDung?: boolean;
  maTramErp?: boolean;
  siteNameErp?: boolean;
  ten?: boolean;
  dmPhongDai?: boolean;
  dmTo?: boolean;
  dmTinh?: boolean;
  dmHuyen?: boolean;
  dmXa?: boolean;
  diaChi?: boolean;
  dmLoaiCotAngten?: boolean;
  doCaoAngten?: boolean;
  dmLoaiCsht?: boolean;
  dmLoaiTram?: boolean;
  dmTramKhuVuc?: boolean;
  kinhDo?: boolean;
  viDo?: boolean;
  ngayPhatSong?: boolean;
  dmLoaiThietBiRanList?: boolean;
  trangThaiHoatDong?: boolean;
  ghiChu?: boolean;
};
