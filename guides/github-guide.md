
# Git Bash
This guide helps you with common and basic GitHub operations using the shell (`git bash`), with short explanations and corresponding commands.

## 1. Delete a branch locally in secure mode
```sh
git branch -d branch_name 
```

## 2. Delete a branch locally in forced mode
```sh
git branch -D branch_name 
```

## 3. Delete a branch remotely
```sh
git push origin --delete branch_name
```

## 4. Clean up local references to branches
```sh
git fetch --prune
```