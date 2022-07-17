const arrows = new RegExp(
  [/->/, /-->/, /->>/, /-->>/, /-x/, /--x/, /-\)/, /--\)/]
    .map((r) => r.source)
    .join("|")
);

const arrowsWithActivation = new RegExp(`(${arrows.source})[\\+-]?`);
console.log(arrowsWithActivation);

const leftParticipant = new RegExp(
  `(\\w+)(?=(${arrowsWithActivation.source}))`
);
const rightParticipant = new RegExp(
  `(?<=(${arrowsWithActivation.source}))(\\w+)`
);

export default {
  keyword: {
    pattern:
      /(?<=(\s|^))(sequenceDiagram|alt|opt|end|par|else|participant|actor|loop|activate|deactivate|Note|over|right of|left of|critical)(?=(\s|$))/,
  },
  leftParticipant: {
    pattern: leftParticipant,
  },
  rightParticipant: {
    pattern: rightParticipant,
  },
  operator: {
    pattern:
      /((?<!-)->(?!>)|(?<!-)-->(?!>)|(?<!-)->>(?!>)|(?<!-)-->>(?!>)|(?<!-)-->>(?!>)|(?<!-)-x(?!>)|(?<!-)--x(?!>)|(?<!-)-\)(?!>)|(?<!-)--\)(?!>))[+-]?/,
  },
};
