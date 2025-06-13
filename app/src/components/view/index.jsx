import DocumentTitle from "@components/DocumentTitle";
import Loader from "@components/Loader";
import { useAuth } from "@contexts/AuthContext";
import { useLoading } from "@contexts/LoadingContext";
import useLoadingEffect from "@hooks/useLoadingEffect";
import App from "@layout/App";
import Auth from "@layout/Auth";
import Subapp from "@layout/Subapp";
import React from "react";
import { Navigate } from "react-router-dom";

const View = ({ layout, display, title, is_public, ...rest }) => {
  useLoadingEffect();
  const { isAuthenticated, loading: isAuthLoading } = useAuth();

  const layouts = {
    auth: Auth,
    app: App,
    sub: Subapp,
  };

  let Layout = layouts[layout] || layouts.app;
  const { loading } = useLoading();

  if (isAuthLoading) return <Loader />;

  if (!isAuthenticated && !is_public) {
    return <Navigate to={"/login"} />;
  }
  return (
    <>
      {loading && <Loader />}
      <DocumentTitle title={title} />
      <Layout {...rest}>{display}</Layout>
    </>
  );
};

export default View;
