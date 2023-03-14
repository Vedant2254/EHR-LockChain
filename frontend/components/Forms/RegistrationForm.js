import { useState } from "react";
import AddInputForm from "./AddInputForm";
import CertificateInputs from "./CertificateInputs";
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

export default function RegistrationForm({
  initialInputs,
  certCount,
  submitIsDisabled,
  handleOnSubmit,
}) {
  const [data, setData] = useState({}); // stores inputname -> inputvalue mapping
  const [certificates, setCertificates] = useState([]);
  const [inputs, setInputs] = useState({}); // stores inputname -> inputtype mapping

  function handleDataInputChange(event) {
    let { name, value } = event.target;
    if (event.target.files) value = event.target.files[0];
    setData({ ...data, [name]: value });
  }

  function handleInputsInputChange(inputName, inputType) {
    setInputs({ ...inputs, [inputName]: inputType });
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
    certs.pop();
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
        <Inputs
          data={data}
          inputs={inputs}
          handleDataInputChange={handleDataInputChange}
        />
        <button disabled={submitIsDisabled}>Submit</button>
      </form>
      <br />
      <AddInputForm handleInputsInputChange={handleInputsInputChange} />
      {certCount > 0 && (
        <>
          <p>Add Certificates</p>
          <CertificateInputs
            certificates={certCount}
            handleCertificateChange={handleCertificateChange}
            handleCertificateDelete={handleCertificateDelete}
          />
        </>
      )}
    </div>
  );
}
