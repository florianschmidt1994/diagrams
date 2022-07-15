import { useEffect, useState } from "react";
import { get, getDatabase, ref, set, push } from "firebase/database";
import { app } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Editor } from "./Editor";
import { Diagram } from "./Diagram";

// make editor better
// setup CI / CD
// list all your diagrams
// refactor code
// show error inline
// https://github.com/satya164/react-simple-code-editor
// pdf export
// embeddable view
// real-time collaboration, ...
// OT https://en.wikipedia.org/wiki/Operational_transformation
// CRDT https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
// https://auth0.com/blog/developing-a-real-time-collaborative-editor-with-pusher/
// https://www.tiny.cloud/blog/real-time-collaboration-ot-vs-crdt/#:~:text=OT%20trades%20complexity%20for%20the,even%20valid%20for%20your%20schema.
// import from websequencediagrams
// sidebar with tree view
// connect with git?
// examples
// tutorials
// SSO
// registration
// making it pretty
// embed in Confluence button
// show errors in place
// combine with GPT-3 auto drawer / vqgan-clip

const defaultValue = `sequenceDiagram
    participant web as Web Browser
    participant blog as Blog Service
    participant account as Account Service
    participant mail as Mail Service
    participant db as Storage

    Note over web,db: The user must be logged in to submit blog posts
    web->>+account: Logs in using credentials
    account->>db: Query stored accounts
    db->>account: Respond with query result

    alt Credentials not found
        account->>web: Invalid credentials
    else Credentials found
        account->>-web: Successfully logged in

        Note over web,db: When the user is authenticated, they can now submit new posts
        web->>+blog: Submit new post
        blog->>db: Store post data

        par Notifications
            blog--)mail: Send mail to blog subscribers
            blog--)db: Store in-site notifications
        and Response
            blog-->>-web: Successfully posted
        end
    end`;

const database = getDatabase(app);
const auth = getAuth(app);

export default function App() {
  const [isResizing, setIsResizing] = useState(false);
  const { diagramName } = useParams();
  const [text, setText] = useState(diagramName ? "" : defaultValue);
  const [user, userLoading, userError] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (diagramName) {
      const obj = get(ref(database, `diagrams/${diagramName}`)).then((res) => {
        // todo refactor change handling here and pull state up from the editor!
        if (res.val().source) {
          handleChange(res.val().source);
        } else {
          console.log("No source present");
        }
      });
    }
  }, [diagramName]);

  function handleChange(e) {
    const input = e;
    setText(input);
    if (diagramName) {
      saveDiagram(diagramName, input, user);
    }
  }

  const [width, setWidth] = useState(420);

  function mouseup() {
    window.removeEventListener("mousemove", mousemove);
    window.removeEventListener("mouseup", mouseup);
    setIsResizing(false);
  }

  function mousemove(e) {
    setWidth(e.x);
  }

  function handleResize(e) {
    setIsResizing(true);
    let prevX = e.x;
    window.addEventListener("mousemove", mousemove);
    window.addEventListener("mouseup", mouseup);
  }

  function generateRandomName() {
    return window.crypto.randomUUID();
  }

  function saveDiagram(name, text, user = null) {
    // todo: handle user not logged in
    if (!user && userLoading) {
      return;
    }

    if (!user && !userLoading) {
      throw new Error("Not logged in!");
    }

    set(ref(database, `diagrams/${name}`), {
      source: text,
      user: (user && user.uid) || "anonymous",
    });

    push(ref(database, `users/${user.uid}/diagrams`), name);
  }

  function saveAndGenerateURL() {
    const name = diagramName ? diagramName : generateRandomName();
    saveDiagram(name, text, user);
    navigate(`/diagrams/${name}`);
  }

  return (
    <>
      <div className="grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] h-screen w-screen">
        <div className="col-span-2 text-sm row-span-1 w-full h-12 bg-gray-700 border-b-2 border-gray-900 text-white flex flex-row items-center px-4 py-6 text-sm text-blue-100 font-light font-mono">
          <Link to="/list" className="underline mr-6 hover:darken">
            All your diagrams
          </Link>
          <Link to="/login" className="underline mr-6">
            Login
          </Link>
          {/*<button type="button" className="rounded p-2 bg-gray-500 text-white ml-10"*/}
          {/*        onClick={exportPNG}>Export as PNG*/}
          {/*</button>*/}

          <button
            type="button"
            className="underline"
            onClick={saveAndGenerateURL}
          >
            Store
          </button>
        </div>
        <div
          id="resizable"
          className="bg-gray-800 h-full resize-x relative"
          style={{
            width: `${width}px`,
            userSelect: isResizing ? "none" : "text",
          }}
        >
          <Editor value={text} onChange={(e) => handleChange(e)} />
          <ResizeHandle handleResize={handleResize} isResizing={isResizing} />
        </div>
        <Diagram source={text} />
      </div>
    </>
  );
}

function ResizeHandle({ handleResize, isResizing }) {
  return (
    <div
      className={`transition-colors w-2 h-40 hover:bg-gray-300 ${
        isResizing ? "bg-gray-300" : "bg-gray-500"
      } rounded right-2 top-1/2 absolute -trangray-y-1/2`}
      onMouseDown={(e) => handleResize(e)}
    ></div>
  );
}
