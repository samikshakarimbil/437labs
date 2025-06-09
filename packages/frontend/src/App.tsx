import { useState } from "react";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { fetchDataFromServer } from "./MockAppData.ts";

function App() {
    // Move the useState call from AllImages to here
    const [imageData, _setImageData] = useState(fetchDataFromServer);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route 
                    index 
                    element={<AllImages images={imageData} />} 
                />
                <Route path="upload" element={<UploadPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route 
                    path="images/:id" 
                    element={<ImageDetails images={imageData} />} 
                />
            </Route>
        </Routes>
    );
}

export default App;