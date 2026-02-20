# TAC-7 ZTE Workflow Integration - Migration Plan

## Current Status

✅ **COMPLETED:**
1. Created branch: `feature/integrate-tac7-zte-workflow`
2. Backed up custom files to `/tmp/backup_qr_track/`:
   - architect.md
   - scaffold.md
   - conditional_docs.md
   - e2e/ folder (11 test files)

## Next Steps - Execute in Terminal

```bash
cd /Users/juanbaez/Documents/qr-track-challenge

# 1. Eliminar .claude y copiar de TAC-7
rm -rf .claude
cp -r /Users/juanbaez/Documents/TAC_course/tac-7/.claude .

# 2. Restaurar archivos custom
cp /tmp/backup_qr_track/architect.md .claude/commands/
cp /tmp/backup_qr_track/scaffold.md .claude/commands/
cp /tmp/backup_qr_track/conditional_docs.md .claude/commands/
cp -r /tmp/backup_qr_track/e2e/ .claude/commands/

# 3. Eliminar adws y copiar de TAC-7
rm -rf adws
cp -r /Users/juanbaez/Documents/TAC_course/tac-7/adws .

# 4. Copiar scripts
cp -r /Users/juanbaez/Documents/TAC_course/tac-7/scripts .
```

## After Running Commands Above - Tell Claude:

"Ejecuté los comandos del migration_plan.md, continuemos"

Claude will then:
1. Update .gitignore to add `trees/`
2. Verify all files copied correctly
3. Commit changes with message: "feat: integrate TAC-7 ZTE workflow with isolation"

## Testing Phase (After Commit)

### Create Test Issue in GitHub
- **Title:** "Add logo to main screen"
- **Description:** "Add a simple logo image to the main landing page to test the new Zero Touch Execution workflow"
- **Label:** `chore` or `feature`

### Run ZTE Workflow
```bash
uv run adws/adw_sdlc_zte_iso.py <issue-number>
```

### Expected Behavior
✅ Creates worktree in `trees/<adw-id>/`
✅ PLAN phase completes
✅ BUILD phase completes
✅ TEST phase completes (4 tests: typescript, eslint, unit, build)
✅ REVIEW phase completes
✅ DOCUMENT phase completes
✅ **SHIP phase completes** (automatic merge to main)
✅ PR created and merged automatically
✅ Comments posted to issue

### Post-Test Validation
```bash
# 1. Check worktree was created
ls -la trees/

# 2. Inspect worktree (optional)
cd trees/<adw-id>/
ls -la

# 3. Check ports used
cat trees/<adw-id>/.ports.env

# 4. Review logs
ls -la agents/<adw-id>/

# 5. Verify code merged to main
git checkout main
git pull
git log --oneline -5

# 6. Clean up worktree when done
./scripts/purge_tree.sh <adw-id>

# 7. Return to feature branch
git checkout feature/integrate-tac7-zte-workflow
```

## Decision Point

### If Test Succeeds ✅
```bash
git checkout main
git merge feature/integrate-tac7-zte-workflow --no-ff
git push origin main
git branch -d feature/integrate-tac7-zte-workflow
```

Update project documentation:
- Document new workflow in README.md
- Add worktree cleanup instructions
- Note port ranges (9100-9114 backend, 9200-9214 frontend)

### If Test Fails ❌
1. Analyze error logs in `agents/<adw-id>/`
2. Check GitHub issue comments for details
3. Options:
   - Fix issues and retest
   - Rollback: `git checkout main && git branch -D feature/integrate-tac7-zte-workflow`

## Key Concepts - Worktrees

A worktree is an isolated copy of your repository:
- Located in `trees/<adw-id>/`
- Works on its own branch
- Has its own ports (configured in `.ports.env`)
- Can run servers simultaneously with other worktrees
- Shares the same `.git` history (no duplication)

**Example:**
```
trees/
├── abc123/  → Issue #30, ports 9100/9200
├── def456/  → Issue #31, ports 9101/9201
└── ghi789/  → Issue #32, ports 9102/9202
```

Each can run tests/servers in parallel without conflicts.

## Files Being Added

### New in .claude/commands/
- cleanup_worktrees.md
- health_check.md
- in_loop_review.md
- install_worktree.md
- track_agentic_kpis.md

### New in adws/
- adw_plan_iso.py
- adw_build_iso.py
- adw_test_iso.py
- adw_review_iso.py
- adw_document_iso.py
- adw_ship_iso.py ← **Merge to main automation**
- adw_sdlc_zte_iso.py ← **Zero Touch Execution**
- adw_sdlc_iso.py
- All orchestrator scripts with _iso suffix
- adw_modules/worktree_ops.py ← **Worktree management**

### New folder: scripts/
- purge_tree.sh ← Clean up worktrees
- check_ports.sh
- start.sh / stop_apps.sh
- reset_db.sh
- delete_pr.sh
- And more...

## Backup Location

Custom files backed up in: `/tmp/backup_qr_track/`
- Will be restored after copying .claude from TAC-7
- Contains: architect.md, scaffold.md, conditional_docs.md, e2e/

## Branch Info

- **Current branch:** feature/integrate-tac7-zte-workflow
- **Source branch:** main
- **Target:** main (after successful test)

---

**Resume command for Claude:**
"Ejecuté los comandos del migration_plan.md, continuemos"
