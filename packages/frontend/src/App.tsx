import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { MainLayout } from "./MainLayout";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData.ts";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";

function App() {
  const [imageData, setImageData] = useState<IApiImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  function handleNameChange(updatedData: IApiImageData[]){
    setImageData([...updatedData])
  }

  useEffect(() => {
    fetch(`/api${ValidRoutes.IMAGES}`)
      .then((responseObj) => {
        if (responseObj.status >= 400) {
          setHasError(true);
          setIsLoading(false);
          return null;
        } else {
          return responseObj.json();
        }
      })
      .then((parsed) => {
        if (parsed) {
          setImageData(parsed);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  return (
    <Routes>
      <Route path={ValidRoutes.HOME} element={<MainLayout />}>
        <Route
          index
          element={
            <AllImages
              images={imageData}
              isLoading={isLoading}
              hasError={hasError}
            />
          }
        />
        <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
        <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
        <Route
          path={`${ValidRoutes.IMAGES}/:id`}
          element={
            <ImageDetails
              images={imageData}
              isLoading={isLoading}
              hasError={hasError}
              handleChange={handleNameChange}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
