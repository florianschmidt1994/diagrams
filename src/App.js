import mermaid from 'mermaid'
import {useEffect, useState} from 'react'
import {refractor} from 'refractor'
import {Canvg} from "canvg";
import {useList} from "react-firebase-hooks/database";
import {get, getDatabase, ref, set} from 'firebase/database';
import {app} from "./firebase";
import {adjectives, animals, colors, uniqueNamesGenerator} from "unique-names-generator";
import {useAuthState} from "react-firebase-hooks/auth";
import {getAuth} from "firebase/auth";
import {useParams} from "react-router-dom";

// pdf export
// share line
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
// save function
// login
// SSO
// embed in Confluence button
// show errors in place

function sequence(Prism) {
    Prism.languages.sequence = {
        keyword: {
            pattern: /sequenceDiagram|alt|opt|end|else|participant|actor|loop|activate|deactivate|Note|over|right of|left of|critical|->|-->|->>|-->>|-x|--x|-\)|--\)/
        }
    }
}

sequence.displayName = "sequence"


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
    end`

refractor.register(sequence)

function Keyword({children}) {
    return <pre className='text-red-400 inline'>{children}</pre>
}

function Text({children}) {
    return children
}

function noop() {
}

function Editor({value, onChange = noop}) {

    function highlight(text) {
        return refractor.highlight(text, 'sequence').children.map(c => {
            if (c.type === "text") {
                return <Text>{c.value}</Text>;
            } else if (c.type === "element") {
                return <Keyword>{c.children[0].value}</Keyword>
            }
        })
    }

    return (<div className="relative bg-slate-900 w-full h-full text-white text-xs">
        <textarea onChange={e => onChange(e.target.value)} value={value}
                  className="p-4 absolute top-0 left-0 text-xs font-mono text-transparent caret-white whitespace-pre-wrap resize-none w-full h-full outline-0 bg-transparent"/>
        <pre
            className="p-4 absolute top-0 left-0 pointer-events-none text-xs font-mono whitespace-pre-wrap w-full h-full">
        {highlight(value)}
    </pre>
    </div>);
}

const database = getDatabase(app);
const auth = getAuth(app);

export default function App() {

    const [svgCode, setSvgCode] = useState("");
    const [isResizing, setIsResizing] = useState(false)
    const [text, setText] = useState("")
    const [snapshots, loading, error] = useList(ref(database));
    const [user, userLoading, userError] = useAuthState(auth);
    const {diagramName} = useParams()

    useEffect(() => {
        if (diagramName) {
            const obj = get(ref(database, diagramName)).then(res => {
                // todo refactor change handling here and pull state up from the editor!
                if (res.val().source) {
                    handleChange(res.val().source)
                } else {
                    console.log("No source present")
                }
            })
        }
    }, [diagramName])

    useEffect(() => {
        createDiagramSVG(text)
            .then(svg => setSvgCode(svg))
            .catch(err => console.log(err))

    }, []);


    function handleChange(e) {
        const input = e;
        setText(input)

        createDiagramSVG(input)
            .then(svg => setSvgCode(svg))
            .catch(err => console.error(err))

    }

    function createDiagramSVG(text) {
        return new Promise((resolve, reject) => {
            try {
                mermaid.parseError = (err, hash) => {
                    reject(err);
                }

                mermaid.mermaidAPI.render('mermaid', text, (svgCode) => {
                    resolve(svgCode);
                })
            } catch (err) {
                reject(err)
            }
        })
    }

    const [width, setWidth] = useState(420)

    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
        setIsResizing(false)
    }

    function mousemove(e) {
        setWidth(e.x)
    }

    function handleResize(e) {
        setIsResizing(true)
        let prevX = e.x;
        window.addEventListener("mousemove", mousemove)
        window.addEventListener("mouseup", mouseup)
    }

    function addWhiteBackground(canvas) {
        const ctx = canvas.getContext('2d');

        ctx.globalCompositeOperation = 'destination-over'; // puts the white rectangle behind the existing SVG
        const fillStyleBefore = ctx.fillStyle;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = fillStyleBefore
    }

    async function renderSVGToCanvas(ctx, svgCode) {
        const v = await Canvg.from(ctx, svgCode);
        v.start();
        v.stop();
    }

    function exportCanvasToPNG(canvas) {
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('download', 'CanvasAsImage.png');
        let dataURL = canvas.toDataURL('image/png');
        let url = dataURL.replace(/^data:image\/png/, 'data:application/octet-stream');
        downloadLink.setAttribute('href', url);
        downloadLink.click();
    }

    function createCanvas(width = 1000, height = 10000) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        const ctx = canvas.getContext('2d');
        return {canvas, ctx};
    }

    async function exportPNG() {
        const {canvas, ctx} = createCanvas();
        await renderSVGToCanvas(ctx, svgCode);
        addWhiteBackground(canvas);
        exportCanvasToPNG(canvas);
    }


    function generateRandomName() {
        return uniqueNamesGenerator({
            dictionaries: [adjectives, colors, animals],
            separator: '-',
        });
    }

    return (
        <>
            <div
                className='grid grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] h-screen w-screen'>
                <div
                    className='col-span-2 row-span-1 w-full h-12 bg-slate-700 border-b-2 border-slate-900 text-white flex flex-row items-center px-4 text-sm text-blue-100 font-light font-mono'>
                    Create pretty diagrams online
                    <button type="button" className="rounded p-2 bg-slate-500 text-white ml-10"
                            onClick={exportPNG}>Export as PNG
                    </button>

                    <button type="button" className="rounded p-2 bg-slate-500 text-white ml-10"
                            onClick={() => {
                                const name = diagramName ? diagramName : generateRandomName()
                                set(ref(database, name), {
                                    source: text,
                                    user: user.uid
                                })

                            }}>Store
                    </button>
                </div>
                <div id="resizable" className='bg-slate-800 h-full resize-x relative'
                     style={{width: `${width}px`, userSelect: isResizing ? "none" : "text"}}>
                    <Editor value={text} onChange={e => handleChange(e)}/>
                    <div
                        className={`transition-colors w-2 h-40 hover:bg-slate-300 ${isResizing ? "bg-slate-300" : "bg-slate-500"} rounded right-2 top-1/2 absolute -translate-y-1/2`}
                        onMouseDown={(e) => handleResize(e)}
                    ></div>
                </div>
                <div className='w-full h-full p-4 flex items-center justify-center'
                     dangerouslySetInnerHTML={{__html: svgCode}}></div>
            </div>
        </>
    )
}
