---
file:
  basename: .verb.md
---
## Usage

Register the plugin with your [base][] application:

```js
var Base = require('base');
var engines = require('{%= name %}');
base.use(engines());
```

## API
{%= apidocs("index.js") %}
