import { ViolationRecord } from "../types.ts";

const generateRecordsTable = (records: ViolationRecord[]): string => {
  if (records.length === 0) {
    return "<p>Tidak ada catatan pelanggaran untuk ditampilkan.</p>";
  }

  const tableRows = records
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(record => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 0.75rem; text-align: left;">${new Date(record.date).toLocaleDateString('id-ID')}</td>
        <td style="padding: 0.75rem; text-align: left;">${record.studentName}</td>
        <td style="padding: 0.75rem; text-align: left;">${record.studentClass}</td>
        <td style="padding: 0.75rem; text-align: left;">${record.gender}</td>
        <td style="padding: 0.75rem; text-align: left;">${record.violations.join(', ')}</td>
        <td style="padding: 0.75rem; text-align: center;">${record.violations.length}</td>
      </tr>
    `).join('');

  return `
    <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; margin-top: 2rem; border-bottom: 2px solid #D1D5DB; padding-bottom: 0.5rem;">Detail Catatan Pelanggaran</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 0.875rem;">
      <thead>
        <tr style="background-color: #F3F4F6; font-weight: 600;">
          <th style="padding: 0.75rem; text-align: left;">Tanggal</th>
          <th style="padding: 0.75rem; text-align: left;">Nama Siswa</th>
          <th style="padding: 0.75rem; text-align: left;">Kelas</th>
          <th style="padding: 0.75rem; text-align: left;">Gender</th>
          <th style="padding: 0.75rem; text-align: left;">Jenis Pelanggaran</th>
          <th style="padding: 0.75rem; text-align: center;">Jumlah</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};


export const printAnalysisReport = (analysisContent: string, teacherName: string, records: ViolationRecord[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Gagal membuka jendela cetak. Mohon izinkan pop-up untuk situs ini.");
    return;
  }

  const reportDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  
  const recordsTableHtml = generateRecordsTable(records);

  const analysisHtml = analysisContent
    .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
    .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
    .replace(/`{1,3}(.*?)`{1,3}/g, '<code>$1</code>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem; margin-top: 1.25rem; border-bottom: 2px solid #D1D5DB; padding-bottom: 0.5rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.875rem; font-weight: 800; margin-bottom: 1rem; margin-top: 1.5rem;">$1</h1>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 1.5rem; margin-bottom: 0.25rem;">$1</li>')
    .replace(/(<li.*>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
    .replace(/\n/g, '<br />');

  printWindow.document.write(`
      <html><head><title>Laporan Analisis Pelanggaran</title>
      <style>
        body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2rem; color: #111827; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
      </head><body>
          <header style="text-align: center; margin-bottom: 2rem; border-bottom: 1px solid #D1D5DB; padding-bottom: 1rem;">
            <h1 style="font-size: 1.5rem; font-weight: bold;">Laporan Pelanggaran dan Analisis Siswa</h1>
            <p style="font-size: 0.875rem; color: #4B5563;">Data Kedisiplinan per Tanggal ${reportDate}</p>
          </header>
          <main>
            ${recordsTableHtml}
            <div>${analysisHtml}</div>
          </main>
          <footer style="margin-top: 5rem; text-align: right; font-size: 0.875rem;">
              <p>Mengetahui,</p>
              <p style="margin-top: 4rem; font-weight: bold; text-decoration: underline;">${teacherName}</p>
              <p>Guru Piket</p>
          </footer>
      </body></html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { 
    printWindow.print(); 
    printWindow.close(); 
  }, 500);
};