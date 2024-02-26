import { Typography } from '@mui/material';
import Link from 'next/link';
import { ReactNode } from 'react';
import { IModule, IThongBao } from 'src/@types/thongbao';
import Label from 'src/components/label/Label';
import { HOP_DONG_MAT_BANG } from 'src/constants/hopdongmatbang.constant';
import { getTrangThaiDamPhan, getTrangThaiPheDuyet } from 'src/utils/hopDongPheDuyetUtils';

const TAB_CHANGE = {
  pheDuyet: 'lich_su_phe_duyet',
  damPhan: 'dam_phan',
};
const LOAI_HOP_DONG = {
  matBang: {
    pathName: 'hop-dong-mat-bang',
    text: 'mặt bằng',
  },
  xaHoiHoa: {
    pathName: 'hop-dong-xa-hoi-hoa',
    text: 'xã hội hóa',
  },
};
export const getMessageThongBao = (data: IThongBao, module: IModule, href: string): ReactNode => {
  let result: ReactNode = '';
  let loaiHopDong = {
    pathName: '',
    text: '',
  };
  if (module === 'HOP_DONG') {
    const parserData = JSON.parse(data.content);
    /**
     * * Checked thông báo là loại hợp đồng nào
     * @param {
     * loai: MAT_BANG | XA_HOI_HOA
     * }:
     */
    if (parserData.data.loaiHopDong === 'MAT_BANG') {
      loaiHopDong = LOAI_HOP_DONG.matBang;
    }
    if (parserData.data.loaiHopDong === 'XA_HOI_HOA') {
      loaiHopDong = LOAI_HOP_DONG.xaHoiHoa;
    }
    if (data.action === 'XET_DUYET_TU_CHOI') {
      const colorText = getTrangThaiPheDuyet('TU_CHOI');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            từ chối
          </Label>{' '}
          xét duyệt hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.pheDuyet}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.pheDuyet}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else if (data.action === 'XET_DUYET_PHE_DUYET') {
      const colorText = getTrangThaiPheDuyet('PHE_DUYET');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            phê duyệt
          </Label>{' '}
          hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.pheDuyet}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.pheDuyet}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else if (data.action === 'XET_DUYET_GUI_LAI') {
      const colorText = getTrangThaiPheDuyet('CHO_PHE_DUYET');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            gửi lại
          </Label>{' '}
          phê duyệt hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.pheDuyet}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.pheDuyet}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else {
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã nhờ bạn xét duyệt hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.pheDuyet}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.pheDuyet}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    }
  }
  if (module === 'DAM_PHAN') {
    const parserData = JSON.parse(data.content);
    /**
     * * Checked thông báo là loại hợp đồng nào
     * @param {
     * loai: MAT_BANG | XA_HOI_HOA
     * }:
     */
    if (parserData.data.loaiHopDong === 'MAT_BANG') {
      loaiHopDong = LOAI_HOP_DONG.matBang;
    }
    if (parserData.data.loaiHopDong === 'XA_HOI_HOA') {
      loaiHopDong = LOAI_HOP_DONG.xaHoiHoa;
    }
    if (data.action === 'DAM_PHAN_TU_CHOI') {
      const colorText = getTrangThaiDamPhan('TU_CHOI');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            từ chối
          </Label>{' '}
          đàm phán hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.damPhan}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.damPhan}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else if (data.action === 'DAM_PHAN_PHE_DUYET') {
      const colorText = getTrangThaiDamPhan('PHE_DUYET');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            phê duyệt
          </Label>{' '}
          đàm phán hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.damPhan}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.damPhan}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else if (data.action === 'DAM_PHAN_GUI_NOI_DUNG_DAM_PHAN') {
      const colorText = getTrangThaiDamPhan('GUI_DAM_PHAN');
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã gửi{' '}
          <Label variant="filled" color={`${colorText.color}`}>
            nội dung đàm phán
          </Label>{' '}
          hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.damPhan}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.damPhan}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>
        </>
      );
    } else {
      result = (
        <>
          <Typography component="span" variant="subtitle1" sx={{ wordBreak: 'break-word' }}>
            {data.nguoiGui.email}
          </Typography>{' '}
          đã giao việc đàm phán hợp đồng {loaiHopDong.text}{' '}
          <Link
            href={`${href}?id=${parserData.data.id}&tab=${TAB_CHANGE.damPhan}`}
            as={`/${loaiHopDong.pathName}/${parserData.data.id}?tab=${TAB_CHANGE.damPhan}`}
            passHref
            style={{ color: '#3366FF', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Typography component="span" variant="subtitle1">
              {parserData.data.soHopDong}
            </Typography>
          </Link>{' '}
          cho bạn
        </>
      );
    }
  }
  return result;
};
