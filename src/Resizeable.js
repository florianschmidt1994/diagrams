import classnames from "classnames";
import { useState } from "react";

function ResizeHandle({ handleResize, isResizing }) {
  return (
    <div className="w-0 h-full bg-green-900 flex flex-col justify-center -translate-x-4">
      <div
        className={classnames(
          "w-2 h-40 rounded transition-colors w-2 h-40 hover:bg-gray-300 bg-gray-500",
          {
            "bg-gray-300": isResizing,
          }
        )}
        onMouseDown={handleResize}
      />
    </div>
  );
}

export function Resizeable({ children, className }) {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(400);

  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    setIsResizing(false);
  }

  function mousemove(e) {
    setWidth(e.x + 10);
  }

  function handleResize(e) {
    setIsResizing(true);
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }

  return (
    <div
      className={classnames(className, `grid`)}
      style={{
        gridTemplateColumns: `${width}px 0px auto`,
      }}
    >
      {children[0]}
      <ResizeHandle handleResize={handleResize} isResizing={isResizing} />
      {children[1]}
    </div>
  );
}
