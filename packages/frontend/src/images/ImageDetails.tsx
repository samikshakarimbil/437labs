import { useState } from "react";
import { fetchDataFromServer } from "../MockAppData.ts";
import { useParams } from "react-router-dom";

export function ImageDetails() {
    const { id } = useParams<{ id: string }>();
    const [imageData, _setImageData] = useState(fetchDataFromServer);
    const image = imageData.find(image => image.id === id);
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
