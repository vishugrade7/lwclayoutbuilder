export interface Column {
  id: string;
  size: number;
  sizeSmall: number;
  sizeMedium: number;
  deviceSpecific: boolean;
}

export type DeviceSize = 'size' | 'sizeSmall' | 'sizeMedium';

export interface Row {
  id: string;
  columns: Column[];
  horizontalAlignment:
    | 'start'
    | 'center'
    | 'end'
    | 'space-around'
    | 'space-between';
  verticalAlignment: 'start' | 'center' | 'end' | 'stretch';
  pullBoundaries: 'none' | 'small' | 'medium' | 'large';
  multipleRows: boolean;
  flexibility: 'default' | 'fluid';
  padding: string;
}
