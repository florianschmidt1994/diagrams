import { useList, useObject } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { app } from "./firebase";

const database = getDatabase(app);

export function useDiagrams(user) {
  let query;

  if (user) {
    const path = `/users/${user.uid}/diagrams`;
    query = ref(database, path);
  } else {
    query = null;
  }

  return useList(query);
}

export function useDiagram(diagramId) {
  const [snapshots, loading, error] = useObject(
    ref(database, `/diagrams/${diagramId}`)
  );

  return [snapshots ? snapshots.val() : null, loading, error];
}
