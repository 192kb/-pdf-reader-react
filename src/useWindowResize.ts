import React from "react";

export const useWindowResize = (handleResize: () => void): void => {
  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);
};
