import { useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { MainLayout } from "./MainLayout";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData.ts";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";
import { ImageSearchForm } from "./images/ImageSearchForm.tsx";

function App() {
  const [imageData, setImageData] = useState<IApiImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const reqId = useRef(0)

  function handleImageSearch() {
    reqId.current = reqId.current + 1;
    const id = reqId.current;
    setIsLoading(true);
    fetch(`/api/images?name=${searchQuery}`).then(r => {
        if (!r.ok) {
            setHasError(true);
            return;
        }
        r.json().then((data) => {
            if (id === reqId.current) {
                setImageData(data)

            }
        })
    }).then(() => {
      setHasError(false)
    }
    ).catch(() => {
      setHasError(true)
    }).finally(() => {
      setIsLoading(false);
    })

}
const searchPanel = <ImageSearchForm searchString={searchQuery} onSearchStringChange={setSearchQuery} onSearchRequested={handleImageSearch}/>

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
              searchPanel={searchPanel}
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
