import { Box, Button, Divider, Link, Stack, Typography } from '@mui/material';
import equal from 'fast-deep-equal';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IDmPhongDai, IDmTo } from 'src/@types/category';
import { IChucVuRow } from 'src/@types/chucvu';
import { INguoiDungForm } from 'src/@types/nguoidung';
import { RHFAutocomplete } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/Iconify';
import { useChucvusQuery } from 'src/data/chucvu';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useDmTosQuery } from 'src/data/dmTo';
import { getAuthCredentials } from 'src/utils/authUtils';

const XemQuyenNguoiDung = dynamic(() => import('../../XemQuyenNguoiDung'), { ssr: false });

const KhuVucField = () => {
  const { control, watch } = useFormContext<INguoiDungForm>();
  const { fields, update, append, remove } = useFieldArray({ control, name: 'khuVucList' });
  const wKhuVucList = watch('khuVucList');
  const wKhuVucChinh = wKhuVucList.filter((kv) => kv.loai === 'CHINH');
  const wKhuVucPhu = wKhuVucList.filter((kv) => kv.loai === 'KHU_VUC');

  const [pdOptions, setPdOptions] = useState<IDmPhongDai[]>([]);
  const [chiTietQuyenChucVu, setChiTietQuyenChucVu] = useState<IChucVuRow | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  const { data: phongDai } = useDmPhongDaisQuery({
    refetchOnWindowFocus: false,
  });
  const { data: tos } = useDmTosQuery({ refetchOnWindowFocus: false });
  const { data: chucVus } = useChucvusQuery({
    refetchOnWindowFocus: false,
  });

  // set pd option
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: IDmPhongDai[] = [];
    if (phongDai) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = phongDai.elements;
        setIsSuperAdmin(true);
      } else {
        newPdOptions = phongDai.elements.filter((pd) =>
          profile?.nguoiDungKhuVucList
            ? profile?.nguoiDungKhuVucList.filter((kv) => kv?.dmPhongDai?.id === pd.id)?.length > 0
            : false
        );
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [phongDai, pdOptions]);

  const handleThemKhuVuc = () => {
    append({
      dmPhongDai: null,
      dmTo: null,
      chucVu: null,
      loai: 'KHU_VUC',
    });
  };

  const handleXoaKhuVux = (index: number) => {
    remove(index);
  };

  return (
    <div>
      {fields
        .filter((kv) => kv.loai === 'CHINH')
        .map((kvChinh, index) => {
          return (
            <Stack key={kvChinh.id} spacing={3} sx={{ py: 2.5, pt: 0 }}>
              <RHFAutocomplete
                name={`khuVucList.${index}.dmPhongDai`}
                label="Phòng/Đài (*)"
                options={pdOptions.filter((pd) => {
                  return !wKhuVucList.find((w) => w?.dmPhongDai?.id === pd.id);
                })}
                getOptionLabel={(option: IDmPhongDai | string) => (option as IDmPhongDai).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event: any, newValue) => {
                  const value = newValue as IDmPhongDai | null;
                  if (value?.id === kvChinh.dmPhongDai?.id) return;

                  update(index, { ...kvChinh, dmPhongDai: value, dmTo: null, chucVu: null });
                }}
              />
              <RHFAutocomplete
                name={`khuVucList.${index}.dmTo`}
                label="Tổ"
                options={
                  tos?.elements.filter((to) => to.phongDai.id === kvChinh.dmPhongDai?.id) || []
                }
                getOptionLabel={(option: IDmTo | string) => (option as IDmTo).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              <RHFAutocomplete
                name={`khuVucList.${index}.chucVu`}
                label="Chức vụ (*)"
                options={chucVus?.filter((cv) => cv.dmPhongDai.id === kvChinh.dmPhongDai?.id) || []}
                getOptionLabel={(option: IChucVuRow | string) => (option as IChucVuRow).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              {wKhuVucChinh?.[index]?.chucVu && (
                <Link
                  href="#"
                  variant="subtitle2"
                  onClick={() => setChiTietQuyenChucVu(wKhuVucChinh?.[index]?.chucVu)}
                >
                  Xem quyền
                </Link>
              )}
            </Stack>
          );
        })}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Khu vực
      </Typography>
      {fields
        .filter((kv) => kv.loai === 'KHU_VUC')
        .map((kvPhu, _index) => {
          const index = _index + 1; // plus kv chinhg
          return (
            <Stack key={kvPhu.id} spacing={3} sx={{ py: 2.5 }}>
              <RHFAutocomplete
                name={`khuVucList.${index}.dmPhongDai`}
                label="Phòng/Đài (*)"
                options={pdOptions.filter((pd) => {
                  return !wKhuVucList.find((w) => w?.dmPhongDai?.id === pd.id);
                })}
                getOptionLabel={(option: IDmPhongDai | string) => (option as IDmPhongDai).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={(event: any, newValue) => {
                  const value = newValue as IDmPhongDai | null;
                  if (value?.id === kvPhu.dmPhongDai?.id) return;

                  update(index, { ...kvPhu, dmPhongDai: value, dmTo: null, chucVu: null });
                }}
              />
              <RHFAutocomplete
                name={`khuVucList.${index}.dmTo`}
                label="Tổ"
                options={
                  tos?.elements.filter((to) => to.phongDai.id === kvPhu.dmPhongDai?.id) || []
                }
                getOptionLabel={(option: IDmTo | string) => (option as IDmTo).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              <RHFAutocomplete
                name={`khuVucList.${index}.chucVu`}
                label="Chức vụ (*)"
                options={chucVus?.filter((cv) => cv.dmPhongDai.id === kvPhu.dmPhongDai?.id) || []}
                getOptionLabel={(option: IChucVuRow | string) => (option as IChucVuRow).ten}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
              {wKhuVucPhu?.[_index]?.chucVu && (
                <Link
                  href="#"
                  variant="subtitle2"
                  onClick={() => setChiTietQuyenChucVu(wKhuVucPhu?.[_index]?.chucVu)}
                >
                  Xem quyền
                </Link>
              )}
              <Button
                onClick={() => handleXoaKhuVux(index)}
                color="error"
                size="small"
                sx={{
                  alignSelf: 'flex-end',
                }}
                startIcon={<Iconify icon="eva:trash-2-outline" />}
              >
                Xoá
              </Button>
            </Stack>
          );
        })}

      {isSuperAdmin && (
        <Box sx={{ my: 2 }}>
          <Button onClick={handleThemKhuVuc} sx={{ justifyContent: 'flex-start' }}>
            <Iconify icon="eva:plus-fill" />
            <span style={{ marginLeft: 10, textTransform: 'none' }}>Thêm khu vực</span>
          </Button>
        </Box>
      )}

      {chiTietQuyenChucVu && (
        <XemQuyenNguoiDung
          open
          onClose={() => setChiTietQuyenChucVu(null)}
          selectedChucVu={chiTietQuyenChucVu}
        />
      )}
    </div>
  );
};

export default KhuVucField;
