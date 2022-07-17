import { useList } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { app } from "./firebase";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "./Navbar";

const database = getDatabase(app);
const auth = getAuth(app);

function useDiagrams(user) {
  const uid = !user ? "invalidUid" : user.uid;

  const path = `/users/${uid}/diagrams`;
  console.log(path);
  const [snapshots, loading, error] = useList(ref(database, path));

  if (!user) {
    return [null, true, false];
  } else {
    return [snapshots, loading, error];
  }
}

export default function List() {
  const [user, userIsLoading, errorLoadingUser] = useAuthState(auth);
  const [snapshots, loading, error] = useDiagrams(user);

  console.log(snapshots);
  return (
    <div className="w-screen h-screen grid grid-rows-[min-content_1fr]">
      <Navbar />
      <div className="bg-gray-900 w-full h-full text-white flex items-center justify-center flex-col">
        <header className="text-white font-bold text-lg pb-4">
          All your diagrams
        </header>
        <div className="bg-gray-600 p-4 rounded">
          {snapshots &&
            snapshots.map((s) => {
              return (
                <Link
                  className="block mb-4 text-gray-200 text-center hover:underline"
                  to={"/diagrams/" + s.val()}
                >
                  {s.val()}
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
