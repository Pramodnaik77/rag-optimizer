from groq import Groq
from openai import OpenAI
from anthropic import Anthropic
from google import genai
from app.config import settings
from app.core.constants import (
    LLMProvider, GROQ_MODELS, OPENAI_MODELS,
    ANTHROPIC_MODELS, RAG_PROMPT_TEMPLATE
)
from app.core.exceptions import LLMProviderError
from typing import Tuple

class LLMService:
    def __init__(self):
        self.groq_client = None
        self.openai_client = None
        self.anthropic_client = None
        self.gemini_client = None

    def _get_groq_client(self) -> Groq:
        if self.groq_client is None:
            if not settings.GROQ_API_KEY:
                raise LLMProviderError("GROQ_API_KEY not set")
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        return self.groq_client

    def _get_openai_client(self, api_key: str = None) -> OpenAI:
        key = api_key or settings.OPENAI_API_KEY
        if not key:
            raise LLMProviderError("OpenAI API key required")
        return OpenAI(api_key=key)

    def _get_anthropic_client(self, api_key: str = None) -> Anthropic:
        key = api_key or settings.ANTHROPIC_API_KEY
        if not key:
            raise LLMProviderError("Anthropic API key required")
        return Anthropic(api_key=key)

    def _get_gemini_client(self) -> genai.Client:
        if self.gemini_client is None:
            if not settings.GEMINI_API_KEY:
                raise LLMProviderError("GEMINI_API_KEY not set")
            self.gemini_client = genai.Client(api_key=settings.GEMINI_API_KEY)
        return self.gemini_client

    def generate_answer(
        self,
        query: str,
        context: str,
        provider: LLMProvider,
        model: str = None,
        api_key: str = None
    ) -> Tuple[str, int, int, float]:
        """
        Generate answer using LLM
        Returns: (answer, input_tokens, output_tokens, cost)
        """
        prompt = RAG_PROMPT_TEMPLATE.format(context=context, query=query)

        try:
            if provider == LLMProvider.GROQ:
                return self._generate_groq(prompt, model)
            elif provider == LLMProvider.OPENAI:
                return self._generate_openai(prompt, model, api_key)
            elif provider == LLMProvider.ANTHROPIC:
                return self._generate_anthropic(prompt, model, api_key)
            elif provider == LLMProvider.GEMINI:
                return self._generate_gemini(prompt, model)
            else:
                raise LLMProviderError(f"Unknown provider: {provider}")
        except Exception as e:
            raise LLMProviderError(f"LLM generation failed: {str(e)}")

    def _generate_groq(self, prompt: str, model: str = None) -> Tuple[str, int, int, float]:
        client = self._get_groq_client()
        model = model or "llama-3.1-8b-instant"

        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )

        answer = response.choices[0].message.content
        input_tokens = response.usage.prompt_tokens
        output_tokens = response.usage.completion_tokens

        # Calculate cost
        model_config = GROQ_MODELS.get(model, GROQ_MODELS["llama-3.1-8b-instant"])
        cost = (
            (input_tokens / 1_000_000) * model_config["cost_per_1m_input"] +
            (output_tokens / 1_000_000) * model_config["cost_per_1m_output"]
        )

        return answer, input_tokens, output_tokens, cost

    def _generate_openai(self, prompt: str, model: str = None, api_key: str = None) -> Tuple[str, int, int, float]:
        client = self._get_openai_client(api_key)
        model = model or "gpt-3.5-turbo"

        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=500
        )

        answer = response.choices[0].message.content
        input_tokens = response.usage.prompt_tokens
        output_tokens = response.usage.completion_tokens

        model_config = OPENAI_MODELS.get(model, OPENAI_MODELS["gpt-3.5-turbo"])
        cost = (
            (input_tokens / 1_000_000) * model_config["cost_per_1m_input"] +
            (output_tokens / 1_000_000) * model_config["cost_per_1m_output"]
        )

        return answer, input_tokens, output_tokens, cost

    def _generate_anthropic(self, prompt: str, model: str = None, api_key: str = None) -> Tuple[str, int, int, float]:
        client = self._get_anthropic_client(api_key)
        model = model or "claude-3-haiku-20240307"

        response = client.messages.create(
            model=model,
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )

        answer = response.content[0].text
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens

        model_config = ANTHROPIC_MODELS.get(model, ANTHROPIC_MODELS["claude-3-haiku-20240307"])
        cost = (
            (input_tokens / 1_000_000) * model_config["cost_per_1m_input"] +
            (output_tokens / 1_000_000) * model_config["cost_per_1m_output"]
        )

        return answer, input_tokens, output_tokens, cost

    def _generate_gemini(self, prompt: str, model: str = None) -> Tuple[str, int, int, float]:
        client = self._get_gemini_client()
        model = model or "gemini-3-flash-preview"

        response = client.models.generate_content(
            model=model,
            contents=prompt
        )

        answer = response.text or ""

        # Gemini free tier does not always return usage
        usage = getattr(response, "usage_metadata", None)

        input_tokens = usage.prompt_token_count if usage else 0
        output_tokens = usage.candidates_token_count if usage else 0

        # Free tier → cost = 0 (important for UI + metrics)
        cost = 0.0

        return answer, input_tokens, output_tokens, cost

# Singleton
llm_service = LLMService()
