(Do not modify any of the following text)

# LinkedIn academy - build with ai


### https://www.linkedin.com/learning/build-with-ai-generate-an-api-with-ci-cd-in-claude-code/setting-up-claude-code?autoSkip=true&resume=false

### Keep nvm, npm, node uptodate

`nvm install --lts && nvm use --lts && nvm alias default 'lts/*' && node -v && npm -v`

## Chapter 1
### Install claude

`npm install -g @anthropic-ai/claude-code`

or

`npm install -g --allow-scripts=@anthropic-ai/claude-code`

or 

`npm config set allow-scripts=@anthropic-ai/claude-code --location=user`


- Connect to Pro account of claude
- Make claude use DeepWiki https://deepwiki.com
- Use dictation tool, fill up claude.md

Can you help me set up the project? Initially, we can get started with the Hello World API with HTTP GET API. 

shift + tab until 
- plan mode : takes time to come up with plan
- edits on and other mode : writes code directly

- Remote GitHub url for this project... Can you check the status and push all the necessary contents to this remote github repository
- I do not like the idea of exposing endpoints from the root domain, because this could be point of attack to bring down the system. Can this be fixed? Also make these changes in a feature branch.
- Open a PR against main branch
- merge it once the check passes, delete the feature branch and checkout the main.
- There are no tests at functional level or any integration test. Investigate both types of testing, implement in a feature branch and open a pull request against main branch.
- merge it once checks pass, delete the branch and switch to main
- possible to add coverage test as well? do the changes in a feature branch and create a pull request. Merge the pull request when all tests pass and delete the branch.
- merge it once checks pass, delete the branch and switch to main
- add github action file that runs on every pull request made and also upon push to main branch.
- CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are two variables in the git repository. Test if these exist and deploy the api to cloudflare workers as part of the new github action when we merge a branch to the main. Make sure all tests pass and add all changes to a feature branch, create pull request, merge the branch and delete the feature branch when everything is done. I want to call this linkedin-currency-converter.
- a new yaml file for this action i requested
- can you show me the history of all the prompts in bullet points
- deployed in https://linkedin-currency-converter.sathishkottravel.workers.dev/api/v1/convert?from=USD&to=SEK&amount=100



History:

Here's the full history of prompts and planning from this session:

1. Push to GitHub
- Prompt: "Remote GitHub url for this project... Can you check the status and push all the necessary contents to this remote github repository"
- No formal plan — direct execution: initialized git, committed, added remote, first push failed on credentials (wrong cached GitHub account), user resolved auth and pushed themselves.

2. Namespace routes off root
- Prompt: "I do not like the idea of exposing endpoints from the root domain... Also make these changes in a feature branch."
- Plan mode: clarified route prefix (/api/v1) and whether health stays at root (moved under prefix too, nothing left at bare /). Branch → PR #1 → merged.

3–4. Open/merge PR #1
- "Open a PR against main branch" → "merge it once the check passes, delete the feature branch and checkout the main." No CI existed yet.

5. Functional + integration tests
- Prompt: "There are no tests at functional level or any integration test. Investigate both types of testing, implement in a feature branch..."
- Researched Hono/Cloudflare testing guidance via DeepWiki, reorganized into unit/functional/integration Vitest projects, added @cloudflare/vitest-pool-workers for real-workerd integration tests. Had to pin compatibility_date back (tooling version mismatch). PR #2 → merged.

6. Merge PR #2 — "merge it once checks pass, delete the branch and switch to main"

7. Coverage
- Prompt: "possible to add coverage test as well?..."
- Researched coverage provider compatibility with workerd (v8 unsupported, Istanbul required). Added @vitest/coverage-istanbul + test:coverage script. PR #3 → merged.

8. Merge PR #3

9. CI workflow
- Prompt: "add github action file that runs on every pull request made and also upon push to main branch."
- Added .github/workflows/ci.yml: typecheck + test:coverage + coverage artifact. First real CI run in the repo. PR #4 → merged.

10. Cloudflare deploy
- Prompt: "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are two variables... Test if these exist and deploy the api... when we merge a branch to the main... I want to call this linkedin-currency-converter."
- Plan mode: confirmed both existed as GitHub secrets (gh secret list), researched cloudflare/wrangler-action@v4. First plan proposed extending ci.yml; user redirected — "a new yaml file for this action i requested" → separate self-contained deploy.yml. PR #5 → merged → real first deploy, verified live.

11. Prompt history request — "can you show me the history of all the prompts in bullet points"

12. Create/merge notes PR — "Now create a pull request, merge it and delete the branch" (user had manually committed prompt history to my_notes.md on feature/update-notes). PR #6 → merged.

13. Endpoint protection
- Prompt: "How can i protect the endpoints? Give me simple suggestions..."
- Plan mode, multiple rounds: chose bearer token (Hono bearer-auth) + rate limiting (Cloudflare native binding); chose to handle the live API_TOKEN secret themselves rather than have me set it. Verified several DeepWiki claims against actual installed package types (caught two inaccuracies: RateLimitOutcome shape, and a nonexistent secrets/vars option in cloudflareTest() — used miniflare.bindings instead). User rejected the first ExitPlanMode to insist on a feature branch — "Stick to the above plan... But do all changes in a feature branch." PR #7 → merged after user set the secret → verified 401 without token live.

14–17. Debugging the token
- "How to install wrangler...", "How to generate Bearer token...", "I set the secret already... bad request response", "some other way to verify allowed tokens" — diagnosed that 400 (not 401) means a malformed Authorization header (bad prefix or invalid characters), gave safe non-leaking diagnostic commands.

18. Test script
- Prompt: "save the testing commands to a script file"
- Added scripts/test-api-token.sh on a feature branch, PR #8 (open, unmerged).

19. Overwrite token — "I got invalid characters, now i need to overwrite with new token via wrangler" → gave regenerate + wrangler secret put overwrite instructions.

Current open item: PR #8 (test-api-token.sh) is still awaiting your merge instruction.

