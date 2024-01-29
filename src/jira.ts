type GetIssueParams = {
  fields?: string;
  expand?: string;
};

export type Issue = {
  id: string;
  key: string;
  fields: Fields;
};

type Fields = {
  issuetype: Issuetype;
};

type Issuetype = {
  subtask: boolean;
  name: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
type FetchParams = {
  body?: any;
  query?: Record<string, string>;
};

type Request = {
  method: string;
  url: string;
  headers: object;
  body: any;
};

enum StatusCodes {
  TOO_MANY_REQUESTS = 429,
}

export class Jira {
  private apiUrl: string;
  private token: string;
  private email: string;

  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY = 1000;

  constructor(apiUrl: string, email: string, token: string) {
    this.apiUrl = apiUrl;
    this.email = email;
    this.token = token;
  }

  public async getIssue(ID: string, query: GetIssueParams): Promise<Issue> {
    const res = await this.fetch("GET", `/rest/api/2/issue/${ID}`, {
      query,
    });

    return res.json() as Promise<Issue>;
  }

  private async fetch(
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
    return this.fetchRetry(
      {
        url,
        method: method,
        headers: headers,
        body: params.body ? { body: JSON.stringify(params.body) } : {},
      },
      this.MAX_RETRIES
    );
  }

  /**
   * fetch node.js method wrapped in retry mechanism for rate limiting
   */
  private async fetchRetry(
    request: Request,
    counter: number
  ): Promise<Response> {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      ...request.body,
    });
    if (response.status === StatusCodes.TOO_MANY_REQUESTS) {
      await this.sleep(this.RETRY_DELAY);
      return await this.fetchRetry(request, counter - 1);
    }
    return response;
  }

  private async sleep(delay: number): Promise<void> {
    return new Promise((res) => setTimeout(res, delay));
  }
}
