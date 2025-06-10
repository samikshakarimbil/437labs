import { useParams } from "react-router-dom";
import type { IApiImageData } from "../../../backend/src/shared/ApiImageData";
import { ImageNameEditor } from "../ImageNameEditor";

// Define props interface to receive data from App
interface IImageDetailsProps {
    images: IApiImageData[];
    isLoading: boolean;
    hasError: boolean;
    handleChange: (arg:IApiImageData[]) => void
  }
  
export function ImageDetails({ images, isLoading, hasError, handleChange }: IImageDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const image = images.find(image => image.id === id);
    
    if (isLoading) return <><p>Loading...</p></>;
    if (hasError) return <><p>Failed to load image.</p></>;
    if (!image) {
        return <><h2>Image not found</h2></>;
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor 
                initialValue="" 
                imageId={image.id} 
                onChange={handleChange}/>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}