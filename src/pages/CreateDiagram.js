import Navbar from "../Navbar";
import { Editor } from "../Editor";
import { Diagram } from "../Diagram";
import { Resizeable } from "../Resizeable";
import { useState } from "react";
import { generateRandomName } from "../common";
import { useNavigate } from "react-router-dom";
import { createDiagram } from "../diagrams";
import { getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(app);

export default function CreateDiagram() {
  const [source, setSource] = useState("");
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

  function onDownload(source) {}

  return (
    <div className="grid grid-rows-[min-content_1fr] h-screen w-screen">
      <Navbar
        className="col-span-2 row-span-1"
        onSave={(title) => onSave(title, source)}
        onDownload={() => onDownload(source)}
      />
      <Resizeable className="col-span-2 row-span-1">
        <Editor value={source} onChange={(source) => setSource(source)} />
        <Diagram className="w-full h-full" source={source} />
      </Resizeable>
    </div>
  );
}
