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


