import { useList } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { app } from "./firebase";
import { Link } from "react-router-dom";

const database = getDatabase(app);

export default function List() {
  const [snapshots, loading, error] = useList(ref(database));
  return (
    <div className="bg-slate-900 w-full h-full text-white flex items-center justify-center flex-col">
      <header className="text-white font-bold text-lg pb-4">
        All your diagrams
      </header>
      <div className="bg-slate-600 p-4 rounded">
        {snapshots.map((s) => {
          return (
            <Link
              className="block mb-4 text-slate-200 text-center hover:underline"
              to={"/diagrams/" + s.key}
            >
              {s.key}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
