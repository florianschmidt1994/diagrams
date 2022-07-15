import mermaid from "mermaid";
import { useEffect, useState } from "react";
import { noop } from "./common";

// pan - zoom? https://github.com/bumbu/svg-pan-zoom
// todo: change title and favicon

export function Diagram({ source, onRender = noop }) {
  function createDiagramSVG(text) {
    return new Promise((resolve, reject) => {
      try {
        mermaid.parseError = (err, hash) => {
          reject(err);
        };

        mermaid.mermaidAPI.render("mermaid", text, (svgCode) => {
          resolve(svgCode);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

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
    <div
      className="w-full h-full p-4 flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    ></div>
  );
}