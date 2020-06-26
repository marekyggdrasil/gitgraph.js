import { CompareBranchesOrder } from "./branches-order";
import { Commit } from "./commit";
import { Color, Layout } from "./layout"

export { LayoutPolicy };

abstract class LayoutPolicy<TNode> {
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

  protected abstract computePositions(commits: Array<Commit<TNode>>, layout: Layout): void;
}