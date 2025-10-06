from pydantic import BaseModel
from fastapi import FastAPI
from typing import Optional

class Nieuwe_bron(BaseModel):
    bron_titel: str
    bron_tekst: str
    bron_link: Optional | str | None = None
    bron_video: Optional | str | None = None