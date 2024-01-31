export const flatten = (node: directoryTree.DirectoryTree): directoryTree.DirectoryTree[] =>
  node.children?.flatMap((n) => flatten(n)) ?? [node];
