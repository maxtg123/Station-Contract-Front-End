import { Autocomplete, Box, Link, TextField, Typography } from '@mui/material';
import equal from 'fast-deep-equal';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IHopDongHangMucTramForm } from 'src/@types/hopdong';
import { IHopDongForm } from 'src/@types/hopdongmatbang';
import { useCreateHopDongContext } from 'src/context/hop-dong-mat-bang/createHopDongContext';

const ChiTietTramDialog = dynamic(
  () => import('../../components/hop-dong/tram-list/ChiTietTramDialog')
);

type OptionType = {
  id: number;
  ma: string;
  maDTXD: string;
  maErp: string;
};

type Props = {
  index: number;
  name: 'maTram' | 'maDTXD';
  fieldHangMuc: IHopDongHangMucTramForm;
};
const MaTramField = ({ index, name, fieldHangMuc }: Props) => {
  const {
    state: { tramOptions, hopDong },
  } = useCreateHopDongContext();

  const { control, setValue } = useFormContext<IHopDongForm>();

  const [openChiTietTram, setOpenChiTietTram] = useState<boolean>(false);
  const [opts, setOpts] = useState<OptionType[]>([]);

  useEffect(() => {
    const _opts = tramOptions.filter((dt) => (name === 'maTram' ? dt.ma : dt.maDTXD));
    if (!equal(_opts, opts)) {
      setOpts(_opts);
    }
  }, [tramOptions, name, opts]);

  const isDisabled =
    (hopDong?.trangThaiHopDong === 'HOAT_DONG' ||
      hopDong?.trangThaiHopDong === 'CHO_PHE_DUYET_PHU_LUC') &&
    fieldHangMuc.status === 'old';
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="overline" component="p" gutterBottom sx={{ textTransform: 'none' }}>
        {name === 'maTram' ? 'Mã trạm' : 'Mã trạm ĐTXD'}
        {` `}
        {!fieldHangMuc.tram.ma && !fieldHangMuc.tram.maDTXD && (
          <span style={{ color: '#FF0000' }}>(*)</span>
        )}
      </Typography>
      <Controller
        name={`hangMucs.${index}.tram.id`}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <Autocomplete
              // {...field}
              sx={{ mb: 1 }}
              options={opts}
              getOptionLabel={(option: OptionType | string) =>
                (option as OptionType)[name === 'maTram' ? 'ma' : 'maDTXD']
              }
              disabled={isDisabled}
              onChange={(event, newValue) => {
                if (!newValue) {
                  setValue(`hangMucs.${index}.tram`, { id: '', ma: '', maDTXD: '', maErp: '' });
                } else {
                  setValue(`hangMucs.${index}.tram`, {
                    id: newValue?.id,
                    ma: newValue?.ma,
                    maDTXD: newValue?.maDTXD,
                    maErp: newValue?.maErp,
                  });
                }
              }}
              value={
                fieldHangMuc.tram?.id
                  ? {
                      id: fieldHangMuc.tram.id,
                      ma: fieldHangMuc.tram.ma,
                      maDTXD: fieldHangMuc.tram.maDTXD,
                      maErp: fieldHangMuc.tram.maErp,
                    }
                  : null
              }
              renderInput={(params) => (
                <TextField
                  hiddenLabel
                  error={!!error && name === 'maTram'}
                  helperText={error && name === 'maTram' ? error?.message : ''}
                  {...params}
                  {...field}
                />
              )}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {name === 'maTram' ? option.ma : option.maDTXD}
                  </li>
                );
              }}
            />
          );
        }}
      />

      {fieldHangMuc.tram.id && (
        <Link
          href="#"
          variant="subtitle2"
          onClick={() => setOpenChiTietTram(true)}
          sx={{ ml: 1.5 }}
        >
          Xem chi tiết trạm
        </Link>
      )}

      {openChiTietTram && fieldHangMuc.tram.id && (
        <ChiTietTramDialog
          open={openChiTietTram}
          onClose={() => setOpenChiTietTram(false)}
          id={fieldHangMuc.tram.id}
        />
      )}
    </Box>
  );
};

export default MaTramField;
