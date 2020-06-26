import { Branch } from "./branch";
import { Commit } from "./commit"
import { uniq } from "./utils";

export { Color, Layout };

type Color = string;

class Layout {
  branches: Set<Branch["name"]> = new Set();
  colors: Color[];
  rows = new Map<Commit["hash"], number>();
  cols = new Map<Commit["hash"], number>();
  maxRowCache: number | undefined = undefined;

  public constructor(colors: Color[]) {
    this.colors = colors;
  }

  /**
   * Return the row index of particular commit.
   *
   * @param commitHash Hash of the commit
   */
  public getRowOf(commitHash: Commit["hash"]): number {
    return this.rows.get(commitHash) || 0;
  }

  /**
   * Return the highest row index in the layout
   */
  public getMaxRow(): number {
    if (this.maxRowCache === undefined) {
      this.maxRowCache = uniq(Array.from(this.rows.values())).length - 1;
    }
    return this.maxRowCache;
  }

  /**
   * Return the order of the given branch name.
   *
   * @param commitHash Hash of the commit
   */
  public getOrder(commitHash: Commit["hash"]): number {
    return this.cols.get(commitHash) || 0;
  }

  /**
   * Return the order of the given branch name.
   *
   * @param branchName Name of the branch
   */
  public getBranchOrder(branchName: Branch["name"]): number {
    return Array.from(this.branches).findIndex(
      (branch) => branch === branchName,
    );
  }

  /**
   * Return the color of the given branch.
   *
   * @param branchName Name of the branch
   */
  public getColorOf(branchName: Branch["name"]): Color {
    return this.colors[this.getBranchOrder(branchName) % this.colors.length];
  }
}