# Bug: Race condition in ADW plan file verification

## Metadata
issue_number: `14`
adw_id: `79ac0b83`
issue_json: `{"number":14,"title":"Fix: Race condition in ADW plan file verification","body":"## Problem\n\nThe ADW planning phase has a race condition that causes intermittent failures. The script verifies file existence immediately after the planner agent completes, but the file may still be writing to disk.\n\n**Symptoms:**\n- Error: \"Plan file does not exist\"\n- State shows `plan_file: null`\n- File actually exists on disk when checked manually\n\n**Observed in:** Issue #3, Issue #4\n\n## Root Cause\n\nIn `adws/adw_plan.py` around line 200:\n```python\nplan_file_path = plan_response.output.strip()\n\nif not os.path.exists(plan_file_path):\n    error(\"Plan file does not exist\")\n    \nstate.update(plan_file=plan_file_path)\n```\n\nThe script checks file existence **immediately** without waiting for filesystem sync.\n\n## Solution\n\nAdd retry mechanism with polling:\n\n```python\nimport time\n\nplan_file_path = plan_response.output.strip()\n\n# Retry with polling\nmax_retries = 10\nretry_delay = 0.5  # 500ms between attempts\n\nfor attempt in range(max_retries):\n    if os.path.exists(plan_file_path):\n        logger.info(f\"Plan file found: {plan_file_path}\")\n        break\n    logger.info(f\"Waiting for plan file... (attempt {attempt + 1}/{max_retries})\")\n    time.sleep(retry_delay)\nelse:\n    raise FileNotFoundError(f\"Plan file not found after {max_retries} attempts: {plan_file_path}\")\n\nstate.update(plan_file=plan_file_path)\nstate.save()\nlogger.info(f\"Plan file path saved to state: {plan_file_path}\")\n```\n\n## Acceptance Criteria\n\n- [ ] Retry mechanism waits up to 5 seconds (10 × 500ms) for file to exist\n- [ ] Clear logging of retry attempts\n- [ ] Appropriate error message if file still doesn't exist after retries\n- [ ] Manual test: Run PLAN phase 5 times without race condition errors\n\n## Technical Details\n\n**File:** `adws/adw_plan.py`\n**Lines:** ~200-210\n**Import needed:** `import time`"}`

## Bug Description
The ADW planning phase experiences a race condition that causes intermittent failures during plan file verification. After the Claude Code planner agent completes and writes a plan file to disk, the `adw_plan.py` script immediately checks if the file exists using `os.path.exists()`. Due to filesystem latency (especially on networked or slower filesystems), the file may still be syncing to disk, causing the check to fail even though the file was successfully created.

**Symptoms observed:**
- Error message: "Plan file does not exist: {path}"
- State shows `plan_file: null`
- File actually exists on disk when checked manually seconds later
- Intermittent failures (works sometimes, fails other times)

**Expected behavior:** The script should wait for the file to be fully written to disk before checking existence.

**Actual behavior:** The script checks immediately and fails if filesystem sync hasn't completed.

## Problem Statement
The `adw_plan.py` script performs an immediate file existence check after the planner agent returns a plan file path, without accounting for filesystem synchronization delay. This creates a race condition where the file exists but hasn't been fully synced to the filesystem, causing false-negative existence checks and workflow failures.

## Solution Statement
Implement a retry mechanism with polling that waits for the plan file to exist on disk. The solution will:
1. Add `time` module import for sleep functionality
2. Replace the immediate `os.path.exists()` check with a polling loop
3. Retry up to 10 times with 500ms delays (5 seconds total)
4. Log each retry attempt for debugging visibility
5. Provide a clear error message if file doesn't exist after all retries

## Steps to Reproduce
1. Run `uv run adw_plan.py <issue-number>` on a slower filesystem or under load
2. The planner agent completes successfully and outputs a plan file path
3. The script immediately checks `os.path.exists(plan_file_path)`
4. If filesystem sync hasn't completed, the check returns `False`
5. The script errors with "Plan file does not exist" and exits

## Root Cause Analysis
The root cause is in `adws/adw_plan.py` at lines 212-219:

```python
if not os.path.exists(plan_file_path):
    error = f"Plan file does not exist: {plan_file_path}"
    logger.error(error)
    make_issue_comment(
        issue_number,
        format_issue_message(adw_id, "ops", f"❌ {error}"),
    )
    sys.exit(1)
```

This code performs a **single, immediate check** without any retry logic. File systems, especially on macOS or networked storage, may have slight delays between a file being created by one process (Claude Code CLI) and being visible via `os.path.exists()` to another process. This is particularly common when:
- The file is still being written/flushed
- The filesystem hasn't fully synchronized
- Multiple processes are accessing the filesystem concurrently

## Relevant Files
Use these files to fix the bug:

- `adws/adw_plan.py` - The main file containing the bug. The race condition occurs at lines 212-219 where `os.path.exists()` is called immediately after the planner agent returns. This is the only file that needs modification.
- `adws/README.md` - Documentation for the ADW system. Provides context on how workflows operate and chain together. No changes needed.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add time module import
- Add `import time` to the imports section at the top of `adws/adw_plan.py`
- This module is part of Python's standard library and provides the `time.sleep()` function needed for polling delays

### 2. Implement retry mechanism for plan file verification
- Locate the file existence check at lines 212-219 in `adws/adw_plan.py`
- Replace the immediate `os.path.exists()` check with a polling loop that:
  - Defines `max_retries = 10` (configurable retry count)
  - Defines `retry_delay = 0.5` (500ms between attempts, totaling 5 seconds max wait)
  - Uses a `for` loop with `range(max_retries)` to attempt checks
  - Logs each retry attempt with attempt number for debugging: `logger.info(f"Waiting for plan file... (attempt {attempt + 1}/{max_retries})")`
  - Breaks out of the loop immediately when file is found: `logger.info(f"Plan file found: {plan_file_path}")`
  - Uses `time.sleep(retry_delay)` between attempts
  - Uses a `for...else` construct to handle the failure case when all retries are exhausted
- Keep the existing error reporting logic (GitHub comment and logging) but update the error message to indicate retry exhaustion: `f"Plan file not found after {max_retries} attempts: {plan_file_path}"`

### 3. Run validation commands
- Execute the validation commands listed below to verify the fix works correctly with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd adws && python -c "import adw_plan; print('Import successful')"` - Verify the module imports correctly with the new `time` import
- `cd adws && python -c "import time; print(f'time.sleep available: {callable(time.sleep)}')"` - Verify time module is available
- `cd app/server && uv run pytest` - Run server tests to validate the bug is fixed with zero regressions
- `cd app/client && bun tsc --noEmit` - Run frontend tests to validate the bug is fixed with zero regressions
- `cd app/client && bun run build` - Run frontend build to validate the bug is fixed with zero regressions

## Notes
- The `time` module is part of Python's standard library, so no additional dependencies need to be installed via `uv add`.
- The retry mechanism follows a common polling pattern that's robust across different filesystem types.
- The 5-second total wait time (10 × 500ms) is generous enough to handle most filesystem sync delays without being so long that it significantly impacts workflow execution time.
- The logging of retry attempts provides valuable debugging information if issues persist, making it easier to identify whether the problem is timing-related or something else.
- This bug does not affect UI or user interactions, so no E2E test is required.
- The fix is surgical and only modifies the specific file existence check without changing any other workflow logic.
