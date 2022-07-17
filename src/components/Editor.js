import { noop } from "../common";
import ReactSimpleCodeEditor from "react-simple-code-editor";
import { highlight } from "prismjs/components/prism-core";
import "./editor.css";
import Prism from "prismjs";
import sequence from "./sequence";

Prism.languages.sequence = sequence;

export function Editor({ value, onChange = noop }) {
  return (
    <div className="relative bg-gray-800 w-full h-full text-white text-xs overflow-scroll">
      <ReactSimpleCodeEditor
        className="w-full min-h-full p-4 text-xs font-mono focus:outline-none"
        padding={20}
        value={value || ""}
        onValueChange={(v) => onChange(v)}
        highlight={(code) =>
          highlight(code, Prism.languages.sequence, "sequence")
        }
      />
    </div>
  );
}

function Placeholder() {
  return <div className="editor-placeholder">Enter some plain text...</div>;
}

function Operator({ children }) {
  return <pre className="text-yellow-400 inline">{children}</pre>;
}

function Keyword({ children }) {
  return <pre className="text-red-400 inline">{children}</pre>;
}

function Text({ children }) {
  return children;
}
