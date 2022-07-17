import { getDatabase, push, ref, set } from "firebase/database";
import { app } from "./firebase";

const database = getDatabase(app);

export function createDiagram(diagramId, diagramSource, diagramTitle, user) {
  set(ref(database, `diagrams/${diagramId}`), {
    source: diagramSource,
    user: user.uid,
    title: diagramTitle,
  });

  push(ref(database, `users/${user.uid}/diagrams`), {
    title: diagramTitle,
    id: diagramId,
  });
}

export function updateDiagram(diagramId, diagram, source) {
  set(ref(database, `diagrams/${diagramId}`), {
    ...diagram,
    source: source,
  });
}
