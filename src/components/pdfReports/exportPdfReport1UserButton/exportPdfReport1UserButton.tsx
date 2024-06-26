import React from 'react';
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import pdfReportTemplate from '../../../modules/functions/pdfTemplates/pdfReportTemplate';
import { User } from '../../../modules/interfaces/user';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export interface ExportPdfReport1UserButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  user: User;
}

const ExportPdfReport1UserButton: React.FC<ExportPdfReport1UserButtonProps> = ({ user, ...buttonProps }) => {
  const exportToPDF = () => {
    const htmlContent = pdfReportTemplate(user);

    html2pdf().set({
      margin: 3,
      filename: 'Report.pdf',
      jsPDF: { format: 'letter', orientation: 'landscape' }
    }).from(htmlContent).save();
  };

  return (
    <button {...buttonProps} onClick={(e) => { exportToPDF(); buttonProps.onClick && buttonProps.onClick(e); }}>
      <ArrowDownCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
      Export PDF
    </button>
  );
};

export default ExportPdfReport1UserButton;
