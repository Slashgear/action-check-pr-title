import { info, setFailed, getInput } from "@actions/core";
import { Context } from "@actions/github/lib/context";

export const run = (context: Context) => {
  const { eventName } = context;
  info(`Event name: ${eventName}`);

  if (eventName !== "pull_request") {
    setFailed(`Invalid event: ${eventName}, it should be use on pull_request`);
    return;
  }

  const pullRequestTitle = context?.payload?.pull_request?.title;

  info(`Pull Request title: "${pullRequestTitle}"`);

  const regex = RegExp(getInput("regexp"));
  const helpMessage = getInput("helpMessage");
  if (!regex.test(pullRequestTitle)) {
    let message = `Pull Request title "${pullRequestTitle}" failed to pass match regexp
Used Regexp: ${regex}

`;
    if (helpMessage) {
      message = message.concat(helpMessage);
    }

    setFailed(message);
  }
};
