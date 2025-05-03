from pydantic import BaseModel

class TranslateWord(BaseModel):
    word: str

class LikePayload(BaseModel):
    content_id: int
    content_type: str