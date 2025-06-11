import { useState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData";

interface INameEditorProps {
  initialValue: string;
  imageId: string;
  onChange: (arg: IApiImageData[]) => void;
  token: string;
}

export function ImageNameEditor(props: INameEditorProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [input, setInput] = useState(props.initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  async function handleSubmitPressed() {
    setIsLoading(true);
    setHasError(false);
    try {
      const updateResponse = await fetch(
        `/api${ValidRoutes.IMAGES}/${props.imageId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.token}`,
          },
          body: JSON.stringify({ name: input }),
        }
      );

      if (!updateResponse.ok) {
        let errText = await updateResponse.text(); // read as plain text
        console.error("Error updating name:", errText);
        setHasError(true);
        return;
      }

      const response = await fetch(`/api${ValidRoutes.IMAGES}`, {
        headers: {
          Authorization: `Bearer ${props.token}`,
        },
      });

      if (response.status >= 400) {
        setHasError(true);
        return;
      }

      const parsed: IApiImageData[] = await response.json();
      props.onChange(parsed);

      setIsLoading(false);
      setIsEditingName(false);
      setInput("");
    } catch (error) {
      setHasError(true);
      console.log(error);
      setIsLoading(false);
      setIsEditingName(false);
      setInput("");
    }
  }

  if (isEditingName) {
    return (
      <div style={{ margin: "1em 0" }}>
        <label>
          New Name{" "}
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
        </label>
        <button
          disabled={input.length === 0 || isLoading}
          onClick={handleSubmitPressed}
        >
          Submit
        </button>
        <button onClick={() => setIsEditingName(false)}>Cancel</button>
        {isLoading && (
          <div>
            <h1>Working...</h1>
          </div>
        )}
        {hasError && (
          <div>
            <h1>ERROR OCCURED</h1>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div style={{ margin: "1em 0" }}>
        <button onClick={() => setIsEditingName(true)}>Edit name</button>
      </div>
    );
  }
}
