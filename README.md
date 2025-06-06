# ChatGPT provider for Strapi Translate Plugin

Configure the provider through the pluginOptions:

```js
module.exports = {
  // ...
  translate: {
    enabled: true,
    config: {
      // Choose one of the available providers
      provider: 'chatgpt',
      // Pass credentials and other options to the provider
      providerOptions: {
        // your API key - required and wil cause errors if not provided
        apiKey: 'sk-...',
        // use base path - default: 'https://api.openai.com/v1'
        basePath: 'https://api.openai.com/v1',
        // model - default: 'text-davinci-003'
        model: 'text-davinci-003',
        // systemMessage - System message provied to OpenAI - default : 'You are a professional translator.'
        systemMessage: 'You are a professional translator.',
        // max tokens used per one translate operation - default: 1000 
        maxTokens: 1000,
        // use custom locale mapping (for example 'en' locale is deprecated so need to choose between 'EN-GB' and 'EN-US')
        localeMap: {
          // use uppercase here!
          EN: 'EN-US',
        },
          
      },
      // other options ...
    },
  },
  // ...
}
```

or use the default environment variables:


- `OPENAI_API_KEY` - default `undefined`
- `OPENAI_MODEL` - default `text-davinci-003`
- `OPENAI_BASE_PATH` - default `https://api.openai.com/v1`
- `OPENAI_MAX_TOKENS` - default `1000`
  

To get an API key, register for [platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys).

## Limitations:

To be described