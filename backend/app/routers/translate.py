from pydantic import BaseModel
from openai import OpenAI
from app.config import (
    AI_PROVIDER, DEEPSEEK_API_KEY, DEEPSEEK_MODEL,
    MINIMAX_API_KEY, MINIMAX_MODEL
)
from fastapi import APIRouter, HTTPException
import json, re

router = APIRouter()

# 根据 provider 选择对应的 client
if AI_PROVIDER == "minimax":
    client = OpenAI(
        api_key=MINIMAX_API_KEY,
        base_url="https://api.minimaxi.com/v1",
        timeout=30.0,
    )
    MODEL = MINIMAX_MODEL
else:
    client = OpenAI(
        api_key=DEEPSEEK_API_KEY,
        base_url="https://api.deepseek.com",
        timeout=30.0,
    )
    MODEL = DEEPSEEK_MODEL


class TranslateRequest(BaseModel):
    text: str
    mode: str = "zh2en"  # zh2en 或 en2zh


class TranslateResponse(BaseModel):
    word: str
    phonetic_blocks: list[str]
    mnemonic: str  # 谐音助记
    sentence: str
    sentence_translation: str


SYSTEM_PROMPT = """你是一个专为三年级小学生英语学习设计的AI助手。重要：谐音助记必须基于真实的音标发音来转换！"""

USER_PROMPT_ZH2EN = """用户输入中文单词: {text}

请完成以下任务，返回JSON格式：
1. 翻译成英文单词
2. 将单词按自然拼读(Phonics)规则拆分成发音音节块
3. 【重要】生成谐音助记：用中文拼音模拟整个单词的实际发音，要接近英文发音！
   正确例子：
   - building → "比尔丁"（bi er ding，像 building 发音）
   - elephant → "爱勒芬特"（ai le fen te，像 elephant 整体发音）
   - tiger → "太格儿"（tai ge er，像 tiger 整体发音）
   - snake → "斯内克"（si nei ke，像 snake 整体发音）
   - car → "卡尔"（ka er，像 car 整体发音）
   谐音要短（2-6个汉字），关键是听起来像英文发音，不要翻译成中文意思！
4. 生成一句极简的例句（只使用三年级学生熟悉的词汇，不超过50词）
5. 给出例句的中文翻译

请只返回JSON，不要有其他内容：
{{"word": "Building", "phonetic_blocks": ["Buil", "ding"], "mnemonic": "比尔丁", "sentence": "The building is very tall.", "sentence_translation": "这栋楼房很高。"}}"""


def parse_json_response(content: str) -> dict:
    """从 AI 返回内容中提取 JSON，按括号匹配确保完整"""
    # 去掉思考标签内容
    content = re.sub(r'<think>.*?', '', content, flags=re.DOTALL)
    # 去掉 markdown 代码块标记
    content = re.sub(r'```json\s*', '', content)
    content = re.sub(r'```\s*', '', content)
    content = content.strip()

    # 找第一个 {
    first_brace = content.find('{')
    if first_brace == -1:
        raise ValueError(f"无法解析 AI 返回内容: {content[:200]}")

    # 按括号匹配，找到对应的结尾 }
    depth = 0
    end_pos = -1
    for i, ch in enumerate(content[first_brace:], start=first_brace):
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                end_pos = i
                break

    if end_pos == -1:
        raise ValueError(f"无法解析 AI 返回内容: {content[:200]}")

    trial = content[first_brace:end_pos + 1]
    return json.loads(trial)


@router.post("/", response_model=TranslateResponse)
def translate(request: TranslateRequest):
    if request.mode == "zh2en":
        prompt = USER_PROMPT_ZH2EN.format(text=request.text)
    else:
        prompt = f"翻译成中文: {request.text}\n\n请只返回JSON：{{\"word\": \"中文翻译\", \"phonetic_blocks\": [], \"sentence\": \"\", \"sentence_translation\": \"\"}}"

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"AI 服务暂时不可用: {str(e)}")

    content = response.choices[0].message.content.strip()

    try:
        data = parse_json_response(content)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return TranslateResponse(**data)