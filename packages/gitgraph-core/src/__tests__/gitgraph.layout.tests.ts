import { GitgraphCore } from "../gitgraph";
import { DefaultRendering } from "../layout-algorithms/default";
import { GitamineRendering } from "../layout-algorithms/gitamine";

describe("Gitgraph Layout", () => {
  it("should tell it's default layout if not set", () => {
    const gitgraph = new GitgraphCore();

    expect(gitgraph.layout).toBeInstanceOf(DefaultRendering);
  });

  it("should not re-use any columns for default layout", () => {
    const core = new GitgraphCore({
      layout: new DefaultRendering(),
    });
  });

  it("should not recognize the Gitamine layout is set", () => {
    const core = new GitgraphCore({
      layout: new GitamineRendering(),
    });
  });
});
