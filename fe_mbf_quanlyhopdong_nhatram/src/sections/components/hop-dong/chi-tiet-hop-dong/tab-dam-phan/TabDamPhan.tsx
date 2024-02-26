import {
  Box,
  Card,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IHopDongDamPhan } from 'src/@types/damphan';
import Label from 'src/components/label/Label';
import { useChiTietHopDongContext } from 'src/context/hop-dong/chitietHopDongContext';
import { useDamPhansOfHopDongQuery } from 'src/data/damPhanHopDong';
import useAuthCredentials from 'src/hooks/useAuthCredentials';
import CacLanDamPhan from './CacLanDamPhan';
import NoiDungGiaoViec from './NoiDungGiaoViec';
import ThemMoi from './actions/them-moi/ThemMoi';

const TableNoData = dynamic(() => import('src/components/table/TableNoData'));

type Props = {
  hopDongId: number;
};
const TabDamPhan = ({ hopDongId }: Props) => {
  const { profile } = useAuthCredentials();

  const { data, isLoading } = useDamPhansOfHopDongQuery(
    { hopDongId },
    { enabled: !!hopDongId, refetchOnWindowFocus: false }
  );

  const {
    state: { rightBar },
    dispatch,
  } = useChiTietHopDongContext();
  const listHopDongDamPhan = data?.elements;
  const [dataTienTrinhDamPhan, setDataTienTrinhDamPhan] = useState<IHopDongDamPhan | undefined>(
    undefined
  );
  const [idActive, setIdActive] = useState('');
  useEffect(() => {
    setDataTienTrinhDamPhan(data?.elements?.[0]);
    setIdActive(data?.elements?.[0]?.id.toString() as string);
  }, [data?.elements]);

  const handleClickNoiDungCongViec = (value: IHopDongDamPhan) => {
    setDataTienTrinhDamPhan(value);
    setIdActive(value.id.toString());
    if (value.trangThaiDamPhanMoiNhat === 'PHE_DUYET') {
      dispatch({
        type: 'reset-data-right-bar',
      });
    }
  };
  const handleThemMoi = (hopDongDamPhan: IHopDongDamPhan) => {
    if (hopDongDamPhan) {
      dispatch({
        type: 'set-data-for-right-bar',
        payload: { type: 'dam_phan', data: null, id: hopDongDamPhan?.id },
      });
    }
  };
  return isLoading ? (
    <Box sx={{ width: '100%', height: '100%' }} p={10}>
      <Stack direction="row" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Stack>
    </Box>
  ) : (
    <Stack direction="column" sx={{ p: 0 }}>
      {listHopDongDamPhan && listHopDongDamPhan.length > 0 ? (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={rightBar ? 12 : 4}>
              {listHopDongDamPhan.map((item) => (
                <Stack spacing={3} key={item.id}>
                  <Card
                    onClick={() => handleClickNoiDungCongViec(item)}
                    sx={{
                      cursor: 'pointer',
                      mb: 2,
                      backgroundColor: `${idActive === item.id.toString() ? '#eef1f4' : '#fffff'}`,
                      ':hover': {
                        backgroundColor: '#eef1f4',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      p={3}
                      pb={0}
                    >
                      <Typography variant="h6">Nội dung đàm phán</Typography>
                      {item.trangThaiDamPhanMoiNhat === 'PHE_DUYET' ? (
                        <Label variant="filled" color="success">
                          Đã xong
                        </Label>
                      ) : (
                        <Label variant="filled" color="warning">
                          Đang đàm phán
                        </Label>
                      )}
                    </Stack>
                    <NoiDungGiaoViec hopDongDamPhan={item} />
                  </Card>
                </Stack>
              ))}
            </Grid>
            {dataTienTrinhDamPhan ? (
              <>
                {!rightBar && (
                  <Grid item xs={12} md={8}>
                    <Stack direction="column" spacing={2}>
                      {dataTienTrinhDamPhan.hopDongDamPhanTienTrinhList &&
                        dataTienTrinhDamPhan.hopDongDamPhanTienTrinhList.length > 0 && (
                          <CacLanDamPhan
                            data={dataTienTrinhDamPhan.hopDongDamPhanTienTrinhList}
                            damPhanId={dataTienTrinhDamPhan.id}
                            isNguoiGiaoViec={dataTienTrinhDamPhan?.nguoiGui?.id === profile?.id}
                          />
                        )}

                      <Box sx={{ m: 2 }}>
                        {dataTienTrinhDamPhan?.hopDongDamPhanNguoiNhanList.some(
                          (nguoiNhan) => nguoiNhan.nguoiDungId === profile?.id
                        ) &&
                          !rightBar &&
                          (dataTienTrinhDamPhan.trangThaiDamPhanMoiNhat === null ||
                            dataTienTrinhDamPhan.trangThaiDamPhanMoiNhat === 'TU_CHOI') && (
                            <ThemMoi onThemMoi={() => handleThemMoi(dataTienTrinhDamPhan)} />
                          )}
                      </Box>
                    </Stack>
                  </Grid>
                )}
              </>
            ) : (
              <Box sx={{ width: '100%', height: '100%' }} p={10}>
                <Stack direction="row" alignItems="center" justifyContent="center">
                  <CircularProgress />
                </Stack>
              </Box>
            )}
          </Grid>
        </Box>
      ) : (
        <Table sx={{ display: 'flex', justifyContent: 'center' }}>
          <TableHead />
          <TableBody>
            <TableNoData title="Chưa có dữ liệu" isNotFound />
          </TableBody>
        </Table>
      )}
    </Stack>
  );
};

export default TabDamPhan;
