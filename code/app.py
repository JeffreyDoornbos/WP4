# app.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.studenten_controller import router as studenten_router
from controllers.dashboard_controller import router as dashboard_router
from controllers.login_controller import router as login_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

app.include_router(
    studenten_router,
    prefix="/api/studenten",
    tags=["studenten"],
)

app.include_router(
    dashboard_router,
    prefix="/api/dashboard",
    tags=["dashboard"],
)
app.include_router(
    login_router,
    prefix="/api/login",
    tags=["login"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)