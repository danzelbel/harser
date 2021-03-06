[![MIT License](https://img.shields.io/github/license/danzelbel/harser)](https://github.com/danzelbel/harser/blob/master/LICENSE)
[![Version](https://vsmarketplacebadge.apphb.com/version/danzelbel.harser.svg)](https://marketplace.visualstudio.com/items?itemName=danzelbel.harser)
![Build](https://github.com/danzelbel/harser/workflows/build/badge.svg)
![Release](https://github.com/danzelbel/harser/workflows/release/badge.svg)

# harser

Generate code from HAR files

![features](images/readme/preview.gif)

## Features

- Generate C# - RestSharp code
- Generate JavaScript - Fetch code
- Generate Github Actions code
- Request Header Presets

## Extension Settings

This extension contributes the following settings:

Required
- `harser.template.restsharp.cs`: The handlebars template to use for RestSharp.
- `harser.template.fetch.js`: The handlebars template to use for Fetch.
- `harser.template.githubActions.js`: The handlebars template to use for Github Actions JavaScript.
- `harser.template.githubActions.yml`: The handlebars template to use for Github Actions YAML.
- `harser.template.githubActions.README.md`: The handlebars template to use for Github Actions README.

Optional
- `harser.requestHeaders.preset.1`: The list of names to filter the request headers.
- `harser.requestHeaders.preset.2`: The list of names to filter the request headers.
- `harser.requestHeaders.preset.3`: The list of names to filter the request headers.