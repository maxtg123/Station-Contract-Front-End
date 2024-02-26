import { Box, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify/Iconify';

// ----------------------------------------------------------------------

const PRIORITIZES_OPTIONS = [
  { value: 'LOW', label: 'Thấp', color: 'info' },
  { value: 'MEDIUM', label: 'Bình thường', color: 'warning' },
  { value: 'HEIGHT', label: 'Cao', color: 'error' },
] as const;

type Props = {
  prioritize: string;
  onChangePrioritize?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MucDoUuTienDamPhan({ prioritize, onChangePrioritize }: Props) {
  return (
    <RadioGroup
      row
      value={prioritize}
      onChange={(e) => {
        onChangePrioritize?.(e);
      }}
    >
      {PRIORITIZES_OPTIONS.map((option) => {
        const selected = option.value === prioritize;

        return (
          <Box key={option.value} sx={{ position: 'relative', mr: 1 }}>
            <Stack
              spacing={0.5}
              direction="row"
              alignItems="center"
              sx={{
                pl: '4px',
                pr: '10px',
                fontWeight: 'fontWeightBold',
                height: 28,
                fontSize: 12,
                borderRadius: 0.75,
                border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
                ...(selected && {
                  color: (theme) => theme.palette[option.color].main,
                  border: (theme) => `solid 1px ${theme.palette[option.color].main}`,
                  bgcolor: (theme) => alpha(theme.palette[option.color].main, 0.08),
                }),
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ width: 16, height: 16, mr: 0.5 }}
              >
                {selected ? (
                  <Iconify icon="eva:checkmark-fill" width={16} />
                ) : (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: (theme) => theme.palette[option.color].main,
                    }}
                  />
                )}
              </Stack>
              {option.label}
            </Stack>

            <FormControlLabel
              value={option.value}
              control={<Radio sx={{ display: 'none' }} />}
              label=""
              sx={{
                m: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
                cursor: onChangePrioritize ? 'pointer' : 'auto',
              }}
            />
          </Box>
        );
      })}
    </RadioGroup>
  );
}
