import {refractor} from "refractor";
import {noop} from "./common";

export function Editor({value, onChange = noop}) {

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

function Keyword({children}) {
    return <pre className='text-red-400 inline'>{children}</pre>
}

function Text({children}) {
    return children
}