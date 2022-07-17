import { useEffect, useState } from "react";
import { createDiagramSVG, noop } from "./common";

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
    <img
      className={className}
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
    />
  );
}
