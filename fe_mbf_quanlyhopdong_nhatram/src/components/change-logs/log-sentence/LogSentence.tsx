import { Box, Typography } from '@mui/material';
import isUndefined from 'lodash/isUndefined';
import Label from 'src/components/label/Label';
import { fDate } from 'src/utils/formatTime';
import { IResultDiff, ITypeValue, getActionName } from 'src/utils/logUtils';

const valueByType = (type: ITypeValue, value: any): string => {
  if (value === null || value === '') return `""`;
  switch (type) {
    case 'date':
      if (value && typeof value === 'string') return fDate(value);
      break;
    case 'bool':
      if (value === true || value === 'true') return 'có';
      if (value === false || value === 'false') return 'không';
      break;
    case 'string':
      return value.toString();
    default:
      break;
  }
  return '';
};

type Props = {
  log: IResultDiff;
};
const LogSentence = ({ log }: Props) => {
  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}>
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {log.title}
        </Box>{' '}
        {getActionName(log.type)}
        {!isUndefined(log.oldValue) && log.oldValue !== '' && (
          <>
            {` `}
            <Label
              variant="soft"
              color="warning"
              sx={{
                lineHeight: 'unset',
                height: 'auto',
                textDecoration: 'line-through',
                whiteSpace: 'pre-line',
                textTransform: 'none',
              }}
            >
              {valueByType(log.typeValue, log.oldValue)}
            </Label>
          </>
        )}
        {!isUndefined(log.value) && (
          <>
            {` thành `}
            <Label
              variant="soft"
              color="success"
              sx={{
                lineHeight: 'unset',
                height: 'auto',
                whiteSpace: 'pre-line',
                textTransform: 'none',
              }}
            >
              {valueByType(log.typeValue, log.value)}
            </Label>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default LogSentence;
