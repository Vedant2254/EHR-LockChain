import { useState } from "react";
import CertificateInput from "./CertificateInput";

export default function CertificateInputs({
  certcount,
  handleCertificateChange,
  handleCertificateDelete,
}) {
  const [certificateCount, setCertificateCount] = useState(certcount);

  function incrementCertificateCount() {
    setCertificateCount(certificateCount + 1);
  }

  function decrementCertificateCount() {
    certificateCount > 0 && setCertificateCount(certificateCount - 1);
    handleCertificateDelete();
  }

  return (
    <>
      <button onClick={incrementCertificateCount} type="button">
        +
      </button>
      <button onClick={decrementCertificateCount} type="button">
        -
      </button>
      <br />
      {Array.from(Array(certificateCount)).map((_, index) => (
        <div key={index}>
          <br />
          <CertificateInput
            index={index}
            handleCertificateChange={(index, event) => handleCertificateChange(index, event)}
          />
        </div>
      ))}
    </>
  );
}
