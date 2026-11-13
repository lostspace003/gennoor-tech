---
name: gennoor-ship
description: How a change to gennoor-tech goes live - branch, checks, pull request written in plain words, squash merge, local folder matching GitHub, and confirming the deploy. Use when asked to "create a pull request, push, merge", "do everything", "ship it", "same in local and GitHub", or when finishing any piece of work in the gennoor-tech repo.
---

# Shipping a change

`main` deploys itself to the live site (Azure App Service, by GitHub Actions) in about ten minutes.
So nothing goes to `main` unchecked, and the owner expects the whole route to be done without being asked
again: branch, pull request, merge, and the local folder left identical to GitHub.

## The route

```bash
git checkout -b <short-name-of-the-change>          # never work on main
# ... the work ...
npx tsc --noEmit && npx next build                   # both must pass
git add <the files you mean>                         # never `git add -A` blindly: see "never commit"
git commit                                           # message: what changes for people, then how
git push -u origin <branch>
gh pr create --title "<what changes, in plain words>" --body "<see below>"
gh pr view <n> --json statusCheckRollup,mergeStateStatus   # wait for the "build" check
gh pr merge <n> --squash --delete-branch
git checkout main && git fetch --prune origin && git merge --ff-only origin/main
git rev-parse HEAD origin/main && git status --short   # same commit, nothing left over
gh run list --limit 3                                 # the deploy: wait for "success", then look at the live page
```

A second push to `main` while a deploy is running cancels the first; the newer run carries both.

## The pull request

Written for a reader who does not write code. Plain words, short sentences, no jargon.

- **What changes for people** (visitors, staff), as a list.
- **How**, briefly, for whoever maintains it.
- **Checked**: exactly what was run or looked at.
- **Not checked**: what nobody has seen, heard or tried. Always say it; never claim more than was done.

End commit messages with the `Co-Authored-By` line and pull requests with the Claude Code line the
session gives.

## Never commit

- `~$*.pptx`, `~$*.xlsx` (Office lock files), anything in `scripts/show/.work`, `.env.local`, keys or tokens.
- Videos over about 10 MB: they go to the media store, not the repository.

## On this machine

- `rtk` is in the owner's notes but is not installed: run plain `git`, `gh`, `npx`.
- Git Bash rewrites arguments that start with `/` into Windows paths. Page names go without the slash
  (`node scripts/shot.mjs out home training`); use `MSYS_NO_PATHCONV=1` for Azure resource ids.
- Do not write Python or text with quotes and `\n` in a shell heredoc: it is mangled. Write the script to a
  file with the Write tool and run it. A script that stops on an `assert` has changed nothing: read its output.
- Files may have Windows line endings; an edit script must match them.
- The preview site is `npx next dev -p 3111`. Stop it when the work is done.

## Do not, without being asked

- Send a real email, even as a test. The email service allows about 100 sends an hour.
- Type a password, a card number or a secret anywhere. The owner does that.
- Close the owner's PowerPoint or Excel.
- Delete a branch that has work not on GitHub, or force-push.
