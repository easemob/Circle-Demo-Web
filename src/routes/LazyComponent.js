import React, { lazy, Suspense } from "react";
import Loading from "@/components/Loading";

const LazyComponent = (importFunc) => {
  const LazyComp = lazy(importFunc);
  return (
    <Suspense fallback={<Loading /> || "loading..."}>
      <LazyComp />
    </Suspense>
  );
};

export default LazyComponent;
