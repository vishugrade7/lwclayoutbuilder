import type { Row, Column } from './types';
import { generateId } from './utils';

export const createNewColumn = (): Column => ({
  id: generateId(),
  size: 4,
  sizeSmall: 12,
  sizeMedium: 6,
  padding: 'slds-p-around_small',
  type: 'Default',
});

export const DEFAULT_LAYOUT: Row[] = [
  {
    id: generateId(),
    columns: [
      {
        id: generateId(),
        size: 4,
        sizeSmall: 12,
        sizeMedium: 4,
        padding: 'slds-p-around_small',
        type: 'Default',
      },
      {
        id: generateId(),
        size: 4,
        sizeSmall: 12,
        sizeMedium: 4,
        padding: 'slds-p-around_small',
        type: 'Default',
      },
      {
        id: generateId(),
        size: 4,
        sizeSmall: 12,
        sizeMedium: 4,
        padding: 'slds-p-around_small',
        type: 'Default',
      },
    ],
    horizontalAlignment: 'start',
    verticalAlignment: 'start',
    pullBoundaries: 'none',
    multipleRows: true,
  },
];
