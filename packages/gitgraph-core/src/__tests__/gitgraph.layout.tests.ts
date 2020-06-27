import { GitgraphCore } from "../gitgraph";
import { DefaultPolicy } from "../layout-policies/default";
import { GitaminePolicy } from "../layout-policies/gitamine";

describe("Gitgraph Layout", () => {
  it("should tell it's default layout if not set", () => {
    const gitgraph = new GitgraphCore();

    expect(gitgraph.policy).toBeInstanceOf(DefaultPolicy);
  });

  it("should not re-use any columns for default layout", () => {
    const core = new GitgraphCore({
      policy: new DefaultPolicy(),
    });
  });

  it("should not recognize the Gitamine layout is set", () => {
    const core = new GitgraphCore({
      policy: new GitaminePolicy(),
    });
  });
});
