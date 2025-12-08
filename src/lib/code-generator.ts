import type { Row } from './types';

const hAlignMap: Record<string, string> = {
  start: 'slds-grid_align-start',
  center: 'slds-grid_align-center',
  end: 'slds-grid_align-end',
  'space-around': 'slds-grid_space-around',
  'space-between': 'slds-grid_space-between',
};

const vAlignMap: Record<string, string> = {
  start: 'slds-grid_vertical-align-start',
  center: 'slds-grid_vertical-align-center',
  end: 'slds-grid_vertical-align-end',
  stretch: '',
};

const pullBoundaryMap: Record<string, string> = {
    none: '',
    small: 'slds-grid_pull-padded-small',
    medium: 'slds-grid_pull-padded-medium',
    large: 'slds-grid_pull-padded-large',
}

export function generateLwcHtml(rows: Row[]): string {
  let html = `<template>\n`;

  rows.forEach((row, rowIndex) => {
    const rowClasses = [
      'slds-grid',
      row.multipleRows ? 'slds-wrap' : '',
      hAlignMap[row.horizontalAlignment] || '',
      vAlignMap[row.verticalAlignment] || '',
      pullBoundaryMap[row.pullBoundaries] || '',
    ].filter(Boolean).join(' ');

    html += `    <div class="${rowClasses}">\n`;

    row.columns.forEach((col, colIndex) => {
      const colClasses = [
        'slds-col',
        col.padding,
        `slds-size_${col.size}-of-12`,
        `slds-small-size_${col.sizeSmall}-of-12`,
        `slds-medium-size_${col.sizeMedium}-of-12`,
      ].filter(Boolean).join(' ');

      html += `        <div class="${colClasses}">\n`;
      html += `            <div class="box">Column ${colIndex + 1}</div>\n`;
      html += `        </div>\n`;
    });

    html += `    </div>\n`;
    if (rowIndex < rows.length - 1) {
        html += `    <br />\n`
    }
  });

  html += `</template>\n`;
  return html;
}


export function generateLwcCss(): string {
    return `.box {
    background-color: #f3f3f3;
    border: 1px solid #d8dde6;
    padding: 0.5rem;
    text-align: center;
    color: #080707;
}`;
}
