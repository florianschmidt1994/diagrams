import { useList, useObject } from "react-firebase-hooks/database";
import { getDatabase, ref } from "firebase/database";
import { app } from "./firebase";

const database = getDatabase(app);

export function useDiagrams(userUid) {
  const uid = !userUid ? "invalidUid" : userUid.uid;

  const path = `/users/${uid}/diagrams`;
  console.log(path);
  const [snapshots, loading, error] = useList(ref(database, path));

  if (!userUid) {
    return [null, true, false];
  } else {
    return [snapshots, loading, error];
  }
}

export function useDiagram(diagramId) {
  const [snapshots, loading, error] = useObject(
    ref(database, `/diagrams/${diagramId}`)
  );

  return [snapshots ? snapshots.val() : null, loading, error];
}
