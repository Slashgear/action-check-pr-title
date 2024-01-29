/* eslint-disable @typescript-eslint/no-var-requires */
const core = require("@actions/core");
const { run } = require("../run.ts");

jest.unmock("../run");
jest.mock("@actions/github", () => ({
  context: {
    eventName: "pull_request",
    payload: {
      pull_request: {
        title: "This is a pull request title",
      },
    },
  },
}));

const mockInputValues = (jestFn, mocks) => {
  jestFn.mockImplementation((input) => {
    return {
      regexp: "",
      flags: "",
      helpMessage: "",
      jiraIDRegexp: "",
      jiraIDFlags: "",
      ...mocks,
    }[input];
  });
};

describe("run", () => {
  beforeEach(() => {
    core.getInput = jest.fn();
    core.setFailed = jest.fn();
  });

  it("should pass nicely if title match regexp", () => {
    mockInputValues(core.getInput, { regexp: "^[a-z ]+$", flags: "i" });
    run({
      eventName: "pull_request",
      payload: {
        pull_request: {
          title: "This is a pull request title",
        },
      },
    });
    expect(core.setFailed).not.toBeCalled();
  });

  describe("on failing", () => {
    let regexp;
    let pullRequestTitle;
    let context;

    beforeEach(() => {
      regexp = "\\d";
      pullRequestTitle = "This is a pull request title";
      context = {
        eventName: "pull_request",
        payload: {
          pull_request: {
            title: pullRequestTitle,
          },
        },
      };
    });

    it("should fails on regexp matching", () => {
      mockInputValues(core.getInput, { regexp });
      run(context);
      expect(core.setFailed.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should fails on regexp matching with helper message if defined", () => {
      mockInputValues(core.getInput, {
        regexp,
        helpMessage: `Example of matching titles:
"[Example] example of title (US-6596)"
`,
      });
      run(context);
      expect(core.setFailed.mock.calls[0][0]).toMatchSnapshot();
    });
  });

  describe("JIRA parent task validation", () => {
    beforeEach(() => {
      mockInputValues(core.getInput, {
        regexp: "(TRIVIAL|[mM]erge|([A-Z][A-Z0-9_]+-[0-9]+))",
        flags: "",
        jiraIDRegexp: "(TRIVIAL|[mM]erge|([A-Z][A-Z0-9_]+-[0-9]+))",
        jiraIDFlags: "",
        jiraUrl: process.env.JIRA_URL,
        jiraUsername: process.env.JIRA_USERNAME,
        jiraToken: process.env.JIRA_TOKEN,
        jiraSkipCheck: "trivial",
      });
    });

    const tests = [
      {
        name: "Should pass on TRIVIAL",
        title: "TRIVIAL This is a pull request title",
        success: true,
      },
      {
        name: "Should fail on subtask",
        title: "DEVEX-207 This is a pull request title",
        success: false,
      },
      {
        name: "Should pass on parent issue",
        title: "DEVEX-102 This is a pull request title",
        success: true,
      },
      {
        name: "Should pass on parent issue and subtask",
        title: "DEVEX-102 DEVEX-207 This is a pull request title",
        success: true,
      },
      {
        name: "Should fail on Spike issue",
        title: "DEVEX-202 his is a pull request title",
        success: false,
      },
      {
        name: "Should fail on Epic issue",
        title: "DEVEX-123 his is a pull request title",
        success: false,
      },
    ];

    for (const test of tests) {
      it(test.name, async () => {
        await run({
          eventName: "pull_request",
          payload: {
            pull_request: {
              title: test.title,
            },
          },
        });
        if (test.success) {
          expect(core.setFailed).not.toBeCalled();
        } else {
          expect(core.setFailed).toBeCalled();
        }
      });
    }
  });

  describe("Different regexes for PR and JIRA IDs", () => {
    it("should pass", async () => {
      mockInputValues(core.getInput, {
        regexp: "feat\\([A-Z][A-Z0-9_]+-[0-9]+\\):",
        flags: "",
        jiraIDRegexp: "(TRIVIAL|[mM]erge|([A-Z][A-Z0-9_]+-[0-9]+))",
        jiraIDFlags: "",
        jiraUrl: process.env.JIRA_URL,
        jiraUsername: process.env.JIRA_USERNAME,
        jiraToken: process.env.JIRA_TOKEN,
        jiraSkipCheck: "trivial",
      });

      await run({
        eventName: "pull_request",
        payload: {
          pull_request: {
            title: "feat(DEVEX-102): this is a title",
          },
        },
      });
      expect(core.setFailed).not.toBeCalled();
    });
  });
});
