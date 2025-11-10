interface AIResponse {
  text: string;
  tokensUsed: number;
  cost: number;
  model: string;
}

export class AIClients {
  async callAI(provider: string, prompt: string): Promise<AIResponse> {
    switch (provider) {
      case 'claude_sonnet':
        return this.callClaude(prompt);
      case 'gemini_pro':
      case 'gemini_flash':
        return this.callGemini(provider, prompt);
      case 'gpt5':
        return this.callOpenAI(prompt);
      case 'groq_llama':
        return this.callGroq(prompt);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private async callClaude(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) throw new Error(`Claude error: ${response.status}`);

    const data = await response.json();
    return {
      text: data.content[0].text,
      tokensUsed: data.usage.input_tokens + data.usage.output_tokens,
      cost: (data.usage.output_tokens / 1000) * 0.003,
      model: 'claude-3.5-sonnet'
    };
  }

  private async callGemini(provider: string, prompt: string): Promise<AIResponse> {
    const model = provider === 'gemini_pro' ? 'gemini-1.5-pro' : 'gemini-1.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini error: ${response.status}`);

    const data = await response.json();
    return {
      text: data.candidates[0].content.parts[0].text,
      tokensUsed: data.usageMetadata?.totalTokenCount || 0,
      cost: 0,
      model
    };
  }

  private async callOpenAI(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096
      })
    });

    if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens,
      cost: (data.usage.total_tokens / 1000) * 0.005,
      model: 'gpt-4o'
    };
  }

  private async callGroq(prompt: string): Promise<AIResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096
      })
    });

    if (!response.ok) throw new Error(`Groq error: ${response.status}`);

    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      tokensUsed: data.usage?.total_tokens || 0,
      cost: 0,
      model: 'llama-3.1-70b'
    };
  }
}

export const aiClients = new AIClients();
