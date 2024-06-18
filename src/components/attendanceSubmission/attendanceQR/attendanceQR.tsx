import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { auth } from '../../../firebase';
import { ArrowPathIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { authenticator } from "otplib";
import { optionsOfCodeTOTP } from '../../../modules/constants/securityConstants';
import { BACKEND_BASE_URL } from '../../../modules/constants/api';

export default function AttendanceQR() {
  const [textQR, setTextQR] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  authenticator.options = optionsOfCodeTOTP;

  const getSecretTOTP = async () => {
    if (!auth.currentUser) {
      setErrorText("For this action you have to be logged in.")
      return;
    }

    setLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);

      const headers = {
        'auth': idToken,
      };

      const response = await fetch(BACKEND_BASE_URL + "codeAuthentication/secrettotp", {
        method: 'GET',
        headers: headers
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      sessionStorage.setItem('key', result.secretTOTP);
      createTOTPCode(result.secretTOTP);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // TOTP: Time-based One-time Password
  const createTOTPCode = (secret: string) => {
    setTextQR(authenticator.generate(secret));
  }

  useEffect(() => {
    const secretTOTP = sessionStorage.getItem('key');
    if(secretTOTP===null || secretTOTP==='')
      return;
    
    createTOTPCode(secretTOTP);
    const intervalId = setInterval(() => {
      console.log("Hey")
      createTOTPCode(secretTOTP);
    }, 10000); // 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div className="text-center">
      <button
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={getSecretTOTP}
        disabled={loading}
      >
        {loading && <ArrowPathIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true" style={{ animation: "spin 1s infinite linear" }} />}
        {!loading && <QrCodeIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true"/>}
        {textQR === '' && <span>Get QR code</span>}
        {textQR !== '' && <span>Reload QR code</span>}
      </button>
      {textQR !== '' && <QRCodeCanvas value={textQR} style={{ width: "15em", height: "100%", border: "0.5em solid white" }} />}
      {errorText !== '' && <div style={{ color: "red" }}>{errorText}</div>}
    </div>
  );

  // Add button to Log out
};  