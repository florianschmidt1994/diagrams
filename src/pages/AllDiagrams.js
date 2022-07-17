import { getDatabase } from "firebase/database";
import { app } from "../firebase";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "../Navbar";
import { useDiagram, useDiagrams } from "../hooks";
import { Diagram } from "../Diagram";

const database = getDatabase(app);
const auth = getAuth(app);

function DiagramPreview({ diagramId, className }) {
  const [diagram, loading, error] = useDiagram(diagramId);
  if (loading || error) {
    return <>{loading || JSON.stringify(error)}</>;
  }

  return <Diagram className={className} source={diagram.source} />;
}

export default function AllDiagrams() {
  const [user, userIsLoading, errorLoadingUser] = useAuthState(auth);
  const [snapshots, loading, error] = useDiagrams(user);

  return (
    <div className="w-screen h-screen grid grid-rows-[min-content_1fr]">
      <Navbar />
      <div className="bg-gray-900 h-full text-white p-6">
        {snapshots &&
          snapshots.map((s) => {
            return (
              <Link
                className="block bg-gray-700 rounded w-auto h-40 flex flex-row items-center justify-between max-w-2xl"
                to={"/diagrams/" + s.val().id}
              >
                <div className="flex flex-col h-full p-4 justify-between">
                  <div>
                    <span className="block text-sm font-bold">
                      {s.val().title}
                    </span>
                    <span className="block text-xs">
                      Diagram ID: {s.val().id}
                    </span>
                  </div>
                  <div>
                    <Link
                      className="text-xs font-bold rounded bg-rose-500 hover:bg-rose-600 py-2 px-4"
                      to={`/diagrams/${s.val().id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
                <DiagramPreview
                  className="bg-white h-40 rounded-r p-2"
                  diagramId={s.val().id}
                />
              </Link>
            );
          })}
      </div>
    </div>
  );
}
