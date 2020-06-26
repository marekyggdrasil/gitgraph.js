import { Commit } from "../commit";
import { Color, Layout } from "../layout"
import { CompareBranchesOrder } from "../branches-order";

export { DefaultRendering };

class DefaultRendering<TNode> {
  public computeLayoutFromCommits(
    commits: Array<Commit<TNode>>,
    colors: Color[],
    compareFunction: CompareBranchesOrder | undefined,
  ): Layout {
    let layout = new Layout(colors);
    commits.forEach((commit, i) => {
      // list branches
      layout.branches.add(commit.branchToDisplay);
    });
    if (compareFunction) {
      layout.branches = new Set(Array.from(layout.branches).sort(compareFunction));
    }
    this.computePositions(commits, layout);
    layout.maxRowCache = undefined;
    return layout;
  }

  protected computePositions(commits: Array<Commit<TNode>>, layout: Layout): void {
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
