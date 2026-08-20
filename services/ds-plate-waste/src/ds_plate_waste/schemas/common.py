from enum import Enum


class MenuComponentType(str, Enum):
    """Canonical menu component types per CONTEXT.md (Komposisi Nutrisi & Manifest Distribusi)."""

    LAUK_UTAMA = "LAUK_UTAMA"
    SAYUR = "SAYUR"
    NASI = "NASI"
    BUAH = "BUAH"


class PlateWasteLevel(str, Enum):
    """Maps 1:1 to the 4-step visual Plate Waste Selector (ADR-0005 / SPEC.md Step 2)."""

    HABIS_TOTAL = "HABIS_TOTAL"
    SISA_SEDIKIT = "SISA_SEDIKIT"
    SISA_SEPARUH = "SISA_SEPARUH"
    HAMPIR_TIDAK_DIMAKAN = "HAMPIR_TIDAK_DIMAKAN"


class ReasonTagCategory(str, Enum):
    """Coarse bucket for quick-tag reason chips (SPEC.md Step 3).

    The canonical chip taxonomy is owned by the Epic 4 student feedback form,
    which does not exist yet. Callers may supply this optional coarse category
    alongside a free-form ``tag_id``; if omitted, the service buckets by an
    internal keyword map (see domain.recommendations).
    """

    TASTE_POSITIVE = "TASTE_POSITIVE"
    TASTE_NEGATIVE = "TASTE_NEGATIVE"
    TEXTURE_NEGATIVE = "TEXTURE_NEGATIVE"
    TEMPERATURE_NEGATIVE = "TEMPERATURE_NEGATIVE"
    PORTION = "PORTION"
