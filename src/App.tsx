import React, { useState } from "react";
import { Document, Page, DocumentProps, PageProps } from "react-pdf";
import { useSwipeable } from "react-swipeable";

import * as T from "./_types";
import { useWindowResize } from "./useWindowResize";

const App: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [orientation, setOrientation] = useState<T.WindowOrientation>();

  const onDocumentLoadSuccess = React.useCallback(
    ({ numPages }) => setNumPages(numPages),
    []
  );

  const handleOrientation = React.useCallback(() => {
    if (window.matchMedia("(orientation: portrait)").matches) {
      setOrientation(T.WindowOrientation.Portrait);
    }
    if (window.matchMedia("(orientation: landscape)").matches) {
      setOrientation(T.WindowOrientation.Landscape);
    }
  }, []);
  React.useEffect(handleOrientation, [handleOrientation]);
  useWindowResize(handleOrientation);

  const handlePrev = React.useCallback(() => {
    switch (orientation) {
      case T.WindowOrientation.Landscape:
        if (pageNumber - 2 >= 1) {
          setPageNumber(pageNumber - 2);
        }
        break;

      default:
      case T.WindowOrientation.Portrait:
        if (pageNumber - 1 >= 1) {
          setPageNumber(pageNumber - 1);
        }
        break;
    }
  }, [orientation, pageNumber]);

  const handleNext = React.useCallback(() => {
    switch (orientation) {
      case T.WindowOrientation.Landscape:
        if (pageNumber + 2 <= numPages) {
          setPageNumber(pageNumber + 2);
        }
        break;

      default:
      case T.WindowOrientation.Portrait:
        if (pageNumber + 1 <= numPages) {
          setPageNumber(pageNumber + 1);
        }
        break;
    }
  }, [orientation, pageNumber, numPages]);

  const swipeHanlders = useSwipeable({
    onTap: () => orientation === T.WindowOrientation.Portrait && handleNext,
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    onSwipedUp: handleNext,
    onSwipedDown: handlePrev,
  });

  const documentProps = React.useMemo<DocumentProps>(() => {
    return {
      file: "/report.pdf",
      loading: "Загружаем данные",
      error: " ",
      noData: "Данных нет",
      onLoadSuccess: onDocumentLoadSuccess,
    };
  }, [onDocumentLoadSuccess]);

  const pageProps = React.useMemo<PageProps>(() => {
    return {
      loading: "Загружаем страницу",
      error: " ",
      noData: "Страница не указана",
      renderMode: "canvas",
    };
  }, []);

  return (
    <div
      className={`pdf-reader ${orientation || "not-oriented"}`}
      {...swipeHanlders}
    >
      <Document {...documentProps}>
        {pageNumber <= numPages && pageNumber >= 0 && (
          <div
            className="left-page page"
            onClick={() => {
              orientation === T.WindowOrientation.Landscape && handlePrev();
            }}
          >
            <Page pageNumber={pageNumber} {...pageProps} />
          </div>
        )}
        {orientation === T.WindowOrientation.Landscape &&
          pageNumber + 1 <= numPages &&
          pageNumber + 1 >= 0 && (
            <div className="right-page page" onClick={handleNext}>
              <Page pageNumber={pageNumber + 1} {...pageProps} />
            </div>
          )}
      </Document>
    </div>
  );
};

export default App;
