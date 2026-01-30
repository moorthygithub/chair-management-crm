import Login from "@/app/auth/login";
import BomList from "@/app/bom/bom";
import NotFound from "@/app/errors/not-found";
import Home from "@/app/home/home";
import ProductList from "@/app/product/product-list";
import Settings from "@/app/setting/setting";
import Maintenance from "@/components/common/maintenance";
import ErrorBoundary from "@/components/error-boundry/error-boundry";
import ForgotPassword from "@/components/forgot-password/forgot-password";
import LoadingBar from "@/components/loader/loading-bar";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./auth-route";
import ProtectedRoute from "./protected-route";
import ComponentList from "@/app/component/component-list";
import ComponentForm from "@/app/component/component-form";

function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AuthRoute />}>
          <Route path="/" element={<Login />} />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ForgotPassword />
              </Suspense>
            }
          />
          <Route path="/maintenance" element={<Maintenance />} />
        </Route>

        <Route path="/" element={<ProtectedRoute />}>
          <Route
            path="/settings"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/home"
            element={
              <Suspense fallback={<LoadingBar />}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/bom"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BomList />
              </Suspense>
            }
          />
          <Route
            path="/product"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ProductList />
              </Suspense>
            }
          />
          <Route
            path="/component"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentList />
              </Suspense>
            }
          />
          <Route
            path="/component/create"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/component/edit/:id"
            element={
              <Suspense fallback={<LoadingBar />}>
                <ComponentForm />
              </Suspense>
            }
          />
          <Route
            path="/bom"
            element={
              <Suspense fallback={<LoadingBar />}>
                <BomList />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default AppRoutes;
