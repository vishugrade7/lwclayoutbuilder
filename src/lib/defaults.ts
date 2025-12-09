import type { Row, Column } from './types';
import { generateId } from './utils';

export const createNewColumn = (): Column => ({
  id: generateId(),
  size: 3,
  sizeSmall: 12,
  sizeMedium: 6,
  padding: 'slds-p-around_small',
  type: 'Default',
  deviceSpecific: false,
});

export const DEFAULT_LAYOUT: Row[] = [
  {
    id: generateId(),
    columns: [
      {
        id: generateId(),
        size: 12,
        sizeSmall: 12,
        sizeMedium: 12,
        padding: 'slds-p-around_small',
        type: 'Default',
        deviceSpecific: false,
      },
    ],
    horizontalAlignment: 'start',
    verticalAlignment: 'start',
    pullBoundaries: 'none',
    multipleRows: false,
  },
];
