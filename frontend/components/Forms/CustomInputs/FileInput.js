import { useState } from "react";

export default function FileInput({ name, handleOnFileChange }) {
  const [value, setValue] = useState("");

  return (
    <input
      name={name}
      value={value}
      type="file"
      onChange={(event) => {
        setValue(event.target.value);
        handleOnFileChange(event);
      }}
    />
  );
}
