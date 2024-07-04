import React from 'react';
import { User } from '../../../modules/interfaces/user';
import pdfMultipleUsersReportTemplate from '../../../modules/functions/pdfTemplates/pdfMultipleUsersReportTemplate';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export interface DownloadPdfUsersReportButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  users: User[];
}

export default function DownloadPdfUsersReportButton(props: DownloadPdfUsersReportButtonProps) {
  const {users, ...buttonProps} = props;
  const reportName = "Employees report.pdf";

  const exportToPDF = () => {
    const htmlContent = pdfMultipleUsersReportTemplate(users);

    html2pdf()
      .set({
        margin: 3,
        filename: reportName,
        jsPDF: { format: "letter", orientation: "landscape" },
      })
      .from(htmlContent).save();
  };

  return (
    <button {...buttonProps} onClick={(e) => { exportToPDF(); buttonProps.onClick && buttonProps.onClick(e); }}>
      Report of selected users
    </button>
  );
};
