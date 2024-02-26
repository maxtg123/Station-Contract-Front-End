import { Box, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IFileData } from 'src/@types/file';
import { ILoaiFileHopDong } from 'src/@types/hopdong';
import ConfirmDialog from 'src/components/confirm-dialog/ConfirmDialog';
import { useDateRangePicker } from 'src/components/date-range-picker';
import DateRangePicker from 'src/components/date-range-picker/DateRangePicker';
import PdfDialog from 'src/components/dialogs/pdf/PdfDialog';
import { fileFormat } from 'src/components/file-thumbnail';
import Iconify from 'src/components/iconify/Iconify';
import Lightbox from 'src/components/lightbox/Lightbox';
import { getComparator, useTable } from 'src/components/table';
import {
  FileChangeViewButton,
  FileFilterButton,
  FileFilterName,
  FileFilterType,
  FileGridView,
  FileListView,
} from 'src/sections/file';
import FileFilterLoaiUpLoad from 'src/sections/file/filter/FileFilterLoaiUpLoad';
import { downloadZip, storagePath, urlToFile } from 'src/utils/fileUtils';
import { fTimestamp } from 'src/utils/formatTime';

type Props = {
  data: IFileData[];
  soHopDong: string;
};

const FILE_TYPE_OPTIONS = [
  'folder',
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
  'photoshop',
  'illustrator',
];
const FILE_DINH_KEM = 'file_dinh_kem';
const FILE_LOAI_UPLOAD_OPTIONS: ILoaiFileHopDong[] = [
  'FILE_HOP_DONG',
  'FILE_GIAY_TO_SO_HUU',
  'FILE_PHU_LUC',
  'FILE_DUNG_CHUNG',
];
export default function FileDinhKem({ data, soHopDong }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });
  const {
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    open: openPicker,
    onOpen: onOpenPicker,
    onClose: onClosePicker,
    onReset: onResetPicker,
    isSelected: isSelectedValuePicker,
    isError,
    shortLabel,
  } = useDateRangePicker(null, null);

  const [view, setView] = useState('list');
  const [selectedImage, setSelectedImage] = useState<number>(-1);
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState(data);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterLoaiUpload, setFilterLoaiUpload] = useState<string>('');
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [openPdfDialog, setOpenPdfDialog] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const fetchUrl = async () => {
      const promises = data.map(async (item) => {
        const temp = await urlToFile(`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}/${item.path}`);
        return {
          ...item,
          file: temp,
          id: item.id,
          createdAt: item.createdAt,
          path: item.path,
          loai: item.loai,
        };
      });
      const dataFileFromUrl = await Promise.all(promises);

      if (isMounted) {
        setTableData(dataFileFromUrl);
      }
    };

    fetchUrl();

    // Clean-up function
    return () => {
      isMounted = false;
    };
  }, [data]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterType,
    filterStartDate: startDate,
    filterEndDate: endDate,
    isError: !!isError,
    filterLoaiUpload,
  });

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterType) ||
    (!dataFiltered.length && !!filterLoaiUpload) ||
    (!dataFiltered.length && !!endDate && !!startDate);

  const isFiltered =
    !!filterName || !!filterType.length || (!!startDate && !!endDate) || !!filterLoaiUpload.length;

  const handleChangeView = (event: React.MouseEvent<HTMLElement>, newView: string | null) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleFilterName = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPage(0);
    setFilterName(event.target.value);
  };

  const handleChangeStartDate = (newValue: Date | null) => {
    table.setPage(0);
    onChangeStartDate(newValue);
  };

  const handleChangeEndDate = (newValue: Date | null) => {
    table.setPage(0);
    onChangeEndDate(newValue);
  };

  const handleFilterType = (type: string) => {
    const checked = filterType.includes(type)
      ? filterType.filter((value) => value !== type)
      : [...filterType, type];

    table.setPage(0);
    setFilterType(checked);
  };

  const handleFilterLoaiUpLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPage(0);
    setFilterLoaiUpload(event.target.value);
  };
  const handleDownloadMultiFile = (selected: string[]) => {
    const dataFileRows = tableData.filter((row) => selected.includes(row.id.toString()));
    downloadZip(
      `${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT}`,
      dataFileRows,
      soHopDong,
      FILE_DINH_KEM
    );
  };

  const handleClearAll = () => {
    if (onResetPicker) {
      onResetPicker();
    }
    setFilterName('');
    setFilterType([]);
    setFilterLoaiUpload('');
  };

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const imagesLightbox = data
    .filter((dt) => dt.path && fileFormat(dt.path) === 'image')
    .map((dt) => ({
      src: storagePath(dt.path),
    }));

  const handleOpenLightbox = (imageUrl: string) => {
    if (fileFormat(imageUrl) === 'pdf') {
      setPdfUrl(imageUrl);
      setOpenPdfDialog(true);
    } else {
      const imageIndex = imagesLightbox.findIndex((image) => image.src === imageUrl);
      setSelectedImage(imageIndex);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  return (
    <Box>
      <Stack
        spacing={2.5}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <Stack
          spacing={1}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'center' }}
          sx={{ width: 1 }}
        >
          <FileFilterName filterName={filterName} onFilterName={handleFilterName} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <>
              <FileFilterButton
                isSelected={!!isSelectedValuePicker}
                startIcon={<Iconify icon="eva:calendar-fill" />}
                onClick={onOpenPicker}
              >
                {isSelectedValuePicker ? shortLabel : 'Chọn ngày'}
              </FileFilterButton>

              <DateRangePicker
                variant="calendar"
                startDate={startDate}
                endDate={endDate}
                onChangeStartDate={handleChangeStartDate}
                onChangeEndDate={handleChangeEndDate}
                open={openPicker}
                onClose={onClosePicker}
                isSelected={isSelectedValuePicker}
                isError={isError}
              />
            </>

            <FileFilterType
              filterType={filterType}
              onFilterType={handleFilterType}
              optionsType={FILE_TYPE_OPTIONS}
              onReset={() => setFilterType([])}
            />
          </Stack>
          <FileFilterLoaiUpLoad
            filterLoaiUpload={filterLoaiUpload}
            onFilterLoaiUpLoad={handleFilterLoaiUpLoad}
            optionsType={FILE_LOAI_UPLOAD_OPTIONS}
          />
          {isFiltered && (
            <Button
              variant="soft"
              color="error"
              onClick={handleClearAll}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Làm mới
            </Button>
          )}
        </Stack>

        <FileChangeViewButton value={view} onChange={handleChangeView} />
      </Stack>

      {view === 'list' ? (
        <FileListView
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          isNotFound={isNotFound}
          onOpenConfirm={handleOpenConfirm}
          onViewLightBox={handleOpenLightbox}
        />
      ) : (
        <FileGridView
          table={table}
          data={tableData}
          dataFiltered={dataFiltered}
          onOpenConfirm={handleOpenConfirm}
          onViewLightBox={handleOpenLightbox}
        />
      )}
      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Tải xuống"
        content={
          <>
            Bạn có chắc chắn tải xuống <strong> {table.selected.length} </strong> file này?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDownloadMultiFile(table.selected);
              handleCloseConfirm();
            }}
          >
            Tải
          </Button>
        }
      />
      {pdfUrl !== '' ? (
        <PdfDialog
          open={openPdfDialog}
          onClose={() => {
            setOpenPdfDialog(false);
            setPdfUrl('');
          }}
          url={pdfUrl}
          title="File pdf"
        />
      ) : (
        <Lightbox
          index={selectedImage}
          slides={imagesLightbox}
          open={selectedImage >= 0}
          close={handleCloseLightbox}
        />
      )}
    </Box>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterType,
  filterLoaiUpload,
  filterStartDate,
  filterEndDate,
  isError,
}: {
  inputData: IFileData[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterType: string[];
  filterLoaiUpload: string;
  filterStartDate: Date | null;
  filterEndDate: Date | null;
  isError: boolean;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (file) => file.file?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterType.length) {
    inputData = inputData.filter((file) => filterType.includes(fileFormat(file.file?.type)));
  }
  if (filterLoaiUpload !== '') {
    inputData = inputData.filter((file) => file.loai === filterLoaiUpload);
  }

  if (filterStartDate && filterEndDate && !isError) {
    inputData = inputData.filter(
      (file) =>
        fTimestamp(file.createdAt) >= fTimestamp(filterStartDate) &&
        fTimestamp(file.createdAt) <= fTimestamp(filterEndDate)
    );
  }

  return inputData;
}
