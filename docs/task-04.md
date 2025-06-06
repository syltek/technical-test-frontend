# Task 04 - Technical work: auth refresh flow

> [!WARNING]
> This task is **OPTIONAL** and you should tackle it only if you have the time and want to challenge how solid your solution for Part 1 was!

After our implementation on [part 1](#1-technical-work-filling-the-gaps-in-the-auth-flow) our users are getting kicked out every hour or so; and that is quite an inconvenience for them. We know our API supports making longer-lasting _sessions_; but it requires for clients to handle token refreshes.

You need to implement an automatic call to `POST /v3/auth/refresh` every time the retrieved `accessToken` expires. That new token set (access and refresh) must also be propagated upwards via `onAuthChange` of `AuthProvider` so it can be stored for future uses on reload.

For this task, make sure the PR you create starts and points to the task01 branch. That way it will only include the changes related to **this particular task**.

As always, remember to check the common [dos and don'ts](../README.md#dos-and-donts).
