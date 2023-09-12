type GetIssueParams = {
  fields?: string;
  expand?: string;
};

type Issue = {
  id: string;
  key: string;
  fields: Fields;
};

type Fields = {
  issuetype: Issuetype;
};

type Issuetype = {
  subtask: boolean;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type FetchParams = {
  body?: any;
  query?: Record<string, string>;
};

export class Jira {
  apiUrl: string;
  token: string;
  email: string;

  constructor(apiUrl: string, email: string, token: string) {
    this.apiUrl = apiUrl;
    this.email = email;
    this.token = token;
  }

  async getIssue(ID: string, query: GetIssueParams): Promise<Issue> {
    const res = await this.fetch("GET", `/rest/api/2/issue/${ID}`, {
      query,
    });

    return res.json() as Promise<Issue>;
  }

  async fetch(
    method: string,
    path: string,
    params: FetchParams
  ): Promise<Response> {
    const headers = {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(`${this.email}:${this.token}`).toString("base64"),
    };
    const url =
      this.apiUrl +
      path +
      (params.query ? "?" + new URLSearchParams(params.query) : "");
    return fetch(url, {
      method: method,
      headers: headers,
      ...(params.body ? { body: JSON.stringify(params.body) } : {}),
    });
  }
}
