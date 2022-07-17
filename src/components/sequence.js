export default {
  keyword: {
    pattern:
      /sequenceDiagram|alt|opt|end|else|participant|actor|loop|activate|deactivate|Note|over|right of|left of|critical/,
  },
  operator: {
    pattern:
      /((?<!-)->(?!>)|(?<!-)-->(?!>)|(?<!-)->>(?!>)|(?<!-)-->>(?!>)|(?<!-)-->>(?!>)|(?<!-)-x(?!>)|(?<!-)--x(?!>)|(?<!-)-\)(?!>)|(?<!-)--\)(?!>))[+-]?/,
  },
};
