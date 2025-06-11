import { useEffect, useState, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { MainLayout } from "./MainLayout";
import type { IApiImageData } from "../../backend/src/shared/ApiImageData.ts";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";
import { ImageSearchForm } from "./images/ImageSearchForm.tsx";
import { ProtectedRoute } from "./ProtectedRoutes.tsx";

function App() {
  const [imageData, setImageData] = useState<IApiImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState("");

  const reqId = useRef(0)

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === ValidRoutes.HOME && token) {
      fetchImages(token);
    }
  }, [location.pathname, token]);

  function fetchImages(authToken: string) {
    setIsLoading(true);
    fetch("/api/images", {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Unauthorized or other fetch error");
        }
        return res.json();
      })
      .then((data) => {
        setImageData(data);
        setHasError(false);
      })
      .catch((err) => {
        setHasError(true);
        console.error("Failed to fetch images:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  

  function handleImageSearch() {
    reqId.current = reqId.current + 1;
    const id = reqId.current;
    setIsLoading(true);
    fetch(`/api/images?name=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
       .then(r => {
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
      if (!token) return;

      fetch("/api/images", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setImageData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setHasError(true);
          setIsLoading(false);
          console.error("Failed to fetch images:", err);
        });
    }, [token]);
    

  // Inside your App component:
  const navigate = useNavigate();

  function handleSetToken(newToken: string) {
    setToken(newToken);
    fetchImages(newToken);     // ⬅ Re-fetch now that we're logged in
    navigate("/");
  }
  

  return (
    <Routes>
      <Route path={ValidRoutes.HOME} element={<MainLayout />}>
        <Route
          index
          element={
            <ProtectedRoute authToken={token} >
            <AllImages
              images={imageData}
              isLoading={isLoading}
              hasError={hasError}
              searchPanel={searchPanel}
            />
            </ProtectedRoute>
          }
        />
        <Route path={ValidRoutes.UPLOAD} element={
          <ProtectedRoute authToken={token} >
          <UploadPage authToken={token}/>
            </ProtectedRoute>
        } />
        <Route path={ValidRoutes.LOGIN} element={
          <LoginPage isRegistering={false} addToken={handleSetToken}/>
        } />
        <Route path={ValidRoutes.REGISTER} element={
          <LoginPage isRegistering={true} addToken={handleSetToken}/>
        } />
        <Route
          path={`${ValidRoutes.IMAGES}/:id`}
          element={
            <ProtectedRoute authToken={token} >
            <ImageDetails
              images={imageData}
              isLoading={isLoading}
              hasError={hasError}
              handleChange={handleNameChange}
              token={token}
              />
              </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
