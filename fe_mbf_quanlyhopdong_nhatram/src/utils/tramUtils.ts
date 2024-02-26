import { IHead } from 'src/@types/common';

export const getTransFormDataExportTram = (checked: IHead[]) => {
  const result: Record<string, boolean> = {
    maTram: true,
    maDTXD: true,
  };
  checked.forEach((item) => {
    result[item.id] = item.checked ?? false;
  });
  return result;
};
