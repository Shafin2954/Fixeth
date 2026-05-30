// Client-side GitHub access using a Personal Access Token (BYOA model).
//
// The token lives only in the learner's browser (localStorage), mirroring the
// bring-your-own-API approach used for AI. With a fine-grained or classic PAT
// (scope: repo) learners can browse their repositories and open files in the
// CS50-style codespace — no server-side OAuth secret required.

const TOKEN_KEY = "fixeth.github.token";
const API = "https://api.github.com";

export type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
  updated_at: string;
};

export type GitHubTreeItem = {
  path: string;
  type: "blob" | "tree";
  sha: string;
};

export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function hasToken(): boolean {
  return Boolean(getToken());
}

async function gh<T>(path: string): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("Not connected to GitHub.");
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });
  if (res.status === 401) throw new Error("Invalid or expired GitHub token.");
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export function getCurrentUser(): Promise<GitHubUser> {
  return gh<GitHubUser>("/user");
}

export function listRepos(): Promise<GitHubRepo[]> {
  return gh<GitHubRepo[]>("/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator");
}

export async function listRepoFiles(
  fullName: string,
  branch: string
): Promise<GitHubTreeItem[]> {
  const data = await gh<{ tree: GitHubTreeItem[] }>(
    `/repos/${fullName}/git/trees/${branch}?recursive=1`
  );
  return data.tree.filter((item) => item.type === "blob");
}

export async function getFileContent(fullName: string, path: string): Promise<string> {
  const data = await gh<{ content?: string; encoding?: string }>(
    `/repos/${fullName}/contents/${encodeURIComponent(path).replace(/%2F/g, "/")}`
  );
  if (data.content && data.encoding === "base64") {
    // atob handles base64; decode UTF-8 safely.
    const binary = atob(data.content.replace(/\n/g, ""));
    try {
      return decodeURIComponent(
        binary
          .split("")
          .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
          .join("")
      );
    } catch {
      return binary;
    }
  }
  return "";
}
