import Navbar from "../Navbar";
import { Editor } from "../components/Editor";
import { Diagram } from "../Diagram";
import { Resizeable } from "../Resizeable";
import { useState } from "react";
import { createDiagramSVG, generateRandomName } from "../common";
import { useNavigate } from "react-router-dom";
import { createDiagram } from "../diagrams";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { sampleSequenceDiagram } from "../sampleSequenceDiagram";
import downloadSvgAsPng from "../downloadSvgAsPng";

const auth = getAuth(app);

export default function CreateDiagram() {
  const [source, setSource] = useState(sampleSequenceDiagram);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  function onSave(title, source) {
    if (!user) {
      navigate("/login", { state: { intent: "save" } });
      return;
    }

    const diagramId = generateRandomName();
    createDiagram(diagramId, source, title, user);
    navigate(`/diagrams/${diagramId}`);
  }

  function onDownload(source) {
    createDiagramSVG(source)
      .then(downloadSvgAsPng)
      .catch((err) => console.error(err));
  }

  return (
    <div className="grid grid-rows-[min-content_1fr] h-screen w-screen">
      <Navbar
        className="col-span-2 row-span-1"
        onSave={(title) => onSave(title, source)}
        onDownload={() => onDownload(source)}
      />
      <Resizeable className="col-span-2 row-span-1 min-h-0 min-w-0">
        <Editor value={source} onChange={(source) => setSource(source)} />
        <Diagram
          source={source}
          className="h-full w-full min-h-0 min-w-0 p-4"
        />
      </Resizeable>
    </div>
  );
}
