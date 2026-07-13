import logging
import secrets

from fastapi import APIRouter, Cookie, Depends, File, HTTPException, UploadFile

from schemas.auth import UpdateProfileSchema, UserSchema
from services.auth import AuthService
from services.blob import BlobStorageError, VercelBlobStorage


router = APIRouter(prefix="/profile", tags=["Profile"])
ALLOWED_IMAGES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024
logger = logging.getLogger(__name__)


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
    image: UploadFile = File(...),
    letter_session: str | None = Cookie(default=None),
    service: AuthService = Depends(),
    storage: VercelBlobStorage = Depends(),
):
    if image_type not in {"avatar", "banner"}:
        raise HTTPException(status_code=404, detail="Неизвестный тип изображения")
    extension = ALLOWED_IMAGES.get(image.content_type or "")
    if not extension:
        raise HTTPException(status_code=422, detail="Разрешены JPEG, PNG и WebP")
    content = await image.read(MAX_IMAGE_SIZE + 1)
    if len(content) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Файл должен быть меньше 5 МБ")

    current_user = service.get_user_by_session(letter_session)
    previous_url = getattr(current_user, image_type)
    pathname = (
        f"profiles/{current_user.id}/"
        f"{image_type}-{secrets.token_urlsafe(16)}{extension}"
    )

    try:
        url = await storage.put(pathname, content, image.content_type or "image/jpeg")
    except BlobStorageError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    try:
        updated_user = service.update_image(letter_session, image_type, url)
    except Exception:
        try:
            await storage.delete(url)
        except BlobStorageError:
            logger.exception("Failed to clean up an unused profile image")
        raise

    if previous_url and ".blob.vercel-storage.com/" in previous_url:
        try:
            await storage.delete(previous_url)
        except BlobStorageError:
            logger.exception("Failed to delete the previous profile image")

    return updated_user


@router.get("/{username}", response_model=UserSchema)
def get_profile(username: str, service: AuthService = Depends()):
    return service.get_user_by_username(username)
