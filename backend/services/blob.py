import os
import secrets
import time

from httpx import AsyncClient, HTTPError


class BlobStorageError(RuntimeError):
    pass


class VercelBlobStorage:
    API_URL = "https://vercel.com/api/blob"

    @staticmethod
    def _credentials(oidc_token: str | None = None) -> tuple[str, str]:
        oidc_token = oidc_token or os.getenv("VERCEL_OIDC_TOKEN")
        store_id = os.getenv("BLOB_STORE_ID", "").removeprefix("store_")
        if not oidc_token or not store_id:
            raise BlobStorageError("Vercel Blob is not connected to this deployment")
        return oidc_token, store_id

    @classmethod
    def _headers(
        cls,
        *,
        oidc_token: str | None = None,
        content_type: str | None = None,
    ) -> dict[str, str]:
        oidc_token, store_id = cls._credentials(oidc_token)
        headers = {
            "Authorization": f"Bearer {oidc_token}",
            "x-api-blob-request-id": (
                f"{store_id}:{int(time.time() * 1000)}:{secrets.token_hex(8)}"
            ),
            "x-api-blob-request-attempt": "0",
            "x-api-version": "12",
            "x-vercel-blob-store-id": store_id,
        }
        if content_type:
            headers["x-content-type"] = content_type
        return headers

    async def put(
        self,
        pathname: str,
        content: bytes,
        content_type: str,
        oidc_token: str | None = None,
    ) -> str:
        headers = self._headers(oidc_token=oidc_token, content_type=content_type)
        headers.update(
            {
                "x-vercel-blob-access": "public",
                "x-add-random-suffix": "0",
            }
        )
        try:
            async with AsyncClient(timeout=30) as client:
                response = await client.put(
                    f"{self.API_URL}/",
                    params={"pathname": pathname},
                    headers=headers,
                    content=content,
                )
                response.raise_for_status()
        except HTTPError as error:
            raise BlobStorageError("Failed to upload image to Vercel Blob") from error

        url = response.json().get("url")
        if not isinstance(url, str) or not url:
            raise BlobStorageError("Vercel Blob returned an invalid upload response")
        return url

    async def delete(self, url: str, oidc_token: str | None = None) -> None:
        headers = self._headers(oidc_token=oidc_token)
        headers["content-type"] = "application/json"
        try:
            async with AsyncClient(timeout=30) as client:
                response = await client.post(
                    f"{self.API_URL}/delete",
                    headers=headers,
                    json={"urls": [url]},
                )
                response.raise_for_status()
        except HTTPError as error:
            raise BlobStorageError("Failed to delete image from Vercel Blob") from error
