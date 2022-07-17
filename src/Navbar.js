import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { noop } from "./common";
import { Link, useLocation } from "react-router-dom";
import classnames from "classnames";

const auth = getAuth(app);

function NavbarItem({ active, to, children }) {
  const element = (
    <span
      className={classnames("text-xs font-bold rounded py-2 px-4 mr-4", {
        "bg-gray-800": active,
        "hover:bg-gray-800": !active,
      })}
    >
      {children}
    </span>
  );

  if (to) {
    return <Link to={to}> {element}</Link>;
  } else {
    return element;
  }
}

export default function Navbar({ className, onSave = noop, onExport = noop }) {
  const [user, loading, error] = useAuthState(auth);
  const { pathname } = useLocation();

  return (
    <div
      className={
        className +
        " w-full h-16 py-2 px-6 flex items-center justify-between bg-gray-900 border-b border-gray-800 text-gray-100"
      }
    >
      <div>
        <span className="font-bold mr-6">App Name</span>
        <NavbarItem active={pathname === "/list"} to="/list">
          My Diagrams
        </NavbarItem>
        <NavbarItem active={pathname === "/"} to="/">
          Editor
        </NavbarItem>
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
        |
        <button
          type="button"
          onClick={() => {
            signOut(auth);
          }}
          className="text-xs text-gray-100 font-bold ml-4"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
