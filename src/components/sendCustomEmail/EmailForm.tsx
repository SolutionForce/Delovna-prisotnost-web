import React, { useState, ChangeEvent, FormEvent } from 'react';
import { auth } from '../../firebase';

interface EmailSend {
  recipientUserId: string;
  subject: string;
  message: string;
}

const EmailForm: React.FC = () => {
  const [emailData, setEmailData] = useState<EmailSend>({
    recipientUserId: '',
    subject: '',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmailData({ ...emailData, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('recipientUserId', emailData.recipientUserId);
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    files.forEach(file => formData.append('attachments', file));

    try {
      if(!auth.currentUser) {
        console.warn("User should be logged in");
        return;
      }

      const idToken = await auth.currentUser.getIdToken(true);
      const headers = {
        auth: idToken,
      };
      const response = await fetch('https://us-central1-rvir-1e34e.cloudfunctions.net/api/emails', {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok: '+response.status+" "+await response.text());
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Recipient User ID:
          <input type="text" name="recipientUserId" value={emailData.recipientUserId} onChange={handleInputChange} required />
        </label>
      </div>
      <div>
        <label>
          Subject:
          <input type="text" name="subject" value={emailData.subject} onChange={handleInputChange} required />
        </label>
      </div>
      <div>
        <label>
          Message:
          <textarea name="message" value={emailData.message} onChange={handleInputChange} required />
        </label>
      </div>
      <div>
        <label>
          Attachments:
          <input type="file" multiple onChange={handleFileChange} />
        </label>
      </div>
      <button type="submit">Send Email</button>
    </form>
  );
};

export default EmailForm;
