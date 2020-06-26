import { Commit } from "../commit";
import { Layout } from "../layout"
import { LayoutPolicy } from "../layout-policy"

export { CompactRendering };

class CompactRendering<TNode> extends LayoutPolicy<TNode> {
  protected computePositions(commits: Array<Commit<TNode>>, layout: Layout): void {
    commits.forEach((commit, i) => {
      // columns
      const col = Array.from(layout.branches).findIndex(
        (branch) => branch === commit.branchToDisplay,
      );
      layout.cols.set(commit.hash, col);
      // rows
      let newRow = i;
      const isFirstCommit = i === 0;
      if (!isFirstCommit) {
        const parentRow = layout.getRowOf(commit.parents[0]);
        const historyParent = commits[i - 1];
        newRow = Math.max(parentRow + 1, layout.getRowOf(historyParent.hash));
        const isMergeCommit = commit.parents.length > 1;
        if (isMergeCommit) {
          // Push commit to next row to avoid collision when the branch in which
          // the merge happens has more commits than the merged branch.
          const mergeTargetParentRow = layout.getRowOf(commit.parents[1]);
          if (parentRow < mergeTargetParentRow) newRow++;
        }
      }
      layout.rows.set(commit.hash, newRow);
    });
  }
}
