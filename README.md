<h1 align="center">Welcome to action-check-pr-title 👋</h1>
<p>
  <a href="https://github.com/Slashgear/action-check-pr-title/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/Slashgear\_" target="_blank">
    <img alt="Twitter: Slashgear_" src="https://img.shields.io/twitter/follow/Slashgear_.svg?style=social" />
  </a>
  <a href="https://github.com/Slashgear/action-check-pr-title/actions/workflows/ci.yml" target="_blank">
    <img alt="Continous Integration" src="https://github.com/Slashgear/action-check-pr-title/actions/workflows/ci.yml/badge.svg" />
  </a>
</p>

> Github action to check Pull Request title based on JS Regexp
>
> This action in really simple and use Github Action core library base on event of your pull requests
> No need to install anything on your runner to use it.
> Simple, fast, reliable 🎉

## Usage

This action allows you to include a title check of a pull request automatically. This action only works on `pull_request` events.

To use it, add the following steps in your workflow:

### Default usage

```yaml
steps:
  - uses: Slashgear/action-check-pr-title@v4.3.0
    with:
      regexp: "([a-z])+" # Regex the title should match.
```

### Customize Regexp

```yaml
steps:
  - uses: Slashgear/action-check-pr-title@v4.3.0
    with:
      regexp: "([a-z])+" # Regex the title should match.
      flags: "i" # Flags to add to the regexp
```

### Add helper message

```yaml
steps:
  - uses: Slashgear/action-check-pr-title@v4.3.0
    with:
      regexp: "(feat|fix|docs): .++" # Regex the title should match.
      helpMessage: "Example: 'feat: example of title'"
```

## Author

👤 **Slashgear**

- Website: https://blog.slashgear.dev/
- Twitter: [@Slashgear\_](https://twitter.com/Slashgear_)
- Github: [@Slashgear](https://github.com/Slashgear)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Slashgear/action-check-pr-title/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Slashgear](https://github.com/Slashgear).<br />
This project is [MIT](https://github.com/Slashgear/action-check-pr-title/blob/main/LICENSE) licensed.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
\n## Stale PRs

Stale pull requests (PRs) are those that have not had any activity for a certain period of time. It's important to manage stale PRs to keep the project's pull requests manageable and to ensure that contributions are either moving forward or being closed if they are no longer relevant.

Stale PRs are managed by using the [Stale](https://github.com/actions/stale):
- PRs with no activity for 30 days are marked as stale
- stale PRs for 10 days are closed
