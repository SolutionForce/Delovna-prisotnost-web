import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { auth } from "../../../firebase";
import { ArrowPathIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { authenticator } from "otplib";
import { optionsOfCodeTOTP } from "../../../modules/constants/securityConstants";
import { BACKEND_BASE_URL } from "../../../modules/constants/api";

export default function AttendanceQR() {
  const [textQR, setTextQR] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  authenticator.options = optionsOfCodeTOTP;

  const getSecretTOTP = async () => {
    if (!auth.currentUser) {
      setErrorText("For this action you have to be logged in.");
      return;
    }

    setLoading(true);
    try {
      const idToken = await auth.currentUser.getIdToken(true);

      const headers = {
        auth: idToken,
      };

      const response = await fetch(
        BACKEND_BASE_URL + "codeAuthentication/secrettotp",
        {
          method: "GET",
          headers: headers,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      sessionStorage.setItem("key", result.secretTOTP);
      createTOTPCode(result.secretTOTP);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TOTP: Time-based One-time Password
  const createTOTPCode = (secret: string) => {
    setTextQR(authenticator.generate(secret));
  };

  useEffect(() => {
    const secretTOTP = sessionStorage.getItem("key");
    if (secretTOTP === null || secretTOTP === "") return;

    createTOTPCode(secretTOTP);
    const intervalId = setInterval(() => {
      createTOTPCode(secretTOTP);
    }, 10000); // 10 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="text-center">
      {auth.currentUser && (
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={getSecretTOTP}
          disabled={loading}
        >
          {loading && (
            <ArrowPathIcon
              className="h-5 w-5 mr-2 -ml-1 animate-spin"
              aria-hidden="true"
            />
          )}
          {!loading && (
            <QrCodeIcon className="h-5 w-5 mr-2 -ml-1" aria-hidden="true" />
          )}
          {textQR === "" ? (
            <span>Get QR code</span>
          ) : (
            <span>Reload QR code</span>
          )}
        </button>
      )}
      <div className="m-6">
        {textQR !== "" && (
          <QRCodeCanvas
            value={textQR}
            className="w-60 h-auto border-2 border-white"
          />
        )}
      </div>
      {errorText !== "" && <div className="m-4 text-red-500">{errorText}</div>}
    </div>
  );
}
