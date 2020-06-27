import * as React from "react";
import { storiesOf } from "@storybook/react";
import {
  createGitgraph,
  TemplateName,
  templateExtend,
  DefaultPolicy,
  GitaminePolicy
} from "@gitgraph/js";

import { createFixedHashGenerator, GraphContainer } from "../helpers";

const noLabels = templateExtend(TemplateName.Metro, {
  branch: { label: { display: false } },
});

storiesOf("gitgraph-js/7. Rendering algorithms", module)
  .add("Default", () => (
    <GraphContainer>
      {(graphContainer) => {
        const gitgraph = createGitgraph(graphContainer, {
          generateCommitHash: createFixedHashGenerator(),
          layout: new DefaultPolicy(),
          template: noLabels,
        });

        const master = gitgraph.branch("master").commit("Initial commit");
        for (let i = 0; i < 4; i++) {
          const branch = gitgraph.branch("b" + i);
          branch.commit("something has been done");
          master.merge(branch);
        }
      }}
    </GraphContainer>
  ))
  .add("Gitamine", () => (
    <GraphContainer>
      {(graphContainer) => {
        const gitgraph = createGitgraph(graphContainer, {
          generateCommitHash: createFixedHashGenerator(),
          layout: new GitaminePolicy(),
          template: noLabels,
        });

        const master = gitgraph.branch("master").commit("Initial commit");
        for (let i = 0; i < 4; i++) {
          const branch = gitgraph.branch("b" + i);
          branch.commit("something has been done");
          master.merge(branch);
        }
      }}
    </GraphContainer>
  ));
