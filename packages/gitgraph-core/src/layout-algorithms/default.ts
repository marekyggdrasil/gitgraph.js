import { Commit } from "../commit";
import { Layout } from "../layout"
import { LayoutPolicy } from "../layout-policy"

export { DefaultRendering };

class DefaultRendering extends LayoutPolicy {
  protected computePositions<TNode>(commits: Array<Commit<TNode>>, layout: Layout): void {
    commits.forEach((commit, i) => {
      // columns
      const col = Array.from(layout.branches).findIndex(
        (branch) => branch === commit.branchToDisplay,
      );
      layout.cols.set(commit.hash, col);
      // rows
      layout.rows.set(commit.hash, i);
    });
  }
}
