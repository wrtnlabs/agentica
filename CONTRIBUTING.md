# Contributing to @agentica/core 🤝

Thank you for your interest in contributing to @agentica/core! We welcome contributions from the community to help make this AI agent library even better. 🚀

## 🐛 Bug reports

We use GitHub issues to track bugs and errors.  
Please search existing issues before filing a new one.  
If you find a similar issue, add a comment to it instead of opening a new one.  

## 💡 Feature requests

Feature requests are welcome. For new features, open an issue first to discuss whether and what features you would like to see.

## 📝 How to resolve issue?

If you're looking for somewhere to start, check out the [gfi(good first issue)](https://github.com/wrtnlabs/agentica/issues?q=is%3Aissue+is%3Aopen+label%3Agfi) tags.  

If you want to work on an already existing issue, please leave a comment on that issue so others know someone is working on it.  
If you’re not entirely confident about the solution you plan to submit, feel free to share your thoughts or concerns in a comment at any time.  

We use the ["fork and pull" model](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-collaborative-development-models#fork-and-pull-model)

> In the fork and pull model, anyone can fork an existing ("upstream") repository to which they have read access and the owner of the upstream repository allows it. Be aware that a fork and its upstream share the same git data. This means that all content uploaded to a fork is accessible from the upstream and all other forks of that upstream. You do not need permission from the upstream repository to push to a fork of it you created. You can optionally allow anyone with push access to the upstream repository to make changes to your pull request branch. This model is popular with open-source projects as it reduces the amount of friction for new contributors and allows people to work independently without upfront coordination.

The contributors push changes to their personal fork and create a pull request to the upstream repository.  

### 💻 How to start?

1. Fork the repository
2. install `pnpm` and `nodejs`
3. Run `pnpm install` to install the dependencies
  - If not executed `pnpm prepare`, you should execute it
4. Run `pnpm dev` to start the development server
  - This server will check the compilation and type checking errors
5. Before pushing your changes, run pnpm test for each package (if applicable) and pnpm lint to check code quality.
  - We use `CHATGPT_API_KEY` environment variable to test the agent

6. Push your changes to your fork
7. Create a pull request


## 📦 Agentica Deployment Process

We use the `pnpm release` command to automatically bump the version and create a git tag.

This command will increment the version number and create a git tag, then push the tag to the remote repository.

GitHub Actions will then automatically publish the package to the npm registry.

Done! 🎉
