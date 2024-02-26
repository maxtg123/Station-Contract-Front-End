export type ISendMailPheDuyet = {
  type: 'hop-dong-mat-bang' | 'hop-dong-xa-hoi-hoa';
  nguoiGui: {
    email: string;
    name: string;
    phone: string;
    phongDai: string;
  };
  nguoiPheDuyet: { email: string; name: string }[];
  listHopDong: { id: number; soHopDong: string; maTram: string[]; maDTXD: string[] }[];
};

export type ISendMailGiaoViec = {
  type: 'hop-dong-mat-bang' | 'hop-dong-xa-hoi-hoa';
  nguoiGiaoViec: {
    email: string;
    name: string;
    phone: string;
    phongDai: string;
  };
  nguoiNhanViec: { email: string; name: string }[];
  listHopDong: {
    id: number;
    soHopDong: string;
    maTram: string[];
    maDTXD: string[];
    ngayHetHan: string;
  }[];
};
