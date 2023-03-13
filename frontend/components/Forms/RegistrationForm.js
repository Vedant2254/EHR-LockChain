import { useState } from "react";
import AddInputForm from "./AddInputForm";
import FileInput from "./CustomInputs/FileInput";

export default function RegistrationForm({ handleOnSubmit, initialInputs }) {
  const [data, setData] = useState({}); // stores inputname -> inputvalue mapping
  const [inputs, setInputs] = useState(initialInputs); // stores inputname -> inputtype mapping

  function handleDataInputChange(event) {
    let { name, value } = event.target;
    if (event.target.files) value = event.target.files[0];
    setData({ ...data, [name]: value });
  }

  function handleInputsChange(inputName, inputType) {
    setInputs({ ...inputs, [inputName]: inputType });
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleOnSubmit(data);
        }}
      >
        {Object.keys(inputs).map((input, index) => {
          const name = input;
          const type = inputs[input];
          return (
            <div key={index}>
              {type == "file" ? (
                <FileInput
                  name={name}
                  handleOnFileChange={handleDataInputChange}
                />
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
              <br />
            </div>
          );
        })}
        <button>Submit</button>
      </form>
      <br />
      <AddInputForm handleInputsChange={handleInputsChange} />
    </div>
  );
}
