from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class LoginUser(BaseModel):
    email: str
    password: str

class CreateUserModel(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    username: str = Field(..., min_length=3, max_length=30)
    gender: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    captchaToken: Optional[str] = None

class NewPicture(BaseModel):
    image: str

class AddToVocabulary(BaseModel):
    word: str

class AddToVocabularyManually(BaseModel):
    word: str
    translation: str

class EditWord(BaseModel):
    word_id: int
    translation: str

class VocabularyWord(BaseModel):
    id: int
    english_word: str
    russian_translation: str
    is_learned: bool
    created_at: datetime
    learned_at: Optional[datetime] = None

class UpdateWordStatus(BaseModel):
    word_id: int
    is_learned: bool