import type { Row, Column } from './types';

export const createNewColumn = (id: string): Column => ({
  id,
  size: 3,
  sizeSmall: 12,
  sizeMedium: 6,
  padding: 'slds-p-around_small',
  type: 'Default',
  deviceSpecific: false,
});
