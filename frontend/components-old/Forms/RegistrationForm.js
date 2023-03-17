import { useState } from "react";
import CertificateInput from "./CustomInputs/CertificateInput";
import FileInput from "./CustomInputs/FileInput";

const Inputs = ({ data, inputs, handleDataInputChange }) => {
  return Object.keys(inputs).map((input, index) => {
    const name = input;
    const type = inputs[input];
    return (
      <div key={index}>
        {type == "file" ? (
          <FileInput name={name} handleOnFileChange={handleDataInputChange} />
        ) : (
          <input
            name={name}
            type={type}
            value={data[name]}
            placeholder={name.replace(
              name.charAt(0),
              name.charAt(0).toUpperCase()
            )}
            onChange={handleDataInputChange}
          />
        )}
      </div>
    );
  });
};

const CertificateInputs = ({
  certcount,
  handleCertificateChange,
  handleCertificateDelete,
}) => {
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
            handleCertificateChange={(index, event) =>
              handleCertificateChange(index, event)
            }
          />
        </div>
      ))}
    </>
  );
};

export default function RegistrationForm({
  initialInputs,
  initialValues,
  certcount,
  submitIsDisabled,
  handleOnSubmit,
}) {
  const [data, setData] = useState(initialValues || {}); // stores inputname -> inputvalue mapping
  const [certificates, setCertificates] = useState([]);

  function handleDataInputChange(event) {
    let { name, value } = event.target;
    if (event.target.files) value = event.target.files[0];
    setData({ ...data, [name]: value });
  }

  function handleCertificateChange(index, event) {
    const certs = certificates;
    let { name, value } = event.target;
    if (event.target.files) value = event.target.files[0];
    certs[index] = { ...certs[index], [name]: value };
    setCertificates(certs);
  }

  function handleCertificateDelete() {
    const certs = certificates;
    setCertificates(certs);
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleOnSubmit({ ...data, certificates });
        }}
      >
        <Inputs
          data={data}
          inputs={initialInputs}
          handleDataInputChange={handleDataInputChange}
        />
        {certcount > 0 && (
          <>
            <p>Add Certificates</p>
            <CertificateInputs
              certcount={certcount}
              handleCertificateChange={handleCertificateChange}
              handleCertificateDelete={handleCertificateDelete}
            />
          </>
        )}
        <br />
        <button disabled={submitIsDisabled}>Submit</button>
      </form>
      <br />
      <br />
    </div>
  );
}
