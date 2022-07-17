import { useEffect, useState } from "react";
import { createDiagramSVG, noop } from "./common";
import classnames from "classnames";

// pan - zoom? https://github.com/bumbu/svg-pan-zoom
// todo: change title and favicon

export function Diagram({ source, onRender = noop, className = "" }) {
  const [svg, setSVG] = useState();
  const [renderingError, setRenderingError] = useState(null);

  useEffect(() => {
    createDiagramSVG(source)
      .then((svg) => {
        setSVG(svg);
        setRenderingError(null);
        onRender(svg);
      })
      .catch((err) => setRenderingError(err));
  }, [source, setSVG, setRenderingError]);

  if (renderingError) {
    return (
      <div className="w-full h-full p-4 flex flex-col items-center justify-center overflow-scroll">
        Syntax error in diagram{" "}
        <pre>{JSON.stringify(renderingError, null, 2)}</pre>
      </div>
    );
  }
  return (
    <div className={classnames(className, "flex justify-center items-center")}>
      <img
        className="max-h-full max-w-full min-w-0 min-h-0"
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      />
    </div>
  );
}
