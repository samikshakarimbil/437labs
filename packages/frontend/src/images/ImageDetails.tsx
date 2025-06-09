import { useParams } from "react-router-dom";

// Define props interface to receive data from App
interface ImageDetailsProps {
    images: any[]; // Use the same type as your imageData
}

export function ImageDetails({ images }: ImageDetailsProps) {
    const { id } = useParams<{ id: string }>();
    const image = images.find(image => image.id === id);
    
    if (!image) {
        return <><h2>Image not found</h2></>;
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}