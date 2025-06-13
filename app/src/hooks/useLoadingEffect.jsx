import { useLoading } from "@contexts/LoadingContext";
import { useEffect } from "react";
import { useLocation } from "react-router";

const useLoadingEffect = (delay = 1000) => {
  const { startLoading, stopLoading } = useLoading();
  const { pathname } = useLocation();

  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, pathname]);
};

export default useLoadingEffect;
