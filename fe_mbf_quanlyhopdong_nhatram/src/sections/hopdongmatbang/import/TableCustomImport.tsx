// mui
import { LoadingButton } from '@mui/lab';
import TimelineDot from '@mui/lab/TimelineDot';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import equal from 'fast-deep-equal';
import { useEffect, useMemo, useState } from 'react';
import { OptionTypeTram } from 'src/@types/common';
import { IHopDongImportInput, IImportHopDong } from 'src/@types/hopdong';
import Iconify from 'src/components/iconify/Iconify';
import {
  TableNoData,
  TablePaginationCustom,
  TableSkeleton,
  getComparator,
  useTable,
} from 'src/components/table';
import TableHeadCustomColumnGroup from 'src/components/table/TableHeadCustomColumnGroup';
import {
  TABLE_HEADER_IMPORT_HOP_DONG_GROUP_COLUMN,
  TABLE_HEADER_IMPORT_HOP_DONG_GROUP_COLUMN_DATA_VALID,
  TABLE_HEAD_IMPORT_HOP_DONG,
} from 'src/constants/hopdongmatbang.constant';
import { useDmDoiTuongKyHopDongsQuery } from 'src/data/dmDoiTuongKyHopDong';
import { useDmDonViDungChungQuery } from 'src/data/dmDonViDungChung';
import { useDmHinhThucDauTusQuery } from 'src/data/dmHinhThucDauTu';
import { useDmHinhThucKyHopDongsQuery } from 'src/data/dmHinhThucKyHopDong';
import { useDmHinhThucThanhToansQuery } from 'src/data/dmHinhThucThanhToan';
import { useDmAllHuyenQuery } from 'src/data/dmHuyen';
import { useDmKhoanMucQuery } from 'src/data/dmKhoanMuc';
import { useDmLoaiCotAntensQuery } from 'src/data/dmLoaiCotAnten';
import { useDmLoaiCshtsQuery } from 'src/data/dmLoaiCsht';
import { useDmLoaiHDPhuTrosQuery } from 'src/data/dmLoaiHDPhuTro';
import { useDmLoaiHangMucCshtsQuery } from 'src/data/dmLoaiHangMucCsht';
import { useDmLoaiPhongMaysQuery } from 'src/data/dmLoaiPhongMay';
import { useDmLoaiPhongMayPhatDiensQuery } from 'src/data/dmLoaiPhongMayPhatDien';
import { useDmLoaiThietBiRansQuery } from 'src/data/dmLoaiThietBiRan';
import { useDmLoaiTramsQuery } from 'src/data/dmLoaiTram';
import { useDmLoaiTramVhktsQuery } from 'src/data/dmLoaiTramVhkt';
import { useDmPhongDaisQuery } from 'src/data/dmPhongDai';
import { useDmThuesQuery } from 'src/data/dmThue';
import { useDmTinhsQuery } from 'src/data/dmTinh';
import { useDmTosQuery } from 'src/data/dmTo';
import { useDmTramKhuVucsQuery } from 'src/data/dmTramKhuVuc';
import { useDmAllXasQuery } from 'src/data/dmXa';
import { useHopDongQuery } from 'src/data/hopDongMatBang';
import { useTramsQuery } from 'src/data/tram';
import CheckImportHopDongTableRow from 'src/sections/components/hop-dong/import/table-check-import/CheckImportHopDongTableRow';
import { getAuthCredentials } from 'src/utils/authUtils';
import { checkPaymentCycle, getTransFormDataImportHopDong } from 'src/utils/hopDongUtils';

type Props = {
  data: IImportHopDong[];
  onDataValid: (dataValid: IHopDongImportInput[]) => void;
};
const optionType = ['HOP_LE', 'KHONG_HOP_LE'];
const OPTION_STATUS: Record<string, string> = {
  HOP_LE: 'Hợp lệ',
  KHONG_HOP_LE: 'Không hợp lệ',
};
const TYPE_ALL_HOP_DONG = 1;
export default function TableCustomImport({ data, onDataValid }: Props) {
  const {
    page,
    rowsPerPage,
    dense,
    order,
    orderBy,
    setPage,
    selected,
    onChangePage,
    onSelectRow,
    onChangeRowsPerPage,
    onChangeDense,
  } = useTable();
  const [transFormData, setTransFormData] = useState<IImportHopDong[]>([]);
  const [pdOptions, setPdOptions] = useState<OptionTypeTram[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [isTransformed, setIsTransformed] = useState(false);
  // call api
  const { data: listDataTram, refetch: refetchTram } = useTramsQuery(
    { size: undefined, page: undefined, responseType: 0 },
    { refetchOnWindowFocus: false }
  );
  const { data: listDataHopDong, refetch: refetchHopDong } = useHopDongQuery(
    { size: undefined, page: undefined, responseType: TYPE_ALL_HOP_DONG },
    { refetchOnWindowFocus: false }
  );
  const { data: listData, refetch: refetchPhongDai } = useDmPhongDaisQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataTo, refetch: refetchTo } = useDmTosQuery({ refetchOnWindowFocus: false });
  const { data: listDataTinh, refetch: refetchTinh } = useDmTinhsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataHuyen, refetch: refetchTHuyen } = useDmAllHuyenQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataXa, refetch: refetchXa } = useDmAllXasQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataKhuVuc, refetch: refetchTramKhuVuc } = useDmTramKhuVucsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiCsht, refetch: refetchLoaiCsht } = useDmLoaiCshtsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiTram, refetch: refetchLoaiTram } = useDmLoaiTramsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiThietBiRan, refetch: refetchLoaiThietBiRan } =
    useDmLoaiThietBiRansQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataLoaiCotAnten, refetch: refetchLoaiCotAnten } = useDmLoaiCotAntensQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataHinhThucKyHopDong, refetch: refetchHinhThucKyHopDong } =
    useDmHinhThucKyHopDongsQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataHinhThucDauTu, refetch: refetchHinhThucDauTu } = useDmHinhThucDauTusQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataDoiTuongKyHopDong, refetch: refetchDoiTuongKyHopDong } =
    useDmDoiTuongKyHopDongsQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataHinhThucThanhToan, refetch: refetchHinhThucThanhToan } =
    useDmHinhThucThanhToansQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataLoaiHangMucCsht, refetch: refetchLoaiHangMucCsht } =
    useDmLoaiHangMucCshtsQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataThueVAT, refetch: refetchThueVAT } = useDmThuesQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiHDPhuTro, refetch: refetchLoaiHDPhuTro } = useDmLoaiHDPhuTrosQuery({
    refetchOnWindowFocus: false,
  });

  const { data: listDataLoaiPhongMay, refetch: refetchLoaiPhongMay } = useDmLoaiPhongMaysQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataLoaiPhongMayPhatDien, refetch: refetchLoaiPhongMayPhatDien } =
    useDmLoaiPhongMayPhatDiensQuery({
      refetchOnWindowFocus: false,
    });
  const { data: listDataLoaiTramVhkt, refetch: refetchLoaiTramVhkt } = useDmLoaiTramVhktsQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataKhoanMuc, refetch: refetchKhoanMuc } = useDmKhoanMucQuery({
    refetchOnWindowFocus: false,
  });
  const { data: listDataDonViDungChung, refetch: refetchDonViDungChung } = useDmDonViDungChungQuery(
    {
      refetchOnWindowFocus: false,
    }
  );
  // set pd option
  useEffect(() => {
    const { profile } = getAuthCredentials();
    let newPdOptions: OptionTypeTram[] = [];
    if (listData) {
      if (profile?.email === 'superadmin@mobifone.vn') {
        newPdOptions = listData.elements.map((pd) => ({
          id: pd.id.toString(),
          ten: pd.ten,
        }));
      } else {
        newPdOptions = listData.elements
          .filter(
            (pd) =>
              (profile?.nguoiDungKhuVucList
                ? profile?.nguoiDungKhuVucList.filter((kv) => kv.dmPhongDai?.id === pd.id).length >
                  0
                : false) && pd.loai === 'Đài'
          )
          .map((pd) => ({ id: pd.id.toString(), ten: pd.ten }));
      }
    }
    if (!equal(pdOptions, newPdOptions)) {
      setPdOptions(newPdOptions);
    }
  }, [listData, pdOptions]);
  useEffect(() => {
    const transFormDataWaiting = async () => {
      if (data) {
        setIsTransformed(true);
        const tempData = data.map((item) => {
          const errorMessages: string[] = [];
          const errorList = {
            maTram: false,
            maTramErp: false,
            soHopDong: false,
            soHopDongErp: false,
            phongDai: false,
            to: false,
            tinh: false,
            huyen: false,
            xa: false,
            khuVuc: false,
            loaiCsht: false,
            loaiTram: false,
            loaiThietBiRan: false,
            ngayPhatSong: false,
            ngayKyHopDong: false,
            ngayKetThucHopDong: false,
            loaiCotAnten: false,
            hinhThucKyHopDong: false,
            hinhThucDauTu: false,
            doiTuongKyHopDong: false,
            hinhThucThanhToan: false,
            thueVAT: false,
            giaThue: false,
            chuKyThanhToan: false,
            ngayBatDauYeuCauThanhToan: false,
            hoTenChuNha: false,
            diaChiLienHe: false,
            chuTaiKhoan: false,
            soTaiKhoan: false,
            nganHangChiNhanh: false,
            loaiHangMucCsht: false,
            maTramDonViDungChung: false,
            loaiPhongMay: false,
            loaiPhongMayPhatDien: false,
            loaiTramVhkt: false,
            khoanMuc: false,
            donViDungChung: false,
          };
          // Check trường bắt buộc
          if (item.soHopDong === '') {
            errorMessages.push('Số hợp đồng là trường bắt buộc');
            errorList.soHopDong = true;
          }
          if (item.maTram === '') {
            errorMessages.push('Mã trạm là trường bắt buộc');
            errorList.maTram = true;
          }
          if (item.tinh === '') {
            errorMessages.push('Tỉnh/Thành phố là trường bắt buộc');
            errorList.tinh = true;
          }
          if (item.phongDai === '') {
            errorMessages.push('Phòng/Đài viễn thông là trường bắt buộc');
            errorList.phongDai = true;
          }
          if (item.ngayKyHopDong === '') {
            errorMessages.push('Ngày ký hợp đồng là trường bắt buộc');
            errorList.ngayKyHopDong = true;
          }
          if (item.ngayKetThucHopDong === '') {
            errorMessages.push('Ngày kết thúc hợp đồng là trường bắt buộc');
            errorList.ngayKetThucHopDong = true;
          }
          // if (!item.giaThue) {
          //   errorMessages.push('Giá thuê là trường bắt buộc và lớn hơn 0');
          //   errorList.giaThue = true;
          // }
          if (item.chuKyThanhToan === '') {
            errorMessages.push('Chu kỳ thanh toán là trường bắt buộc');
            errorList.chuKyThanhToan = true;
          }
          if (item.ngayBatDauYeuCauThanhToan === '') {
            errorMessages.push('Ngày bắt đầu yêu cầu thanh toán là trường bắt buộc');
            errorList.ngayBatDauYeuCauThanhToan = true;
          }
          if (item.hoTenChuNha === '') {
            errorMessages.push('Họ tên chủ nhà là trường bắt buộc');
            errorList.hoTenChuNha = true;
          }
          if (item.diaChiLienHe === '') {
            errorMessages.push('Địa chỉ liên hệ là trường bắt buộc');
            errorList.diaChiLienHe = true;
          }
          // Check trùng danh mục
          // if (item.maTram) {
          //   const checkMaTram = listDataTram?.elements.filter(
          //     (el) =>
          //       (el.maTram !== item.maTram && el.maTramErp === item.maTramErp) ||
          //       (el.maTram === item.maTram && el.maTramErp !== item.maTramErp)
          //   );
          //   if (checkMaTram && checkMaTram.length) {
          //     errorMessages.push('Mã trạm và mã trạm erp không khớp trong hệ thống');
          //     errorList.maTram = true;
          //     errorList.maTramErp = true;
          //   }
          // }
          if (item.soHopDong) {
            const checkSoHopDong = listDataHopDong?.elements.filter(
              (el) => el.soHopDong === item.soHopDong && el.trangThaiHopDong !== 'NHAP'
            );
            if (checkSoHopDong && checkSoHopDong.length) {
              errorMessages.push('Hợp đồng này đang được thực thi');
              errorList.soHopDong = true;
            }
          }
          if (item.soHopDongErp) {
            // const checksoHopDongErp = listDataHopDong?.elements.filter(
            //   (el) => el.soHopDongErp === item.soHopDongErp.toString()
            // );
            // if (checksoHopDongErp && checksoHopDongErp.length) {
            //   errorMessages.push('Số hợp đồng erp đã tồn tại trong hệ thống');
            //   errorList.soHopDongErp = true;
            // }
          }
          if (item.phongDai) {
            const checkPhongDai = pdOptions.filter((el) => el.ten === item.phongDai);
            if (!checkPhongDai.length) {
              errorMessages.push('Bạn đang ở một phòng đài khác');
              errorList.phongDai = true;
            }
          }
          if (item.to) {
            const checkTo = listDataTo?.elements.filter((el) => el.ten === item.to);
            if (checkTo && !checkTo.length) {
              errorMessages.push('Tổ không khớp với danh mục');
              errorList.to = true;
            }
          }
          if (item.tinh) {
            const checkTinh = listDataTinh?.elements.filter((el) => el.ten === item.tinh);
            if (checkTinh && !checkTinh.length) {
              errorMessages.push('Tỉnh/Thành phố không khớp với danh mục');
              errorList.tinh = true;
            }
          }
          if (item.huyen) {
            const checkHuyen = listDataHuyen?.elements.filter((el) => el.ten === item.huyen);
            if (checkHuyen && !checkHuyen.length) {
              errorMessages.push('Quận/Huyện không khớp với danh mục');
              errorList.huyen = true;
            }
          }
          if (item.xa) {
            const checkXa = listDataXa?.elements.filter((el) => el.ten === item.xa);
            if (checkXa && !checkXa.length) {
              errorMessages.push('Phường/Xã không khớp với danh mục');
              errorList.xa = true;
            }
          }
          if (item.khuVuc) {
            const checkKhuVuc = listDataKhuVuc?.elements.filter((el) => el.ten === item.khuVuc);
            if (checkKhuVuc && !checkKhuVuc.length) {
              errorMessages.push('Khu vực không khớp với danh mục');
              errorList.khuVuc = true;
            }
          }
          if (item.loaiTram) {
            const checkLoaiTram = listDataLoaiTram?.elements.filter(
              (el) => el.ten === item.loaiTram
            );
            if (checkLoaiTram && !checkLoaiTram.length) {
              errorMessages.push('Loại trạm không khớp với danh mục');
              errorList.loaiTram = true;
            }
          }
          if (item.loaiCSHT) {
            const checkLoaiCsht = listDataLoaiCsht?.elements.filter(
              (el) => el.ten === item.loaiCSHT
            );
            if (checkLoaiCsht && !checkLoaiCsht.length) {
              errorMessages.push('Loại CSHT không khớp với danh mục');
              errorList.loaiCsht = true;
            }
          }
          if (item.loaiThietBiRan) {
            const splitDataLoaiThietBiRan: string[] = item.loaiThietBiRan.split(',');
            const allExist = splitDataLoaiThietBiRan.every((value) =>
              listDataLoaiThietBiRan?.elements.some((el) => el.ten === value)
            );
            const result = allExist
              ? listDataLoaiThietBiRan?.elements.filter(
                  (el) => !splitDataLoaiThietBiRan.includes(el.ten)
                )
              : [];
            if (result && !result.length) {
              errorMessages.push('Loại thiết bị RAN không khớp với danh mục');
              errorList.loaiThietBiRan = true;
            }
          }
          if (item.loaiCotAnten) {
            const checkloaiCotAnten = listDataLoaiCotAnten?.elements.filter(
              (el) => el.ten === item.loaiCotAnten
            );
            if (checkloaiCotAnten && !checkloaiCotAnten.length) {
              errorMessages.push('Loại cột anten không khớp với danh mục');
              errorList.loaiCotAnten = true;
            }
          }
          if (item.hinhThucKyHopDong) {
            const checkHinhThucKyHopDong = listDataHinhThucKyHopDong?.elements.filter(
              (el) => el.ten === item.hinhThucKyHopDong
            );
            if (checkHinhThucKyHopDong && !checkHinhThucKyHopDong.length) {
              errorMessages.push('Hình thức ký hợp đồng không khớp với danh mục');
              errorList.hinhThucKyHopDong = true;
            }
          }
          if (item.hinhThucDauTu) {
            const checkHinhThucDauTu = listDataHinhThucDauTu?.elements.filter(
              (el) => el.ten === item.hinhThucDauTu
            );
            if (checkHinhThucDauTu && !checkHinhThucDauTu.length) {
              errorMessages.push('Hình thức đầu tư không khớp với danh mục');
              errorList.hinhThucDauTu = true;
            }
          }
          if (item.doiTuongKyHopDong) {
            const checkDoiTuongKyHopDong = listDataDoiTuongKyHopDong?.elements.filter(
              (el) => el.ten === item.doiTuongKyHopDong
            );
            if (checkDoiTuongKyHopDong && !checkDoiTuongKyHopDong.length) {
              errorMessages.push('Đối tượng ký hợp đồng không khớp với danh mục');
              errorList.doiTuongKyHopDong = true;
            }
          }
          if (item.hinhThucThanhToan) {
            const checkHinhThucThanhToan = listDataHinhThucThanhToan?.elements.filter(
              (el) => el.ten === item.hinhThucThanhToan
            );
            if (checkHinhThucThanhToan && !checkHinhThucThanhToan.length) {
              errorMessages.push('Hình thức thanh toán không khớp với danh mục');
              errorList.hinhThucThanhToan = true;
            }
          }
          if (item.thueVAT) {
            const checkThueVAT = listDataThueVAT?.elements.filter(
              (el) => el.soThue === Number(item.thueVAT)
            );
            if (checkThueVAT && !checkThueVAT.length) {
              errorMessages.push('Thuế VAT không khớp với danh mục');
              errorList.thueVAT = true;
            }
          }
          if (item.loaiTramVhkt) {
            const checkloaiTramVhkt = listDataLoaiTramVhkt?.elements.filter(
              (el) => el.ten === item.loaiTramVhkt
            );
            if (checkloaiTramVhkt && !checkloaiTramVhkt.length) {
              errorMessages.push('Phân loại trạm (vhkt) không khớp với danh mục');
              errorList.loaiTramVhkt = true;
            }
          }

          if (item.loaiPhongMay) {
            const checkloaiPhongMay = listDataLoaiPhongMay?.elements.filter(
              (el) => el.ten === item.loaiPhongMay
            );
            if (checkloaiPhongMay && !checkloaiPhongMay.length) {
              errorMessages.push('Loại phòng máy không khớp với danh mục');
              errorList.loaiPhongMay = true;
            }
          }
          if (item.loaiPhongMayPhatDien) {
            const checkloaiPhongMayPhatDien = listDataLoaiPhongMayPhatDien?.elements.filter(
              (el) => el.ten === item.loaiPhongMayPhatDien
            );
            if (checkloaiPhongMayPhatDien && !checkloaiPhongMayPhatDien.length) {
              errorMessages.push('Loại phòng máy phát điện không khớp với danh mục');
              errorList.loaiPhongMayPhatDien = true;
            }
          }
          if (item.khoanMuc) {
            const checkKhoanMuc = listDataKhoanMuc?.elements.filter(
              (el) => el.ma === item.khoanMuc
            );
            if (checkKhoanMuc && !checkKhoanMuc.length) {
              errorMessages.push('Khoản mục không khớp với danh mục');
              errorList.khoanMuc = true;
            }
          }
          if (item.donViDungChung) {
            const checkDonViDungChung = listDataDonViDungChung?.elements.filter(
              (el) => el.ten === item.donViDungChung
            );
            if (checkDonViDungChung && !checkDonViDungChung.length) {
              errorMessages.push('Đơn vị dùng chung không khớp với danh mục');
              errorList.donViDungChung = true;
            }
          }
          // Check dữ liệu nhập sai
          if (item.chuKyThanhToan) {
            const checkDataValidInput = checkPaymentCycle(item.chuKyThanhToan);
            if (!checkDataValidInput) {
              errorMessages.push('Chu kỳ thanh toán có dạng "1 năm 6 tháng 5 ngày"');
              errorList.chuKyThanhToan = true;
            }
          }
          if (item.donViDungChung || item.thoiDiemPhatSinh || item.ngayLapDatThietBi) {
            if (item.loaiHangMucCsht === '') {
              errorMessages.push('Loại hạng mục csht là trường bắt buộc');
              errorList.loaiHangMucCsht = true;
            }
            if (item.maTramDonViDungChung === '') {
              errorMessages.push('Mã trạm đơn vị dùng chung là trường bắt buộc');
              errorList.maTramDonViDungChung = true;
            }
          }
          if (item.loaiHangMucCsht) {
            const checkLoaiHangMucCsht = listDataLoaiHangMucCsht?.elements.filter(
              (el) => el.ten === item.loaiHangMucCsht
            );
            if (checkLoaiHangMucCsht && !checkLoaiHangMucCsht.length) {
              errorMessages.push('Loại hạng mục CSHT không khớp với danh mục');
              errorList.loaiHangMucCsht = true;
            }
          }
          return {
            ...item,
            errors: {
              status: errorList,
              message: errorMessages,
            },
          };
        });
        setTransFormData(tempData);
        if (tempData.length) {
          const filterDataValid = tempData.filter((item) => !item.errors.message.length);
          // transform data import
          const dataDanhMuc = {
            dataTram: listDataTram ? listDataTram.elements : [],
            dataPhongDai: pdOptions,
            dataTo: listDataTo ? listDataTo.elements : [],
            dataTinh: listDataTinh ? listDataTinh.elements : [],
            dataHuyen: listDataHuyen ? listDataHuyen.elements : [],
            dataXa: listDataXa ? listDataXa?.elements : [],
            dataKhuVuc: listDataKhuVuc ? listDataKhuVuc.elements : [],
            dataDoiTuongKyHopDong: listDataDoiTuongKyHopDong
              ? listDataDoiTuongKyHopDong.elements
              : [],
            dataHinhThucDauTu: listDataHinhThucDauTu ? listDataHinhThucDauTu.elements : [],
            dataHinhThucKyHopDong: listDataHinhThucKyHopDong
              ? listDataHinhThucKyHopDong.elements
              : [],
            dataHinhThucThanhToan: listDataHinhThucThanhToan
              ? listDataHinhThucThanhToan.elements
              : [],
            dataLoaiCotAnten: listDataLoaiCotAnten ? listDataLoaiCotAnten.elements : [],
            dataLoaiCsht: listDataLoaiCsht ? listDataLoaiCsht.elements : [],
            dataLoaiThietBiRan: listDataLoaiThietBiRan ? listDataLoaiThietBiRan.elements : [],
            dataLoaiTram: listDataLoaiTram ? listDataLoaiTram.elements : [],
            dataThueVAt: listDataThueVAT ? listDataThueVAT.elements : [],
            dataHDPhuTro: listDataLoaiHDPhuTro ? listDataLoaiHDPhuTro.elements : [],
            dataLoaiPhongMay: listDataLoaiPhongMay ? listDataLoaiPhongMay.elements : [],
            dataLoaiPhongMayPhatDien: listDataLoaiPhongMayPhatDien
              ? listDataLoaiPhongMayPhatDien.elements
              : [],
            dataLoaiTramVhkt: listDataLoaiTramVhkt ? listDataLoaiTramVhkt.elements : [],
            dataLoaiHangMucCsht: listDataLoaiHangMucCsht ? listDataLoaiHangMucCsht.elements : [],
            dataKhoanMuc: listDataKhoanMuc ? listDataKhoanMuc.elements : [],
            dataDonViDungChung: listDataDonViDungChung ? listDataDonViDungChung.elements : [],
          };
          const transformDataImport = filterDataValid.map((item) => {
            const result = getTransFormDataImportHopDong(item, dataDanhMuc, 'MAT_BANG');
            return result;
          });
          onDataValid(transformDataImport);
        }
      }
    };
    transFormDataWaiting();
    setIsTransformed(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    listDataDoiTuongKyHopDong?.elements,
    listDataHinhThucDauTu?.elements,
    listDataHinhThucKyHopDong?.elements,
    listDataHinhThucThanhToan?.elements,
    listDataHuyen?.elements,
    listDataKhuVuc?.elements,
    listDataLoaiCotAnten?.elements,
    listDataLoaiCsht?.elements,
    listDataLoaiThietBiRan?.elements,
    listDataLoaiTram?.elements,
    listDataThueVAT?.elements,
    listDataTinh?.elements,
    listDataTo?.elements,
    listDataTram?.elements,
    listDataXa?.elements,
    listDataHopDong?.elements,
    listDataLoaiPhongMay?.elements,
    listDataLoaiPhongMayPhatDien?.elements,
    listDataLoaiTramVhkt?.elements,
    listDataKhoanMuc?.elements,
    listDataDonViDungChung?.elements,
    pdOptions,
  ]);
  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: isTransformed ? [] : transFormData,
        comparator: getComparator(order, orderBy),
        filterStatus,
      }),
    [isTransformed, transFormData, order, orderBy, filterStatus]
  );
  const isFiltered = filterStatus !== '';
  const isNotFound = !dataFiltered.length && filterStatus !== '';
  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };
  const handleResetFilter = () => {
    setFilterStatus('');
  };
  const handleRefetchData = () => {
    refetchDoiTuongKyHopDong();
    refetchHinhThucDauTu();
    refetchHinhThucKyHopDong();
    refetchHinhThucThanhToan();
    refetchHopDong();
    refetchLoaiCotAnten();
    refetchLoaiCsht();
    refetchLoaiHDPhuTro();
    refetchLoaiHangMucCsht();
    refetchLoaiPhongMay();
    refetchLoaiPhongMayPhatDien();
    refetchLoaiThietBiRan();
    refetchLoaiTram();
    refetchLoaiTramVhkt();
    refetchPhongDai();
    refetchTHuyen();
    refetchThueVAT();
    refetchTinh();
    refetchTo();
    refetchTram();
    refetchTramKhuVuc();
    refetchXa();
    refetchKhoanMuc();
    refetchDonViDungChung();
  };
  return (
    <Card>
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        sx={{ px: 2.5, py: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TimelineDot color="primary" />
            <Typography>
              {transFormData.length &&
                transFormData.filter((item) => !item.errors.message.length).length}{' '}
              dòng dữ liệu hợp lệ
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <TimelineDot color="warning" />
            <Typography>
              {transFormData.length &&
                transFormData.filter((item) => item.errors.message.length).length}{' '}
              dòng dữ liệu không hợp lệ
            </Typography>
          </Stack>
        </Box>
        <Stack
          spacing={2}
          alignItems="center"
          direction={{
            xs: 'column',
            sm: 'row',
          }}
        >
          <TextField
            fullWidth
            select
            value={filterStatus}
            onChange={handleFilterStatus}
            label="Trạng thái"
            SelectProps={{
              MenuProps: {
                PaperProps: {
                  sx: {
                    maxHeight: 260,
                  },
                },
              },
            }}
            sx={{
              minWidth: { sm: 240 },
              textTransform: 'inherit',
            }}
          >
            {optionType.map((option) => (
              <MenuItem
                key={option}
                value={option}
                sx={{
                  mx: 1,
                  borderRadius: 0.75,
                  typography: 'body2',
                  textTransform: 'capitalize',
                }}
              >
                {OPTION_STATUS[option] || option}
              </MenuItem>
            ))}
          </TextField>
          {isFiltered && (
            <LoadingButton
              color="error"
              sx={{ flexShrink: 0 }}
              onClick={handleResetFilter}
              disabled={isTransformed}
              startIcon={<Iconify icon="eva:refresh-outline" />}
            >
              Làm mới
            </LoadingButton>
          )}
          <Button
            color="success"
            variant="contained"
            sx={{ flexShrink: 0 }}
            onClick={() => handleRefetchData()}
            startIcon={<Iconify icon="eva:refresh-outline" />}
          >
            Làm mới dữ liệu
          </Button>
        </Stack>
      </Stack>
      {transFormData.length > 0 ? (
        <TableContainer sx={{ maxHeight: 640 }}>
          <Table size={dense ? 'small' : 'medium'} stickyHeader sx={{ minWidth: 800 }}>
            <TableHeadCustomColumnGroup
              order="asc"
              headLabelColumnGroup={
                transFormData.length &&
                transFormData.filter((item) => item.errors.message.length).length
                  ? TABLE_HEADER_IMPORT_HOP_DONG_GROUP_COLUMN
                  : TABLE_HEADER_IMPORT_HOP_DONG_GROUP_COLUMN_DATA_VALID
              }
              headLabel={
                transFormData.length &&
                transFormData.filter((item) => item.errors.message.length).length
                  ? TABLE_HEAD_IMPORT_HOP_DONG
                  : TABLE_HEAD_IMPORT_HOP_DONG.filter((item) => item.id !== 'chiTietLoi')
              }
              isNumIndex
              isStickyActionHead
              rowCount={dataFiltered.length}
              numSelected={selected.length}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <CheckImportHopDongTableRow
                    headLabel={
                      transFormData.length &&
                      transFormData.filter((item) => item.errors.message.length).length
                        ? TABLE_HEAD_IMPORT_HOP_DONG
                        : TABLE_HEAD_IMPORT_HOP_DONG.filter((item) => item.id !== 'chiTietLoi')
                    }
                    no={index}
                    key={row.dongSo.toString() + row.soHopDong.toString()}
                    row={row}
                    selected={selected.includes(row.dongSo.toString())}
                    onSelectRow={() => onSelectRow(row.dongSo.toString())}
                  />
                ))}
              <TableNoData
                title={
                  !isFiltered ? 'Dữ liệu import đang trống' : 'Không tìm thấy dữ liệu được tìm kiếm'
                }
                isNotFound={isNotFound}
              />
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableSkeleton countRow={rowsPerPage} />
      )}
      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        onChangeDense={onChangeDense}
      />
    </Card>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterStatus,
}: {
  inputData: IImportHopDong[];
  comparator: (a: any, b: any) => number;
  filterStatus: string;
}) {
  if (!inputData.length) return [];
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterStatus === 'HOP_LE') {
    inputData = inputData.filter((el) => !el.errors.message.length);
  }
  if (filterStatus === 'KHONG_HOP_LE') {
    inputData = inputData.filter((el) => el.errors.message.length);
  }
  return inputData;
}
