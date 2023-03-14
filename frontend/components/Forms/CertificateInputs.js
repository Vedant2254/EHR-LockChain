import { useState } from "react";
import CertificateInput from "./CustomInputs/CertificateInput";

export default function CertificateInputs({
  certificates,
  handleCertificateChange,
  handleCertificateDelete,
}) {
  const [certificateCount, setCertificateCount] = useState(certificates);

  function incrementCertificateCount() {
    setCertificateCount(certificateCount + 1);
  }

  function decrementCertificateCount() {
    certificateCount > 0 && setCertificateCount(certificateCount - 1);
    handleCertificateDelete();
  }

  return (
    <>
      <button onClick={incrementCertificateCount}>+</button>
      <button onClick={decrementCertificateCount}>-</button>
      {Array.from(Array(certificateCount)).map((_, index) => (
        <div key={index}>
          <br />
          <CertificateInput
            index={index}
            handleCertificateChange={(index, event) =>
              handleCertificateChange(index, event)
            }
          />
        </div>
      ))}
    </>
  );
}
