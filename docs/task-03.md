# Task 03 - Pull Request review: showing correct dates

> [!NOTE]
> This part will make you take the role of a reviewer in a made-up pull-request. We want to see how you review code from others as well getting a feeling of your balance between constructive feedback and code-ownership.

Our team recently received a bug request regarding the dates shown in the matches table. Looks like the times are not being displayed correctly for some Clubs in the US. A team-mate of yours already did the analysis, found the root cause of the problem, and prepared a fix. You need to review them before they can be merged into the release pipeline.

Because we want to simulate a PR scenario you are going to open a PR targeting **your fork of the repo** using the branch `bug/matches-times` (which should be already in your repo). For the title and description of the Pull Request use [the ones below](#pull-request-content).

**Dos and Don'ts**
- You **must** leave a review comment stating if you would ✅ **Approve**; 💬 **Request changes** ;or ❌ **Request changes**
- You **should** leave a review in the code's PR
- You **shouldn't** make changes in code itself

--- 

## Pull Request Content
**Title**:
```md
Bugfix: Show local times for match dates
```

**Description**:
```md
## Summary of the changes
Parse the dates on matches table using `Date` so they can be displayed according to browser local-time.

Before these changes we were manipulating the date as a string; which led to incorrect results because the API **always** returns UTC times. This meant the dates/times would be incorrect for anyone visiting from non-UTC timezones (i.e.: most of the world at some point in the year).

## Motivation
This bug got reported by US clubs to our customer-support team. See [Ticket#123](#not-a-real-link) for the original report.
```
