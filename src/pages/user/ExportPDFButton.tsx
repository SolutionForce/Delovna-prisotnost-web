import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { User } from "../../modules/interfaces/user";
import pdfReportTemplate from "../../modules/functions/pdfTemplates/pdfReportTemplate";
// @ts-ignore
import html2pdf from "html2pdf.js";
import { auth } from "../../firebase";

enum Action {
  download = "download",
  sendToUser = "sendToUser",
}

interface EmailSend {
  recipientUserId: string;
  subject: string;
  message: string;
}

export const ExportPDFButton = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const reportName = "Employee report.pdf";

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const createPDF = () => {
    const htmlContent = pdfReportTemplate(user);

    return html2pdf()
      .set({
        margin: 3,
        filename: reportName,
        jsPDF: { format: "letter", orientation: "landscape" },
      })
      .from(htmlContent);
  };

  const sendOverEmail = async (recipientUserId: string) => {
    const emailData: EmailSend = {
      recipientUserId: recipientUserId,
      subject: "Report",
      message: `Hello.
      
This email was automatically sent to you. Your PDF report is in the attachment.
      `,
    };

    try {
      const pdfBlob = await createPDF().output("blob");
      const pdfFile = new File([pdfBlob], reportName);

      const formData = new FormData();
      formData.append("recipientUserId", emailData.recipientUserId);
      formData.append("subject", emailData.subject);
      formData.append("message", emailData.message);
      const files: File[] = [pdfFile];
      files.forEach((file) => formData.append("attachments", file));

      if (!auth.currentUser) {
        console.warn("User should be logged in");
        return;
      }

      const idToken = await auth.currentUser.getIdToken(true);
      const headers = {
        auth: idToken,
      };
      const response = await fetch(
        "https://us-central1-rvir-1e34e.cloudfunctions.net/api/emails",
        {
          method: "POST",
          headers: headers,
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          "Network response was not ok: " +
            response.status +
            " " +
            (await response.text())
        );
      }

      // const result = await response.json();
      // console.log('Email sent successfully:', result);
    } catch (error) {
      alert("PDF report could not be sent.");
      console.error("Error sending email: ", error);
    }
  };

  const exportToPDF = (action: Action) => {
    if (action === Action.download) {
      createPDF().save();
      return;
    }

    if (action === Action.sendToUser) {
      sendOverEmail(user.uid);
      return;
    }

    console.warn(`Exporting to pdf: no action set`);
  };

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-gray-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
        onClick={openDialog}
      >
        <ArrowDownCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        Export PDF
      </button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ArrowDownCircleIcon
                        className="h-6 w-6 text-gray-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Export PDF
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          How do you want to export the PDF?
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        exportToPDF(Action.sendToUser);
                        closeDialog();
                      }}
                    >
                      Send to Employee
                    </button>
                    <button
                      type="button"
                      className="mt-3  ml-4 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={() => {
                        exportToPDF(Action.download);
                        closeDialog();
                      }}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={closeDialog}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
