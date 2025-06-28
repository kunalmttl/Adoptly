import os

# --- CONFIG ---
# Assume this script is placed at the root of your project
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # project root directory
EXCLUDE_DIRS = {".git", "node_modules", "__pycache__"}
BACKEND_PREFIX = os.path.join("packages", "backend")
FRONTEND_PREFIX = os.path.join("packages", "frontend")
BACKEND_OUTPUT = "backend_all.txt"
FRONTEND_OUTPUT = "frontend_all.txt"

# --- VERIFY PROJECT STRUCTURE ---
if not os.path.isfile(os.path.join(BASE_DIR, "package.json")):
    raise RuntimeError(f"No package.json found in {BASE_DIR}. Please place this script in your project root.")

print(f"Project root: {BASE_DIR}")

# Clear or create output files
for path in (BACKEND_OUTPUT, FRONTEND_OUTPUT):
    with open(path, "w", encoding="utf-8"):
        pass  # truncate or create

# --- SPLIT AND CONCATENATE ---
for dirpath, dirnames, filenames in os.walk(BASE_DIR):
    # Skip excluded directories
    dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

    for fname in filenames:
        abs_path = os.path.join(dirpath, fname)
        # Compute path relative to project root
        rel_path = os.path.relpath(abs_path, BASE_DIR)

        # Determine which output to write to
        if rel_path.startswith(BACKEND_PREFIX):
            out_file = BACKEND_OUTPUT
        elif rel_path.startswith(FRONTEND_PREFIX):
            out_file = FRONTEND_OUTPUT
        else:
            continue  # skip files outside backend/frontend

        # Append file header and contents
        with open(out_file, "a", encoding="utf-8") as out_f:
            out_f.write(f"\n\n&^&^&^&^&^&^ {rel_path} &^&^&^&^&^&^\n")
            try:
                with open(abs_path, "r", encoding="utf-8") as in_f:
                    out_f.write(in_f.read())
            except UnicodeDecodeError:
                out_f.write("[BINARY FILE - CONTENT SKIPPED]\n")

print(f"✅ Backend concatenated to {BACKEND_OUTPUT}")
print(f"✅ Frontend concatenated to {FRONTEND_OUTPUT}")
