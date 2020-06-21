import { Commit } from "../commit";
import FastPriorityQueue = require("fastpriorityqueue");

import { DefaultRendering } from "./default";

export { GitamineRendering };

class GitamineRendering<TNode> extends DefaultRendering<TNode> {
  protected computePositions(commits: Array<Commit<TNode>>): void {
    const children = this.computeChildren(commits);
    const sortedCommits = this.sortCommits(commits, children);
    // rows
    sortedCommits.forEach((commit, i) => {
      this.rows.set(commit.hash, i);
    });
    // columns
    this.computeColumns(sortedCommits, children);
  }

  protected computeChildren(commits: Array<Commit<TNode>>): Map<Commit["hash"], Array<Commit<TNode>>> {
    const children = new Map<Commit["hash"], Array<Commit<TNode>>>();
    commits.forEach((commit) => {
      children.set(commit.hash, new Array<Commit<TNode>>());
    });
    commits.forEach((commit) => {
      commit.parents.forEach((hash) => {
        children.get(hash)!.push(commit);
      });
    });
    return children;
  }

  protected sortCommits(commits: Array<Commit<TNode>>,
      children: Map<Commit["hash"], Array<Commit<TNode>>>): Array<Commit<TNode>> {
    const dfs = (commit: Commit<TNode>) => {
      const commitHash = commit.hash;
      if (alreadySeen.get(commitHash)) {
        return;
      }
      alreadySeen.set(commitHash, true);
      children.get(commitHash)!.forEach((child: Commit<TNode>) => {
        dfs(child);
      });
      sortedCommits.push(commit);
    }

    // Sort the commits by date (from newer to older)
    const commitsWithTime = commits.map((commit) => [commit.committer.timestamp, commit] as [number, Commit<TNode>]);
    commitsWithTime.sort((lhs, rhs) => rhs[0] - lhs[0]);
    // Topological sort (from parent to children)
    const sortedCommits = new Array<Commit<TNode>>();
    const alreadySeen = new Map<string, boolean>();
    commitsWithTime.forEach(([time, commit]) => {
      dfs(commit);
    });
    return sortedCommits;
  }

  protected computeColumns(commits: Array<Commit<TNode>>,
      children: Map<Commit["hash"], Array<Commit<TNode>>>): void {
    function insertCommit(commitHash: string, j: number, forbiddenIndices: Set<number>) {
      // Try to insert as close as possible to i
      // replace i by j
      let dj = 1;
      while (j - dj >= 0 || j + dj < branches.length) {
        if (j + dj < branches.length && branches[j + dj] === null && !forbiddenIndices.has(j + dj)) {
          branches[j + dj] = commitHash;
          return j + dj;
        } else if (j - dj >= 0 && branches[j - dj] === null && !forbiddenIndices.has(j - dj)) {
          branches[j - dj] = commitHash;
          return j - dj;
        }
        ++dj;
      }
      // If it is not possible to find an available position, append
      branches.push(commitHash);
      return branches.length - 1;
    }

    const branches = new Array<string | null>();
    const activeNodes = new Map<string, Set<number>>();
    const activeNodesQueue = new FastPriorityQueue<[number, string]>((lhs, rhs) => lhs[0] < rhs[0]);
    commits.forEach((commit, i) => {
      const commitChildren = children.get(commit.hash)!;
      const branchChildren = commitChildren.filter((child) => child.parents[0] === commit.hash);
      const mergeChildren = commitChildren.filter((child) => child.parents[0] !== commit.hash);
      // Compute forbidden indices
      let highestChild: Commit<TNode> | undefined;
      let iMin = Infinity;
      for (const child of mergeChildren) {
        const iChild = this.rows.get(child.hash)!;
        if (iChild < iMin) {
          iMin = iChild;
          highestChild = child;
        }
      }
      const forbiddenIndices = highestChild ? activeNodes.get(highestChild.hash)! : new Set<number>();
      // Find a commit to replace
      let commitToReplace: Commit<TNode> | null = null;
      let jCommitToReplace = Infinity;
      // The commit can only replace a child whose first parent is this commit
      for (const child of branchChildren) {
        const jChild = this.cols.get(child.hash)!;
        if (!forbiddenIndices.has(jChild) && jChild < jCommitToReplace) {
          commitToReplace = child;
          jCommitToReplace = jChild;
        }
      }
      // Insert the commit in the active branches
      let j = -1;
      if (commitToReplace) {
        j = jCommitToReplace;
        branches[j] = commit.hash;
      } else {
        if (commitChildren.length > 0) {
          const child = commitChildren[0];
          const jChild = this.cols.get(child.hash)!;
          // Try to insert near a child
          // We could try to insert near any child instead of arbitrarily chosing the first one
          j = insertCommit(commit.hash, jChild, forbiddenIndices);
        } else {
          // TODO: Find a better value for j
          j = insertCommit(commit.hash, 0, new Set());
        }
      }
      // Remove useless active nodes
      while (!activeNodesQueue.isEmpty() && activeNodesQueue.peek()![0] < i) {
        const hash = activeNodesQueue.poll()![1];
        activeNodes.delete(hash);
      }
      // Upddate the active nodes
      const jToAdd = [j, ...branchChildren.map((child) => this.cols.get(child.hash)!)];
      for (const activeNode of activeNodes.values()) {
        jToAdd.forEach((newJ) => activeNode.add(newJ));
      }
      activeNodes.set(commit.hash, new Set<number>());
      const iRemove = Math.max(...commit.parents.map((parentHash) => this.rows.get(parentHash)!));
      activeNodesQueue.add([iRemove, commit.hash]);
      // Remove children from active branches
      for (const child of branchChildren) {
        if (child !== commitToReplace) {
          branches[this.cols.get(child.hash)!] = null;
        }
      }
      // If the commit has no parent, remove it from active branches
      if (commit.parents.length === 0) {
        branches[j] = null;
      }
      // Finally set the position
      this.cols.set(commit.hash, j);
    });
  }
}
