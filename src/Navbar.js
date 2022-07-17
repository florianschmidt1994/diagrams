import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "firebase/auth";
import { app } from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFloppyDisk,
  faShareNodes,
} from "@fortawesome/free-solid-svg-icons";
import { noop } from "./common";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import classnames from "classnames";
import { useState } from "react";

const auth = getAuth(app);

function NavbarItem({ active, to, children }) {
  const element = (
    <span
      className={classnames("text-xs font-bold rounded py-2 px-4 mr-4", {
        "bg-gray-700": active,
        "hover:bg-gray-700": !active,
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

function NavbarButton({ icon, children, onClick }) {
  return (
    <button
      type="button"
      className="text-xs font-bold rounded hover:bg-gray-700 py-2 px-4"
      onClick={onClick}
    >
      <FontAwesomeIcon className="mr-2" icon={icon} />
      {children}
    </button>
  );
}

export default function Navbar({
  className,
  onSave = noop,
  onDownload = noop,
}) {
  const [user, loading, error] = useAuthState(auth);
  const [promptDiagramName, setPromptDiagramName] = useState(false);
  const [diagramName, setDiagramName] = useState("");
  const { pathname } = useLocation();
  const { diagramId } = useParams();
  const navigate = useNavigate();

  return (
    <div
      className={
        className +
        " w-full h-16 py-2 px-6 flex items-center justify-between bg-gray-900 border-b border-gray-800 text-gray-100"
      }
    >
      <div>
        <span className="font-bold mr-6">Diagrams</span>
        <NavbarItem active={pathname === "/list"} to="/list">
          My Diagrams
        </NavbarItem>
        <NavbarItem active={pathname === "/"} to="/">
          Editor
        </NavbarItem>
      </div>
      <div>
        <NavbarButton
          icon={faShareNodes}
          onClick={() => {
            if (diagramId) {
              navigate(`/diagrams/${diagramId}/embed`);
            } else {
              navigate("/login", { state: { intent: "share" } });
            }
          }}
        >
          Share
        </NavbarButton>
        <NavbarButton icon={faDownload} onClick={onDownload}>
          Download
        </NavbarButton>
        <input
          className={classnames(
            "transition-[width] rounded-l bg-gray-700 p-2 text-xs font-bold w-52 focus:outline-none border-t border-l border-b border-rose-500",
            {
              "w-0 h-0 border-none p-0 invisible": !promptDiagramName,
            }
          )}
          onChange={(e) => setDiagramName(e.target.value)}
          value={diagramName}
          placeholder="Enter the name of your diagram"
          type="text"
        />
        <button
          type="button"
          className={classnames("text-xs font-bold py-2 px-4 mr-4", {
            "rounded-r bg-rose-500 pl-3 border-t border-b border-r border-rose-500":
              promptDiagramName,
            "rounded border border-gray-900 hover:bg-gray-700 hover:border hover:border-gray-700":
              !promptDiagramName,
          })}
          onClick={() => {
            if (promptDiagramName) {
              onSave(diagramName);
              setPromptDiagramName(false);
            } else {
              setPromptDiagramName(true);
            }
            //onSave
          }}
        >
          <FontAwesomeIcon className="mr-2" icon={faFloppyDisk} />
          Save
        </button>
        |
        {user && (
          <>
            <span className="text-xs font-bold mx-4">{user.email}</span>|
            <button
              type="button"
              onClick={() => {
                signOut(auth);
              }}
              className="text-xs text-gray-100 font-bold ml-4"
            >
              Log Out
            </button>
          </>
        )}
        {!user && !loading && (
          <Link
            to="/login"
            type="button"
            className="text-xs text-gray-100 font-bold ml-4"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
