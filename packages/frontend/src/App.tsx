import { useState } from "react";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./MainLayout";
import { fetchDataFromServer } from "./MockAppData.ts";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";

function App() {
    // Move the useState call from AllImages to here
    const [imageData, _setImageData] = useState(fetchDataFromServer);

    return (
        <Routes>
            <Route path={ValidRoutes.HOME} element={<MainLayout />}>
                <Route 
                    index 
                    element={<AllImages images={imageData} />} 
                />
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
                <Route 
                    path={`${ValidRoutes.IMAGES}/:id`} 
                    element={<ImageDetails images={imageData} />} 
                />
            </Route>
        </Routes>
    );
}

export default App;