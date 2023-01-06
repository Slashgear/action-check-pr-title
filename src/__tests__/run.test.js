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

describe("run", () => {
  beforeEach(() => {
    core.getInput = jest.fn(() => ".+");
    core.setFailed = jest.fn();
  });

  it("should pass nicely if title match regexp", () => {
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
    let regex;
    let pullRequestTitle;
    let context;

    beforeEach(() => {
      regex = "\\d";
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
      core.getInput.mockReturnValueOnce(regex).mockReturnValueOnce("");
      run(context);
      expect(core.setFailed.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should fails on regexp matching with helper message if defined", () => {
      core.getInput.mockReturnValueOnce(regex)
        .mockReturnValueOnce(`Example of matching titles:
"[Example] example of title (US-6596)"
`);
      run(context);
      expect(core.setFailed.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
