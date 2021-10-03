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

## Usage

This action allows you to include a title check of a pull request automatically. This action only works on `pull_request` events.

To use it, add the following steps in your workflow:

```yaml
steps:
- uses: Slashgear/action-check-pr-title@2.0.0
  with:
    regex: '([a-z])+' # Regex the title should match.
```

## Author

👤 **Slashgear**

* Website: http://slashgear.github.io/
* Twitter: [@Slashgear_](https://twitter.com/Slashgear_)
* Github: [@Slashgear](https://github.com/Slashgear)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Slashgear/action-check-pr-title/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Slashgear](https://github.com/Slashgear).<br />
This project is [MIT](https://github.com/Slashgear/action-check-pr-title/blob/main/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
