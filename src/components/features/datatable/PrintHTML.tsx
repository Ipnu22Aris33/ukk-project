import { type ColumnDef } from '@tanstack/react-table';
import type { PrintConfig, MetaData } from './types';

const NAVY = '#1a3557';

interface PrintHTMLProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  meta?: { total: number; page: number; totalPages: number };
  config?: PrintConfig;
  paddingX?: number; // Prop untuk mengatur padding horizontal
}

function getNestedValue(obj: any, path: string): any {
  if (!path) return '';
  if (!path.includes('.')) return obj?.[path];
  try {
    return path.split('.').reduce((cur, key) => {
      if (cur === null || cur === undefined) return '';
      return cur[key];
    }, obj as any);
  } catch {
    return '';
  }
}

export function PrintHTML<T>({ columns, data, meta, config, paddingX = 16 }: PrintHTMLProps<T>) {
  const printColumns = columns.filter((col) => col.id !== 'actions');

  const getCellValue = (row: T, column: ColumnDef<T>, rowIndex: number): any => {
    if ('accessorKey' in column && column.accessorKey) return getNestedValue(row, column.accessorKey as string) ?? '-';
    if ('accessorFn' in column && column.accessorFn) return column.accessorFn(row, rowIndex) ?? '-';
    if (column.id) return getNestedValue(row, column.id) ?? '-';
    return '-';
  };

  const getHeaderText = (column: ColumnDef<T>): string => {
    if (typeof column.header === 'string') return column.header;
    if ('accessorKey' in column && column.accessorKey) return String(column.accessorKey);
    return column.id || '';
  };

  const today = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Cell padding yang konsisten
  const cellPadding = '8px 16px';
  const headerPadding = '10px 16px';

  return (
    <div
      style={{
        background: '#fff',
        fontFamily: 'serif',
        fontSize: '12px',
        color: '#1a1a1a',
        width: '100%',
        padding: `0 ${paddingX}px`,
      }}
    >
      {/* Kop Dokumen */}
      <div
        style={{
          borderBottom: '3px double #1a3557',
          paddingBottom: '14px',
          marginBottom: '14px',
          textAlign: 'center',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {config?.institution && (
          <p
            style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              margin: '0 0 2px',
            }}
          >
            {config.institution}
          </p>
        )}
        <p
          style={{
            fontSize: config?.institution ? '12px' : '15px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '0 0 2px',
          }}
        >
          {config?.title ?? 'Laporan Data'}
        </p>
        {config?.subtitle && <p style={{ fontSize: '11px', margin: '0 0 1px' }}>{config.subtitle}</p>}
        {config?.period && <p style={{ fontSize: '11px', margin: 0 }}>Periode: {config.period}</p>}
      </div>

      {/* Info Cetak */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '10px',
          color: '#555',
          marginBottom: '12px',
          padding: `0 ${paddingX}px`,
        }}
      >
        <span>Dicetak: {today}</span>
        {meta && <span>Total data: {meta.total.toLocaleString('id-ID')}</span>}
      </div>

      {/* Table */}
      <div
        style={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11px',
            tableLayout: 'auto',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  background: NAVY,
                  color: '#fff',
                  padding: headerPadding,
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderRight: '1px solid #2a4a6e',
                  width: '36px',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                No
              </th>
              {printColumns.map((col, index) => (
                <th
                  key={col.id || index}
                  style={{
                    background: NAVY,
                    color: '#fff',
                    padding: headerPadding,
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    borderRight: index < printColumns.length - 1 ? '1px solid #2a4a6e' : 'none',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  {getHeaderText(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    background: rowIndex % 2 === 0 ? '#fff' : '#F4F3F0',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <td
                    style={{
                      padding: cellPadding,
                      textAlign: 'center',
                      borderBottom: '0.5px solid #D8D7D3',
                      borderRight: '0.5px solid #D8D7D3',
                      color: '#555',
                      fontSize: '10px',
                    }}
                  >
                    {rowIndex + 1}
                  </td>
                  {printColumns.map((col, colIndex) => {
                    const value = getCellValue(row, col, rowIndex);
                    return (
                      <td
                        key={`${rowIndex}-${col.id || colIndex}`}
                        style={{
                          padding: cellPadding,
                          borderBottom: '0.5px solid #D8D7D3',
                          borderRight: colIndex < printColumns.length - 1 ? '0.5px solid #D8D7D3' : 'none',
                          color: '#1a1a1a',
                          wordBreak: 'break-word',
                        }}
                      >
                        {value !== null && value !== undefined ? String(value) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={printColumns.length + 1}
                  style={{
                    padding: '32px 16px',
                    textAlign: 'center',
                    color: '#999',
                    borderBottom: '0.5px solid #D8D7D3',
                  }}
                >
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tanda Tangan */}
      <div
        style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: '11px',
          fontFamily: 'serif',
          padding: `0 ${paddingX}px`,
        }}
      >
        <div style={{ textAlign: 'center', lineHeight: '1.9' }}>
          <p style={{ margin: 0 }}>
            {config?.institution ? `${config.institution}, ` : ''}
            {today}
          </p>
          <p style={{ margin: 0 }}>Penanggung Jawab</p>
          <div style={{ height: '56px' }} />
          <p
            style={{
              margin: 0,
              borderTop: '1px solid #1a1a1a',
              paddingTop: '3px',
              minWidth: '180px',
            }}
          >
            (.................................)
          </p>
        </div>
      </div>
    </div>
  );
}
