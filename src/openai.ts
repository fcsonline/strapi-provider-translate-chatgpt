import OpenAI from 'openai';

interface OpenAIOptions {
  apiKey: string;
  model: string;
  systemMessage: string;
}

interface ITranslateOptions {
  maxTokens: number;
}

class ChatGptTranslator {
  private _openAiClient: OpenAI | null = null;
  constructor(private readonly _options: OpenAIOptions) {}

  private _getOpenAiClient(): OpenAI {
    if (!this._openAiClient) {
      this._openAiClient = new OpenAI();
    }

    return this._openAiClient;
  }

  public async translate(
    text: string,
    srcLocale: string,
    targetLocale: string,
    options: ITranslateOptions,
  ): Promise<string> {
    try {
      const prompt = `Translate this from '${srcLocale}' in to '${targetLocale}':\n\n\`\`\`\n${text}\n\`\`\``;
      const completion = await this._getOpenAiClient().chat.completions.create({
        model: this._options.model,
        messages: [
          { role: 'system', content: this._options.systemMessage },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_completion_tokens: options.maxTokens,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      if (completion.choices[0]) {
        return String(completion.choices[0]?.message?.content).trim();
      }

      throw new Error('No result received');
    } catch (error) {
      // @ts-ignore
      const status = error?.response?.status;

      switch (status) {
        case 429:
          throw new Error('Too many requests');
        case 400:
          throw new Error(`Bad request: ${JSON.stringify(error)}`);
        default:
          throw new Error(`translate(): ${JSON.stringify(error)}`);
      }
    }
  }
  public async usage(): Promise<{
    count: number;
    limit: number;
  }> {
    return {
      count: 1,
      limit: 10,
    };
  }
}

const createTranslateClient = ({ apiKey, model, systemMessage }: OpenAIOptions) => {
  // TODO basePath.replace(/\/+$/, ""); remove last slash
  return new ChatGptTranslator({ apiKey, model, systemMessage });
};

export { createTranslateClient };
