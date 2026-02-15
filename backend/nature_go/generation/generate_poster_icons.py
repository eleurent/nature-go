#!/usr/bin/env python3
"""Generate SVG poster icons using recraft-ai/recraft-v3-svg on Replicate.

Reads poster definitions from backend/nature_go/poster/posters.py and generates
a consistent SVG icon for each poster category.

Usage:
    # Generate all icons (from project root):
    REPLICATE_API_TOKEN=r8_xxx python backend/nature_go/generation/generate_poster_icons.py

    # Generate specific icons:
    REPLICATE_API_TOKEN=r8_xxx python backend/nature_go/generation/generate_poster_icons.py birds_owls birds_corvids

    # Regenerate specific icons (overwrites existing):
    REPLICATE_API_TOKEN=r8_xxx python backend/nature_go/generation/generate_poster_icons.py --force birds_owls

    # List all poster IDs:
    python backend/nature_go/generation/generate_poster_icons.py --list
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request

# --- Paths ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
# Script is at backend/nature_go/generation/ -> project root is 3 levels up
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)  # backend/nature_go/
PROJECT_ROOT = os.path.dirname(os.path.dirname(BACKEND_DIR))  # project root
OUTPUT_DIR = os.path.join(
    PROJECT_ROOT, "frontend-pwa", "public", "images", "poster-icons"
)

REPLICATE_MODEL = "recraft-ai/recraft-v3-svg"

# --- Prompt templates ---
BIRD_TEMPLATE = (
    "a {species}, 19th century ornithology sketch, "
    "simplified, no details, black and white, no background or container"
)
PLANT_TEMPLATE = (
    "a {species}, 19th century botany sketch, "
    "simplified, no details, black and white, no background or container"
)

# Emblematic species per poster. For type-based posters, pick the most
# iconic/recognizable species. Regional posters use CUSTOM_PROMPTS instead.
EMBLEMATIC_SPECIES = {
    # Birds - Types
    "birds_corvids": "Common Raven",
    "birds_owls": "Barn Owl",
    "birds_waterfowl": "Mallard Duck",
    "birds_raptors": "Peregrine Falcon",
    "birds_waders": "Grey Heron",
    "birds_songbirds": "European Robin singing",
    "birds_seabirds": "Atlantic Puffin",
    "birds_colorful": "Common Kingfisher",  # uses color prompt override below
    "birds_rails_grebes": "Eurasian Coot",
    "birds_backyard": "House Sparrow",
    "birds_woodland": "Great Spotted Woodpecker",
    "birds_pigeons": "Rock Dove",
    # Plants - Types
    "plants_orchids": "Bee Orchid flower",
    "plants_hedgerow": "Blackberry branch with fruit",
    "plants_lawn": "Common Daisy flower",
}

# Full custom prompts for posters that need special handling:
# - Regional posters (species name alone doesn't work)
# - Colorful birds (should be in color, not black and white)
CUSTOM_PROMPTS = {
    # Regional birds - national symbols, with color for identity
    "birds_us": (
        "a Bald Eagle, 19th century ornithology illustration, simplified, no"
        " details, no background or container"
    ),
    "birds_uk": (
        "a European Robin with red breast, 19th century ornithology"
        " illustration, simplified, no details, no background or container"
    ),
    "birds_france": (
        "a Gallic Rooster, 19th century ornithology illustration, simplified,"
        " no details, no background or container"
    ),
    # Colorful birds - keep color!
    "birds_colorful": (
        "a Common Kingfisher, 19th century ornithology illustration,"
        " simplified, no details, vivid colors, no background or container"
    ),
    # Regional plants
    "plants_uk": (
        "English Bluebells, 19th century botany sketch, simplified, no details,"
        " black and white, no background or container"
    ),
    "plants_france": (
        "Lavandula angustifolia, 19th century botany sketch, simplified, no"
        " details, black and white, no background or container"
    ),
    "plants_us": (
        "Helianthus annuus sunflower, 19th century botany sketch, simplified,"
        " no details, black and white, no background or container"
    ),
}


def load_posters():
  """Import POSTERS dict from the backend posters.py module."""
  sys.path.insert(0, BACKEND_DIR)
  try:
    from poster.posters import POSTERS
  except Exception:
    posters_path = os.path.join(BACKEND_DIR, "poster", "posters.py")
    namespace = {}
    with open(posters_path) as f:
      exec(f.read(), namespace)
    POSTERS = namespace["POSTERS"]
  return POSTERS


def get_prompt(poster_id: str, poster: dict) -> str:
  """Build the full prompt for a poster icon."""
  if poster_id in CUSTOM_PROMPTS:
    return CUSTOM_PROMPTS[poster_id]

  ptype = poster.get("type", "bird")
  template = BIRD_TEMPLATE if ptype == "bird" else PLANT_TEMPLATE

  if poster_id in EMBLEMATIC_SPECIES:
    species = EMBLEMATIC_SPECIES[poster_id]
  else:
    # Fallback: use the first species from the poster definition
    species_list = poster.get("species", [])
    species = species_list[0] if species_list else poster["name"]

  return template.format(species=species)


def generate_svg(poster_id: str, prompt: str, api_token: str) -> str:
  """Call Replicate API to generate an SVG icon."""
  print(f"  Prompt: {prompt}")

  payload = json.dumps({
      "input": {
          "prompt": prompt,
          "size": "1024x1024",
      },
  }).encode("utf-8")

  url = f"https://api.replicate.com/v1/models/{REPLICATE_MODEL}/predictions"
  req = urllib.request.Request(
      url,
      data=payload,
      headers={
          "Authorization": f"Bearer {api_token}",
          "Content-Type": "application/json",
          "Prefer": "wait",
      },
  )

  try:
    with urllib.request.urlopen(req, timeout=120) as resp:
      result = json.loads(resp.read().decode("utf-8"))
  except urllib.error.HTTPError as e:
    body = e.read().decode("utf-8") if e.fp else ""
    print(f"  ERROR: HTTP {e.code}: {body[:300]}")
    return ""

  # Poll if still running
  status = result.get("status", "")
  poll_url = result.get("urls", {}).get("get", "")

  while status not in ("succeeded", "failed", "canceled"):
    print(f"  Status: {status}, waiting...")
    time.sleep(2)
    poll_req = urllib.request.Request(
        poll_url,
        headers={"Authorization": f"Bearer {api_token}"},
    )
    with urllib.request.urlopen(poll_req, timeout=30) as resp:
      result = json.loads(resp.read().decode("utf-8"))
    status = result.get("status", "")

  if status != "succeeded":
    print(f"  ERROR: Prediction {status}: {result.get('error', 'unknown')}")
    return ""

  output = result.get("output")
  if not output:
    print(f"  ERROR: No output in result")
    return ""

  svg_url = (
      output
      if isinstance(output, str)
      else output[0]
      if isinstance(output, list)
      else ""
  )
  if not svg_url:
    print(f"  ERROR: Could not extract SVG URL from output: {output}")
    return ""

  print(f"  Downloading: {svg_url[:80]}...")
  svg_req = urllib.request.Request(svg_url)
  with urllib.request.urlopen(svg_req, timeout=30) as resp:
    svg_content = resp.read().decode("utf-8")

  return svg_content


def main():
  api_token = os.environ.get("REPLICATE_API_TOKEN", "")

  posters = load_posters()
  all_ids = list(posters.keys())

  if "--list" in sys.argv:
    print(f"Available poster IDs ({len(all_ids)}):")
    for pid in all_ids:
      p = posters[pid]
      exists = (
          "✓" if os.path.exists(os.path.join(OUTPUT_DIR, f"{pid}.svg")) else " "
      )
      prompt = get_prompt(pid, p)
      print(f"  [{exists}] {pid:25s}  {prompt}")
    return

  if not api_token:
    print("ERROR: Set REPLICATE_API_TOKEN environment variable")
    print(
        "  REPLICATE_API_TOKEN=r8_xxx python"
        " backend/nature_go/generation/generate_poster_icons.py"
    )
    sys.exit(1)

  force = "--force" in sys.argv
  requested = [a for a in sys.argv[1:] if not a.startswith("-")]

  if requested:
    icons_to_gen = {k: posters[k] for k in requested if k in posters}
    unknown = [k for k in requested if k not in posters]
    if unknown:
      print(f"WARNING: Unknown poster IDs: {', '.join(unknown)}")
  else:
    icons_to_gen = posters

  if not icons_to_gen:
    print(f"ERROR: No matching icons. Use --list to see available IDs.")
    sys.exit(1)

  os.makedirs(OUTPUT_DIR, exist_ok=True)

  print(f"Generating {len(icons_to_gen)} SVG icons...")
  print(f"Output directory: {OUTPUT_DIR}")
  print(f"Force overwrite: {force}")
  print()

  results = {"success": [], "skipped": [], "failed": []}

  for poster_id, poster in icons_to_gen.items():
    output_path = os.path.join(OUTPUT_DIR, f"{poster_id}.svg")

    if os.path.exists(output_path) and not force:
      print(f"[SKIP] {poster_id} (already exists, use --force to overwrite)")
      results["skipped"].append(poster_id)
      continue

    prompt = get_prompt(poster_id, poster)
    print(f"[GEN]  {poster_id} ({poster['name']})...")
    svg_content = generate_svg(poster_id, prompt, api_token)

    if svg_content:
      with open(output_path, "w") as f:
        f.write(svg_content)
      size_kb = len(svg_content) / 1024
      print(f"  ✓ Saved ({size_kb:.1f} KB)")
      results["success"].append(poster_id)
    else:
      print(f"  ✗ Failed")
      results["failed"].append(poster_id)

    time.sleep(1)

  print()
  print("=" * 50)
  print(
      f"Results: {len(results['success'])} success, "
      f"{len(results['skipped'])} skipped, "
      f"{len(results['failed'])} failed"
  )
  if results["failed"]:
    print(f"Failed: {', '.join(results['failed'])}")
    print(f"Re-run with: ... {' '.join(results['failed'])}")


if __name__ == "__main__":
  main()
