import secrets
from pathlib import Path

from fastapi import APIRouter, Cookie, Depends, File, HTTPException, Request, UploadFile

from schemas.auth import UpdateProfileSchema, UserSchema
from services.auth import AuthService


router = APIRouter(prefix="/profile", tags=["Profile"])
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"
ALLOWED_IMAGES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024


@router.patch("/me", response_model=UserSchema)
def update_profile(
    payload: UpdateProfileSchema,
    letter_session: str | None = Cookie(default=None),
    service: AuthService = Depends(),
):
    return service.update_profile(letter_session, payload)


@router.post("/me/{image_type}", response_model=UserSchema)
async def upload_profile_image(
    image_type: str,
    request: Request,
    image: UploadFile = File(...),
    letter_session: str | None = Cookie(default=None),
    service: AuthService = Depends(),
):
    if image_type not in {"avatar", "banner"}:
        raise HTTPException(status_code=404, detail="Неизвестный тип изображения")
    extension = ALLOWED_IMAGES.get(image.content_type or "")
    if not extension:
        raise HTTPException(status_code=422, detail="Разрешены JPEG, PNG и WebP")
    content = await image.read(MAX_IMAGE_SIZE + 1)
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Файл должен быть меньше 5 МБ")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{image_type}-{secrets.token_urlsafe(16)}{extension}"
    (UPLOAD_DIR / filename).write_bytes(content)
    url = str(request.url_for("uploads", path=filename))
    return service.update_image(letter_session, image_type, url)


@router.get("/{username}", response_model=UserSchema)
def get_profile(username: str, service: AuthService = Depends()):
    return service.get_user_by_username(username)
