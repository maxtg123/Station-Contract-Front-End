import { useMemo } from 'react';
import { IAction, IModule } from 'src/@types/chucvu';
import { IKhuVuc } from 'src/@types/nguoidung';
import { IProfile } from 'src/@types/user';
import { getAuthCredentials } from 'src/utils/authUtils';

// ----------------------------------------------------------------------
type IQuyen = { module: IModule; action: IAction };
type IQuyenByPhongDai = IKhuVuc & {
  listQuyen: IQuyen[];
};

type ReturnType = {
  isAdmin: boolean;
  pdChinh: IKhuVuc | null;
  listPhanQuyenChinh: IQuyen[];
  allQuyen: IQuyenByPhongDai[];
  pdKhuVucList: IKhuVuc[];
  profile: IProfile | null;
};

export default function useAuthCredentials(): ReturnType {
  const { profile } = getAuthCredentials();

  const isAdmin = useMemo(() => {
    if (profile) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        return true;
      }
    }
    return false;
  }, [profile]);

  const pdChinh = useMemo(() => {
    if (profile) {
      return profile?.nguoiDungKhuVucList?.find((kv) => kv.loai === 'CHINH') || null;
    }
    return null;
  }, [profile]);

  const listPhanQuyenChinh: IQuyen[] = useMemo(() => {
    if (profile) {
      return (
        profile?.nguoiDungKhuVucList
          ?.find((kv) => kv.loai === 'CHINH')
          ?.chucVu?.chucVuPhanQuyenList?.map((pq) => ({ module: pq.module, action: pq.action })) ||
        []
      );
    }
    return [];
  }, [profile]);

  const allQuyen: IQuyenByPhongDai[] = useMemo(() => {
    if (profile) {
      return (
        profile?.nguoiDungKhuVucList?.map((kv) => {
          return {
            ...kv,
            listQuyen:
              kv?.chucVu?.chucVuPhanQuyenList?.map((q) => ({
                module: q.module,
                action: q.action,
              })) || [],
          };
        }) || []
      );
    }
    return [];
  }, [profile]);

  const pdKhuVucList = useMemo(() => {
    if (profile) {
      return profile?.nguoiDungKhuVucList?.filter((kv) => kv.loai === 'KHU_VUC') || [];
    }
    return [];
  }, [profile]);

  return {
    isAdmin,
    pdChinh,
    listPhanQuyenChinh,
    allQuyen,
    pdKhuVucList,
    profile,
  };
}
