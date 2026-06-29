from schemas.KodikAPI import Material


def remove_duplicate_titles(items: list[Material]) -> list[Material]:
    seen: set[str] = set()
    result: list[Material] = []

    for item in items:
        key = (
            item.material_data.anime_title
            if item.material_data and item.material_data.anime_title
            else item.title
        )

        if not key:
            continue

        key = key.lower().strip()

        if key in seen:
            continue

        seen.add(key)
        result.append(item)

    return result