import { GitgraphCore } from "../gitgraph";
import { DefaultPolicy } from "../layout-policies/default";
import { GitaminePolicy } from "../layout-policies/gitamine";

describe("Gitgraph Layout", () => {
  it("should tell it's default layout if not set", () => {
    const gitgraph = new GitgraphCore();

    expect(gitgraph.layout).toBeInstanceOf(DefaultPolicy);
  });

  it("should not re-use any columns for default layout", () => {
    const core = new GitgraphCore({
      layout: new DefaultPolicy(),
    });
  });

  it("should not recognize the Gitamine layout is set", () => {
    const core = new GitgraphCore({
      layout: new GitaminePolicy(),
    });
  });
});
