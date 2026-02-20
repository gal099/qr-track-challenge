# Automatic Cleanup Plan - ZTE Workflow Enhancement

## Goal
Add automatic cleanup after successful SHIP phase to achieve true "Zero Touch Execution"

## Current State
After successful merge to main, the workflow leaves:
- ✅ Remote branch still exists (e.g., `feature-issue-31-adw-2a8b5aed-add-logo-main-screen`)
- ✅ Worktree still exists in `trees/<adw-id>/`
- ✅ Logs preserved in `agents/<adw-id>/` (this is good)

## Proposed Changes

### File to Modify
`adws/adw_ship_iso.py`

### Changes to Implement

After successful merge to main, add:

```python
# 1. Delete remote branch
subprocess.run([
    "git", "push", "origin", "--delete", branch_name
], cwd=repo_path, check=True)

# 2. Clean up worktree
subprocess.run([
    "./scripts/purge_tree.sh", adw_id
], cwd=repo_path, check=True)
```

### What Gets Cleaned Up (Automatically)
- ❌ Remote branch on GitHub
- ❌ Worktree in `trees/<adw-id>/`
- ❌ Local branch reference

### What Gets Preserved (Always)
- ✅ Logs in `agents/<adw-id>/`
- ✅ Code merged in main
- ✅ PR on GitHub (merged and closed)
- ✅ Issue comments and history
- ✅ Spec files in main's `specs/` directory

## Error Handling

```python
try:
    # Delete remote branch
    subprocess.run([...], check=True)
    logger.info(f"✅ Deleted remote branch: {branch_name}")
except subprocess.CalledProcessError as e:
    logger.warning(f"⚠️ Failed to delete remote branch: {e}")
    # Continue anyway - not critical

try:
    # Clean worktree
    subprocess.run([...], check=True)
    logger.info(f"✅ Cleaned up worktree: {adw_id}")
except subprocess.CalledProcessError as e:
    logger.warning(f"⚠️ Failed to clean worktree: {e}")
    # Continue anyway - not critical
```

## Testing Plan

1. Create test issue in GitHub (simple feature)
2. Run ZTE workflow: `CLAUDE_CODE_PATH=claude uv run adws/adw_sdlc_zte_iso.py <issue-number>`
3. Verify after completion:
   - Remote branch deleted: `git ls-remote --heads origin | grep <branch-name>` (should be empty)
   - Worktree cleaned: `ls trees/` (should not contain `<adw-id>`)
   - Logs preserved: `ls agents/<adw-id>/` (should exist)
   - Code in main: `git log main --oneline -5` (should show merge commit)

## Benefits

1. **True Zero Touch** - Fully automated from issue to production
2. **Clean Repository** - No orphaned branches accumulating
3. **Disk Space** - Worktrees cleaned automatically
4. **Developer Experience** - One command, everything handled

## Rollback Plan

If cleanup causes issues:
- Revert the changes to `adw_ship_iso.py`
- Return to manual cleanup: `./scripts/purge_tree.sh <adw-id>`
- Branch can be recovered from GitHub if needed before deletion

## Implementation Branch

Branch name: `feature/auto-cleanup-after-ship`
Based on: `feature/integrate-tac7-zte-workflow`
Target: `main` (after testing)

---

**Next Steps:**
1. Push `feature/integrate-tac7-zte-workflow` to remote
2. Create `feature/auto-cleanup-after-ship` branch
3. Implement changes in `adw_ship_iso.py`
4. Test with simple issue
5. Merge to main if successful
