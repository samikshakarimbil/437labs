import { ImageGrid } from "./ImageGrid.tsx";

// Define props interface to receive data from App
interface AllImagesProps {
    images: any[]; // Use the same type as your imageData
}

export function AllImages({ images }: AllImagesProps) {
    return (
        <>
            <h2>All Images</h2>
            <ImageGrid images={images} />
        </>
    );
}