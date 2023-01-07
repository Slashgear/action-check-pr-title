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
    return { regexp: "", flags: "", helpMessage: "", ...mocks }[input];
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
});
