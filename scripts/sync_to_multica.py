#!/usr/bin/env python3
import os
import subprocess
import json
import glob

def main():
    project_id = "5e08cd57-04d9-4931-9de1-42f34a5577af"
    issues_dir = os.path.join(os.path.dirname(__file__), "..", "docs", "issues")
    issue_files = sorted(glob.glob(os.path.join(issues_dir, "*.md")))

    print(f"Syncing {len(issue_files)} Epics to Multica Project {project_id}...")

    created_epics = {}

    for filepath in issue_files:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = f.readlines()
        
        title = lines[0].replace("# ", "").strip()
        epic_num = int(title.split(" — ")[0])
        
        cmd = [
            "multica", "issue", "create",
            "--project", project_id,
            "--title", title,
            "--description-file", filepath,
            "--output", "json"
        ]
        
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode == 0:
            data = json.loads(res.stdout)
            issue_id = data.get("id")
            created_epics[epic_num] = issue_id
            print(f"Created Multica Epic #{epic_num} ({issue_id[:8]}): {title}")
        else:
            print(f"Failed to create {title}: {res.stderr}")

    print(f"Finished creating {len(created_epics)} Epics in Multica.")

if __name__ == "__main__":
    main()
