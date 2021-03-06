import Navbar from "../Navbar";
import { Editor } from "../components/Editor";
import { Diagram } from "../Diagram";
import { Resizeable } from "../Resizeable";
import { useState } from "react";
import { createDiagramSVG, generateRandomName } from "../common";
import { useNavigate, useParams } from "react-router-dom";
import { createDiagram, updateDiagram } from "../diagrams";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDiagram } from "../hooks";
import downloadSvgAsPng from "../downloadSvgAsPng";

const auth = getAuth(app);

export default function EditDiagram() {
  const [user, userLoading, errorLoadingUser] = useAuthState(auth);

  const { diagramId } = useParams();
  const [diagram, loading, error] = useDiagram(diagramId);
  const [initialLoad, setInitialLoad] = useState(true);

  const navigate = useNavigate();

  function onSourceChange(newSource) {
    if (loading) {
      console.log("Diagram still loading");
      return;
    }

    if (!user) {
      console.error("User not logged in");
      // todo: handle this case!
      return;
    }

    updateDiagram(diagramId, diagram, newSource);
  }

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
        onSave={(title) => onSave(title, diagram.source)}
        onDownload={() => onDownload(diagram.source)}
      />
      <Resizeable className="col-span-2 row-span-1 min-h-0 min-w-0">
        {!loading && !error && (
          <Editor value={diagram.source} onChange={onSourceChange} />
        )}
        {!loading && !error && (
          <Diagram
            className="w-full h-full min-h-0 min-w-0  p-4"
            source={diagram.source}
          />
        )}
      </Resizeable>
    </div>
  );
}
