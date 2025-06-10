import { useState } from "react";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData";

interface INameEditorProps {
    initialValue: string;
    imageId: string;
    onChange: (arg: IApiImageData[]) => void
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
            const response = await fetch(`/api${ValidRoutes.IMAGES}`);

            if (response.status >= 400) {
                setHasError(true);
                return;
            }

            const parsed: IApiImageData[] = await response.json();

            // Directly mutates parsed array
            const toEdit = parsed.find(img => img.id === props.imageId);

            if (toEdit) {
                toEdit.name = input;
                props.onChange(parsed);
            }

            //Reset states once request is done
            setIsLoading(false);
            setIsEditingName(false);
            setInput("");

        } 
        catch (error) {
            setHasError(true);
            console.log(error)
            setIsLoading(false);
            setIsEditingName(false);
            setInput("");
        } 
    }


    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    New Name <input value={input} onChange={e => setInput(e.target.value)} disabled={isLoading}/>
                </label>
                <button disabled={(input.length === 0) || isLoading} onClick={handleSubmitPressed}>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
                {isLoading && <div><h1>Working...</h1></div>}
                {hasError && <div><h1>ERROR OCCURED</h1></div>}
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