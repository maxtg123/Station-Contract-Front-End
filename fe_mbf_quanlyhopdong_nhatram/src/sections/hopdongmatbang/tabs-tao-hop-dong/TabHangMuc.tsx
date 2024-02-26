import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import { memo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import Iconify from 'src/components/iconify/Iconify';
import DienKhoan from '../components/DienKhoan';
import KyThanhToan from '../components/KyThanhToan';
import PhuTro from '../components/PhuTro';
import GiaThueField from '../fields/GiaThueField';
import IsDungChungFiled from '../fields/IsDungChungFiled';
import MaTramErpField from '../fields/MaTramErpField';
import MaTramField from '../fields/MaTramField';
import NgayBatDauThanhToanField from '../fields/NgayBatDauThanhToanField';

const TabDungChung = dynamic(() => import('./TabDungChung'), { ssr: false });

const TabHangMuc = () => {
  const [expandedPanels, setExpandedPanels] = useState<string[]>([`tram-0`]);

  const { control, watch } = useFormContext<IHopDongForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'hangMucs',
  });
  const watchHangMucs = watch('hangMucs');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchHangMucs[index],
    };
  });

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    if (!panel) return;
    if (isExpanded) {
      setExpandedPanels([...expandedPanels, panel]);
    } else {
      setExpandedPanels(expandedPanels.filter((item) => item !== panel));
    }
  };

  const handleThemhangMuc = () => {
    append({
      status: 'new',
      tram: {
        id: '',
        ma: '',
        maErp: '',
        maDTXD: '',
      },
      giaThueTram: 0,
      dienKhoan: {
        added: false,
        gia: 0,
      },
      phuTroList: [],
      hopDongKyThanhToanList: [],
      ngayBatDauTT: new Date(),
      isDungChung: false,
      loaiHangMucCsht: null,
      maDonViDungChung: '',
      donViDungChung: null,
      thoiDiemPhatSinh: null,
      ngayLapDatThietBi: null,
      ngayBatDauDungChung: null,
      ngayKetThucDungChung: null,
      filesDungChung: [],
    });
    setExpandedPanels([...expandedPanels, `tram-${controlledFields.length}`]);
  };

  const handleXoaHangMuc = (index: number) => {
    remove(index);
  };

  return (
    <Box>
      {controlledFields.map((field, index) => {
        const kAccordion = `tram-${index}`;
        return (
          <Accordion
            key={field.id}
            expanded={expandedPanels.includes(kAccordion)}
            onChange={handleChange(kAccordion)}
          >
            <AccordionSummary
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
              id={`tram-${field.id}`}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="subtitle1">
                  Trạm {field?.tram?.ma ? field.tram.ma : field.tram.maDTXD}
                </Typography>
                {controlledFields.length > 1 && field.status === 'new' && (
                  <Button
                    onClick={() => handleXoaHangMuc(index)}
                    color="error"
                    size="small"
                    startIcon={<Iconify icon="eva:trash-2-outline" />}
                  >
                    Xoá
                  </Button>
                )}
              </Stack>
            </AccordionSummary>

            <AccordionDetails>
              <Stack direction="row" spacing={2} mb={2} alignItems="flex-start">
                <MaTramField index={index} name="maTram" fieldHangMuc={field} />
                <MaTramField index={index} name="maDTXD" fieldHangMuc={field} />
                <MaTramErpField index={index} fieldHangMuc={field} />
              </Stack>
              <Stack direction="row" spacing={2} mb={2} alignItems="flex-start">
                <NgayBatDauThanhToanField index={index} />
                <GiaThueField index={index} />
              </Stack>
              <KyThanhToan indexHangMuc={index} fieldHangMuc={field} />

              <DienKhoan indexHangMuc={index} fieldHangMuc={field} />
              <Divider sx={{ borderStyle: 'dashed' }} />
              <PhuTro indexHangMuc={index} />
              <Divider sx={{ borderStyle: 'dashed' }} />
              <IsDungChungFiled indexHangMuc={index} />
              {field.isDungChung && <TabDungChung indexHangMuc={index} filedHangMuc={field} />}
            </AccordionDetails>
          </Accordion>
        );
      })}

      <Box sx={{ m: 2 }}>
        <Button onClick={handleThemhangMuc} sx={{ width: 160, justifyContent: 'flex-start' }}>
          <Iconify icon="eva:plus-fill" />
          <span style={{ marginLeft: 10, textTransform: 'none' }}>Thêm trạm</span>
        </Button>
      </Box>
    </Box>
  );
};

export default memo(TabHangMuc);
