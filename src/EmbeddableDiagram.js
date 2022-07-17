import { Link, useParams } from "react-router-dom";
import { getDatabase } from "firebase/database";
import { app } from "./firebase";
import { Diagram } from "./Diagram";
import { useDiagram } from "./hooks";

const database = getDatabase(app);

export default function EmbeddableDiagram() {
  const { diagramId } = useParams();
  const [diagram, loading, error] = useDiagram(diagramId);

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
        Failed to load diagram! <br />
        {JSON.stringify(error)}
      </div>
    );
  }

  if (diagram) {
    return (
      <div className="w-full h-full bg-gray-100 grid grid-rows-[1fr_min-content] rounded max-h-full max-w-full min-w-0 min-h-0">
        <Diagram
          className="max-h-full max-w-full min-w-0 min-h-0 p-4"
          source={diagram.source}
        />
        <div className="w-full bg-gray-500 p-2 px-4 text-white text-sm flex flex-row gap-4 rounded-b">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-200 hover:underline"
            to={"/diagrams/" + diagramId}
          >
            Edit
          </Link>

          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-gray-200 hover:underline"
            to={"/diagrams/" + diagramId + "/embed"}
          >
            Open in Fullscreen
          </Link>
        </div>
      </div>
    );
  }
}
