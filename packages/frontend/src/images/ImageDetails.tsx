import { useState } from "react";
import { MainLayout } from "../MainLayout.tsx";
import { fetchDataFromServer } from "../MockAppData.ts";
import { useParams } from "react-router-dom";

export function ImageDetails() {
    const { id } = useParams<{ id: string }>();
    const [imageData, _setImageData] = useState(fetchDataFromServer);
    const image = imageData.find(image => image.id === id);
    if (!image) {
        return <MainLayout><h2>Image not found</h2></MainLayout>;
    }

    return (
        <MainLayout>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </MainLayout>
    )
}
