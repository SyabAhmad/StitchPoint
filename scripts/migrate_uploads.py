"""Move uploaded files from server/uploads to project-root uploads.

Run this from the repository root (or run this script directly). It will:
- Create project-root 'uploads/' if missing
- Move all files from 'server/uploads/' into 'uploads/'
- If a filename collision occurs, prefix the file with a timestamp
- Remove 'server/uploads/' if it becomes empty

This is safe to run multiple times.
"""
import os
import shutil
import time

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SERVER_UPLOADS = os.path.join(PROJECT_ROOT, 'server', 'uploads')
PROJECT_UPLOADS = os.path.join(PROJECT_ROOT, 'uploads')

def main():
    print(f"Project root: {PROJECT_ROOT}")
    print(f"Server uploads: {SERVER_UPLOADS}")
    print(f"Project uploads: {PROJECT_UPLOADS}")

    if not os.path.isdir(SERVER_UPLOADS):
        print("No server/uploads/ directory found. Nothing to move.")
        return

    os.makedirs(PROJECT_UPLOADS, exist_ok=True)

    moved = 0
    for entry in os.listdir(SERVER_UPLOADS):
        src = os.path.join(SERVER_UPLOADS, entry)
        if not os.path.isfile(src):
            continue
        dest = os.path.join(PROJECT_UPLOADS, entry)
        if os.path.exists(dest):
            # Avoid overwriting: prefix with timestamp
            ts = int(time.time())
            dest = os.path.join(PROJECT_UPLOADS, f"{ts}_{entry}")
        try:
            shutil.move(src, dest)
            print(f"Moved: {src} -> {dest}")
            moved += 1
        except Exception as e:
            print(f"Failed to move {src}: {e}")

    # If server/uploads is now empty, remove it
    try:
        if os.path.isdir(SERVER_UPLOADS) and not os.listdir(SERVER_UPLOADS):
            os.rmdir(SERVER_UPLOADS)
            print(f"Removed empty directory: {SERVER_UPLOADS}")
    except Exception as e:
        print(f"Failed to remove server uploads dir: {e}")

    print(f"Done. Files moved: {moved}")

if __name__ == '__main__':
    main()
