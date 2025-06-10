import type { IApiImageData } from "../../../backend/src/shared/ApiImageData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

// Define props interface to receive data from App
interface AllImagesProps {
    images: IApiImageData[];
    isLoading: boolean;
    hasError: boolean;
}
  

export function AllImages({ images, isLoading, hasError }: AllImagesProps) {
    if (isLoading) return <><p>Loading...</p></>;
    if (hasError) return <><p>Something went wrong.</p></>;
    return (
        <>
            <h2>All Images</h2>
            <ImageGrid images={images} />
        </>
    );
}