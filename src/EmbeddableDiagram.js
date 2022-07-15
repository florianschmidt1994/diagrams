import { Link, useParams } from "react-router-dom";
import { useObject } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { app } from "./firebase";
import { Diagram } from "./Diagram";

const database = getDatabase(app);

export default function EmbeddableDiagram() {
  const { diagramName } = useParams();
  const [snapshot, loading, error] = useObject(ref(database, diagramName));

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xl">
        Loading diagram...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xl text-red-800">
        Failed to load diagram!
      </div>
    );
  }

  if (snapshot) {
    return (
      <div className="w-full h-full bg-slate-100 grid grid-rows-[1fr_min-content] rounded">
        <Diagram source={snapshot.val().source} />
        <div className="w-full bg-slate-500 p-2 px-4 text-white text-sm flex flex-row gap-4 rounded-b">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-slate-200 hover:underline"
            to={"/diagrams/" + diagramName}
          >
            Edit
          </Link>

          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-slate-200 hover:underline"
            to={"/diagrams/" + diagramName + "/embed"}
          >
            Open in Fullscreen
          </Link>
        </div>
      </div>
    );
  }
}
