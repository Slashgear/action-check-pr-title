import { info, setFailed, getInput, warning } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import { Jira } from "./jira";

export const containsParentTaskID = async (ids: string[]): Promise<boolean> => {
  const jiraUrl = getInput("jiraUrl");
  if (!jiraUrl) {
    warning(`Not checking parent task because of missing JIRA URL`);
    return true;
  }
  if (!ids) {
    return false;
  }

  const jira = new Jira(
    jiraUrl,
    getInput("jiraUsername"),
    getInput("jiraToken")
  );

  const skipIDs = getInput("jiraSkipCheck").split(",");

  for (const id of ids) {
    const issueID = id[0];
    info(`Checking ID ${issueID}`);
    if (skipIDs.includes(issueID.toLowerCase())) {
      info(`Skipping ID ${issueID}`);
      return true;
    }

    const issue = await jira.getIssue(issueID, { fields: "issuetype" });
    if (issue.fields?.issuetype?.subtask === false) {
      info(`Found parent task ${issueID}`);
      return true;
    }
  }

  return false;
};

export const run = async (context: Context) => {
  const { eventName } = context;
  info(`Event name: ${eventName}`);

  if (eventName !== "pull_request") {
    setFailed(`Invalid event: ${eventName}, it should be use on pull_request`);
    return;
  }

  const pullRequestTitle = context?.payload?.pull_request?.title;

  info(`Pull Request title: "${pullRequestTitle}"`);

  const regex = RegExp(getInput("regexp"), getInput("flags"));
  const helpMessage = getInput("helpMessage");
  if (!regex.test(pullRequestTitle)) {
    let message = `Pull Request title "${pullRequestTitle}" failed to pass match regexp - ${regex}
`;
    if (helpMessage) {
      message = message.concat(helpMessage);
    }

    setFailed(message);
  }

  let flags = getInput("flags");
  flags = flags.includes("g") ? flags : flags + "g";
  const regex2 = RegExp(getInput("regexp"), flags);

  if (
    !pullRequestTitle ||
    !(await containsParentTaskID([...pullRequestTitle.matchAll(regex2)]))
  ) {
    const message = `Pull Request title "${pullRequestTitle}" doesn't contain JIRA parent task ID
`;
    setFailed(message);
  }
};
