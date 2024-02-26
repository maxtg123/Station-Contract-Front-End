export interface ChipData {
  key: string;
  label: string;
}

export type ICustomChipProps = {
  data: ChipData[];
  title: string;
  onDeletedChipTab?: VoidFunction;
  onDeletedChipMultiFilter?: VoidFunction;
};
