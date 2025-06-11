import { useParams } from "react-router-dom";
import type { IApiImageData } from "../../../backend/src/shared/ApiImageData";
import { ImageNameEditor } from "../ImageNameEditor";
import type {ReactNode} from "react";

// Define props interface to receive data from App
interface IImageDetailsProps {
    images: IApiImageData[];
    isLoading: boolean;
    hasError: boolean;
    handleChange: (updatedData: IApiImageData[]) => void
    token: string;
  }
  
export function ImageDetails(props: Readonly<IImageDetailsProps>): ReactNode{
    const { id } = useParams<{ id: string }>();
    const image = props.images.find(image => image._id === id);
    
    if (props.isLoading) return <><p>Loading...</p></>;
    if (props.hasError) return <><p>Failed to load image.</p></>;
    if (!image) {
        return <><h2>Image not found</h2></>;
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor 
                initialValue="" 
                imageId={image._id} 
                onChange={props.handleChange}
                token={props.token}/>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}