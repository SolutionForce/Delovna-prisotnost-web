import React from 'react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function DownloadPdfStatisticsReportButton(buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  /* const exportToPDF1 = () => {

    html2pdf().set({
      margin: 3,
      filename: 'Report.pdf',
      jsPDF: { format: 'letter', orientation: 'landscape' }
    }).from(htmlContent).save();
  }; */

  const exportToPDF = () => {
    const element = document.getElementById('statistics4pdf');
    if (element) {
      html2pdf(element, {
        margin: 1,
        filename: 'Statistics report.pdf',
        jsPDF: { format: 'letter', orientation: 'landscape' }
      });
    } else {
      console.error('Element not found');
    }
  };

  return (
    <button {...buttonProps} onClick={(e) => { exportToPDF(); buttonProps.onClick && buttonProps.onClick(e); }}>
      Statistics
    </button>
  );
};
