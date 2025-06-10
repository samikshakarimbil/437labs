import type { IApiImageData } from "../../../backend/src/shared/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";
import type {ReactNode} from "react";

// Define props interface to receive data from App
interface AllImagesProps {
    images: IApiImageData[];
    isLoading: boolean;
    hasError: boolean;
    searchPanel: ReactNode;
}
  
export function AllImages(props: Readonly<AllImagesProps>) {
    if (props.isLoading) return <><p>Loading...</p></>;
    if (props.hasError) return <><p>Something went wrong.</p></>;
    return (
        <>
            {props.searchPanel}
            <h2>All Images</h2>
            <ImageGrid images={props.images} />
        </>
    );
}