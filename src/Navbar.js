import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { app } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { noop } from "./common";

const auth = getAuth(app);

export default function Navbar({ className, onSave = noop, onExport = noop }) {
  const [user, loading, error] = useAuthState(auth);
  return (
    <div
      className={
        className +
        " w-full h-16 py-2 px-6 flex items-center justify-between bg-gray-700 text-gray-100"
      }
    >
      <div>
        <span className="font-bold mr-6">App Name</span>
        <span className="text-xs font-bold rounded hover:bg-gray-800 py-2 px-4 mr-4">
          My Diagrams
        </span>
        <span className="text-xs font-bold bg-gray-900 py-2 px-4 shadow-inner rounded mr-4">
          Editor
        </span>
      </div>
      <div>
        <button
          type="button"
          className="text-xs font-bold rounded bg-gray-600 hover:bg-gray-800 border border-gray-500 py-2 px-4 mr-4"
          onClick={onExport}
        >
          <FontAwesomeIcon className="mr-2" icon={faDownload} />
          Export
        </button>
        <button
          type="button"
          className="text-xs font-bold rounded bg-gray-600 hover:bg-gray-800 border border-gray-500 py-2 px-4 mr-4"
          onClick={onSave}
        >
          <FontAwesomeIcon className="mr-2" icon={faFloppyDisk} />
          Save
        </button>
        |<span className="text-xs text-gray-100 font-bold ml-4">Log Out</span>
      </div>
    </div>
  );
}
