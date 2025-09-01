// oxlint-disable consistent-type-imports
import core from "@actions/core";
import type { Context } from "@actions/github/lib/context";
import { Mock, beforeEach, describe, expect, it, vi } from "vitest";
import { run } from "../run";

vi.unmock("../run");
// @ts-expect-error
vi.mock<typeof import("@actions/github")>("@actions/github", () => ({
  context: {
    eventName: "pull_request",
    payload: {
      pull_request: {
        title: "This is a pull request title",
      },
    },
  },
}));

vi.fn();

const mockInputValues = (vitestFn: Mock, mocks: unknown) => {
  vitestFn.mockImplementation((input: unknown) => {
    // @ts-ignore
      return { regexp: "", flags: "", helpMessage: "", ...mocks }[input];
  });
};

describe("run", () => {
  beforeEach(() => {
    vi.spyOn(core, "getInput");
    vi.spyOn(core, "setFailed");
  });

  it("should pass nicely if title match regexp", () => {
    mockInputValues(core.getInput as Mock, { regexp: "^[a-z ]+$", flags: "i" });
    run({
      eventName: "pull_request",
      payload: {
        pull_request: {
          title: "This is a pull request title",
        },
      },
    } as unknown as Context);
    expect(core.setFailed).not.toHaveBeenCalled();
  });

  describe("on failing", () => {
    let regexp: string;
    let pullRequestTitle;
    let context: Context;

    beforeEach(() => {
      regexp = String.raw`\d`;
      pullRequestTitle = "This is a pull request title";
      context = {
        eventName: "pull_request",
        payload: {
          pull_request: {
            number: 1,
            title: pullRequestTitle,
          },
        },
      } as unknown as Context;
    });

    it("should fails on regexp matching", () => {
      mockInputValues(core.getInput as Mock, { regexp });
      run(context);
      expect((core.setFailed as Mock).mock.calls[0][0]).toMatchSnapshot();
    });

    it("should fails on regexp matching with helper message if defined", () => {
      mockInputValues(core.getInput as Mock, {
        regexp,
        helpMessage: `Example of matching titles:
"[Example] example of title (US-6596)"
`,
      });
      run(context);
      expect((core.setFailed as Mock).mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
