export interface Column {
  id: string;
  size: number;
  sizeSmall: number;
  sizeMedium: number;
  padding: string;
  type: string;
  deviceSpecific: boolean;
  flexibility: 'default' | 'auto' | 'shrink' | 'no-shrink' | 'grow' | 'no-grow' | 'no-flex';
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
}
