import React, { useState } from "react";
import { Document, Page, DocumentProps } from "react-pdf";
import { useSwipeable } from "react-swipeable";

import * as T from "./_types";
import { useWindowResize } from "./useWindowResize";

const App: React.FC = () => {
  const [numPages, setNumPages] = useState<number>(0);
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

  return (
    <div
      className={`pdf-reader ${orientation || "not-oriented"}`}
      {...swipeHanlders}
    >
      <div
        className="left-page page"
        onClick={() => {
          orientation === T.WindowOrientation.Landscape && handlePrev();
        }}
      >
        <Document {...documentProps}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
      {orientation === T.WindowOrientation.Landscape && (
        <div className="right-page page" onClick={handleNext}>
          <Document {...documentProps}>
            <Page pageNumber={pageNumber + 1} />
          </Document>
        </div>
      )}
    </div>
  );
};

export default App;
