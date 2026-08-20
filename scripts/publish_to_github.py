#!/usr/bin/env python3
import os
import sys
import glob
import json
import urllib.request
import urllib.error

def main():
    repo = os.environ.get("GITHUB_REPO") or (sys.argv[1] if len(sys.argv) > 1 else None)
    token = os.environ.get("GITHUB_TOKEN") or (sys.argv[2] if len(sys.argv) > 2 else None)

    if not repo:
        print("Usage: python3 scripts/publish_to_github.py <owner/repo> [github_token]")
        sys.exit(1)

    if not token:
        print("Please provide a GitHub Personal Access Token.")
        sys.exit(1)

    issues_dir = os.path.join(os.path.dirname(__file__), "..", "docs", "issues")
    issue_files = sorted(glob.glob(os.path.join(issues_dir, "*.md")))

    if not issue_files:
        print("No issue markdown files found in docs/issues/")
        sys.exit(1)

    print(f"Found {len(issue_files)} tickets to publish to GitHub repo: {repo}")

    api_url = f"https://api.github.com/repos/{repo}/issues"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "User-Agent": "MBG-Platform-Ticket-Publisher"
    }

    created = []
    for filepath in issue_files:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        title = lines[0].replace("# ", "").strip()
        body = "".join(lines[1:]).strip()

        payload = {
            "title": title,
            "body": body,
            "labels": ["ready-for-agent", "mbg-platform"]
        }

        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers=headers,
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                issue_num = res_data.get("number")
                issue_url = res_data.get("html_url")
                print(f"Created Issue #{issue_num}: {title} -> {issue_url}")
                created.append((issue_num, title, issue_url))
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8")
            print(f"Failed to create {title}: HTTP {e.code} - {err_body}")

    print(f"Completed! Published {len(created)}/{len(issue_files)} issues to GitHub.")

if __name__ == "__main__":
    main()
