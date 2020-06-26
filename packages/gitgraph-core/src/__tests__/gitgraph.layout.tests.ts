import { GitgraphCore } from "../gitgraph";
import { LayoutType } from "../layout-type";

describe("Gitgraph Layout", () => {
  it("should tell it's default layout if not set", () => {
    const gitgraph = new GitgraphCore();

    expect(gitgraph.getLayout).toBe(LayoutType.Default);
  });

  it("should not re-use any columns for default layout", () => {
    const core = new GitgraphCore({
      layout: LayoutType.Default,
    });
  });

  it("should not recognize the Gitamine layout is set", () => {
    const core = new GitgraphCore({
      layout: LayoutType.Gitamine,
    });
  });
});
