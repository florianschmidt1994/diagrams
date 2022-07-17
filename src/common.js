import mermaid from "mermaid";

export function noop() {}

export function generateRandomName() {
  return window.crypto.randomUUID();
}

export function createDiagramSVG(text) {
  return new Promise((resolve, reject) => {
    try {
      mermaid.parseError = (err, hash) => {
        reject(err);
      };

      mermaid.mermaidAPI.render("mermaid", text, (svgCode) => {
        resolve(svgCode);
      });
    } catch (err) {
      reject(err);
    }
  });
}
