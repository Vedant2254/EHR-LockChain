import { useState } from "react";
import FileInput from "./FileInput";

export default function CertificateInput({ index, handleCertificateChange }) {
  const [state, setState] = useState({ title: "", description: "" });

  function handleDataInputChange(event) {
    if (!event.target.files)
      setState({ ...state, [event.target.name]: event.target.value });
    handleCertificateChange(index, event);
  }

  return (
    <div>
      <FileInput name="media" handleOnFileChange={handleDataInputChange} />
      <br />
      <input
        name="title"
        type="text"
        value={state.title}
        onChange={handleDataInputChange}
      />
      <br />
      <textarea
        name="description"
        value={state.description}
        onChange={handleDataInputChange}
      />
    </div>
  );
}
