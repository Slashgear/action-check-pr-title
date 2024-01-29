import { info, setFailed, getInput, warning } from "@actions/core";
import { Context } from "@actions/github/lib/context";
import { Issue, Jira } from "./jira";

const mapJiraIssues = async (ids: string[]): Promise<Issue[]> => {
  const jira = new Jira(
    getInput("jiraUrl"),
    getInput("jiraUsername"),
    getInput("jiraToken")
  );

  const issues = [];
  for (const id of ids) {
    const issue = await jira.getIssue(id, { fields: "issuetype" });
    issues.push(issue);
  }

  return issues;
};

const containsParentIssue = (issues: Issue[]): boolean => {
  return !!issues.find((issue) => issue?.fields?.issuetype?.subtask === false);
};

const containsSpikeIssue = (issues: Issue[]): boolean => {
  return !!issues.find((issue) => issue?.fields?.issuetype?.name === "Spike");
};

const containsEpicIssue = (issues: Issue[]): boolean => {
  return !!issues.find((issue) => issue?.fields?.issuetype?.name === "Epic");
};

const parsePullRequestTitle = (title: string): string[] => {
  let flags = getInput("jiraIDFlags");
  flags = flags.includes("g") ? flags : flags + "g";
  const regex = RegExp(getInput("jiraIDRegexp"), flags);
  return [...title.matchAll(regex)][0];
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

  // We first check if PR title format is valid
  const regex = RegExp(getInput("regexp"), getInput("flags"));
  const helpMessage = getInput("helpMessage");
  if (!regex.test(pullRequestTitle)) {
    let message = `Pull Request title "${pullRequestTitle}" failed to pass match regexp - ${regex}\n`;
    if (helpMessage) {
      message = message.concat(helpMessage);
    }
    setFailed(message);
    return;
  }

  const issueIds = parsePullRequestTitle(pullRequestTitle);

  // In a case that pull request contains some of the jiraSkipCheck keywords
  // we skip the Jira check, for example in a case of TRIVIAL issue
  const skipIDs = getInput("jiraSkipCheck")?.split(",") || [];
  if (issueIds.find((id: string) => skipIDs.includes(id.toLowerCase()))) {
    return;
  }

  const message = `Pull Request title "${pullRequestTitle}" doesn"t contain JIRA parent issue ID\n`;

  if (!pullRequestTitle || issueIds.length === 0) {
    setFailed(message);
    return;
  }

  if (!getInput("jiraUrl")) {
    warning(`Not checking the issues because of missing JIRA URL`);
    return;
  }

  const issues = await mapJiraIssues(issueIds);
  if (!containsParentIssue(issues)) {
    setFailed(message);
  }

  if (containsSpikeIssue(issues)) {
    setFailed(
      "Pull Request title contains a Spike issue, which is not allowed\n"
    );
  }

  if (containsEpicIssue(issues)) {
    setFailed(
      "Pull Request title contains an Epic issue, which is not allowed\n"
    );
  }
};
