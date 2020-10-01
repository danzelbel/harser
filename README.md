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
- Request Header Presets

## Extension Settings

This extension contributes the following settings:

Required
- `harser.template.restsharp.cs`: The handlebars template to use for RestSharp.
- `harser.template.fetch.js`: The handlebars template to use for Fetch.

Optional
- `harser.requestHeaders.preset.1`: The handlebars template to use for header preset 1.
- `harser.requestHeaders.preset.2`: The handlebars template to use for header preset 2.
- `harser.requestHeaders.preset.3`: The handlebars template to use for header preset 3.