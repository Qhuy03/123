// GA
import ReactGA from "react-ga4";

// utils
import { Suspense } from "react";

// styles
import "@styles/index.scss";
import "react-toastify/dist/ReactToastify.min.css";
import ThemeStyles from "@styles/theme";

// fonts
import "@fonts/icomoon/icomoon.woff";

// contexts
import { ThemeProvider } from "styled-components";

// hooks
import { useTheme } from "@contexts/themeContext";
import { useEffect, useRef } from "react";

// components
import Loader from "@components/Loader";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import routes from "@pages/routes";
import View from "@components/view";
import { LoadingProvider } from "@contexts/LoadingContext";
import { AuthProvider } from "@contexts/AuthContext";

// pages
const App = () => {
  const appRef = useRef(null);
  const { theme } = useTheme();

  // Google Analytics init
  const gaKey = import.meta.env.VITE_GA;
  gaKey && ReactGA.initialize(gaKey);

  useEffect(() => {
    appRef.current && appRef.current.scrollTo(0, 0);
  }, []);

  return (
    <AuthProvider>
      <LoadingProvider>
        <ThemeProvider theme={{ theme: theme }}>
          <ThemeStyles />
          <ToastContainer
            theme={theme}
            autoClose={2000}
            style={{ padding: "20px" }}
          />
          <Suspense fallback={<Loader />}>
            <div>
              <Routes>
                {routes.map(
                  ({
                    component: Component,
                    is_public,
                    layout,
                    path,
                    title,
                    ...rest
                  }) => {
                    return (
                      <Route
                        key={path}
                        path={path}
                        element={
                          <View
                            display={<Component />}
                            layout={layout}
                            title={title}
                            is_public={is_public}
                            {...rest}
                          />
                        }
                      />
                    );
                  }
                )}
              </Routes>
            </div>
          </Suspense>
        </ThemeProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default App;
