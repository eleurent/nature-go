"""Poster configurations - all use scientific names for species lookup."""

POSTERS = {
    # ============================================================
    # BIRDS
    # ============================================================
    # --- Birds: Regional ---
    "birds_us": {
        "name": "United States",
        "type": "bird",
        "icon": "🇺🇸",
        "species": [
            "Turdus migratorius",  # American Robin
            "Cardinalis cardinalis",  # Northern Cardinal
            "Cyanocitta cristata",  # Blue Jay
            "Haemorhous mexicanus",  # House Finch
            "Poecile atricapillus",  # Black-capped Chickadee
            "Corvus brachyrhynchos",  # American Crow
            "Mimus polyglottos",  # Northern Mockingbird
            "Zenaida macroura",  # Mourning Dove
            "Buteo jamaicensis",  # Red-tailed Hawk
            "Junco hyemalis",  # Dark-eyed Junco
            "Spinus tristis",  # American Goldfinch
            "Agelaius phoeniceus",  # Red-winged Blackbird
            "Melospiza melodia",  # Song Sparrow
            "Cathartes aura",  # Turkey Vulture
            "Anas platyrhynchos",  # Mallard
            "Branta canadensis",  # Canada Goose
        ],
    },
    "birds_uk": {
        "name": "United Kingdom",
        "type": "bird",
        "icon": "🇬🇧",
        "species": [
            "Erithacus rubecula",  # European Robin
            "Passer domesticus",  # House Sparrow
            "Cyanistes caeruleus",  # Blue Tit
            "Parus major",  # Great Tit
            "Turdus merula",  # Blackbird
            "Fringilla coelebs",  # Chaffinch
            "Columba palumbus",  # Woodpigeon
            "Pica pica",  # Magpie
            "Corvus corone",  # Carrion Crow
            "Carduelis carduelis",  # Goldfinch
            "Troglodytes troglodytes",  # Wren
            "Sitta europaea",  # Nuthatch
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
            "Ardea cinerea",  # Grey Heron
            "Anas platyrhynchos",  # Mallard
        ],
    },
    "birds_france": {
        "name": "France",
        "type": "bird",
        "icon": "🇫🇷",
        "species": [
            "Erithacus rubecula",  # European Robin
            "Passer domesticus",  # House Sparrow
            "Cyanistes caeruleus",  # Blue Tit
            "Parus major",  # Great Tit
            "Turdus merula",  # Blackbird
            "Fringilla coelebs",  # Chaffinch
            "Columba palumbus",  # Woodpigeon
            "Pica pica",  # Magpie
            "Carduelis carduelis",  # Goldfinch
            "Upupa epops",  # Hoopoe
            "Merops apiaster",  # Bee-eater
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
            "Ardea cinerea",  # Grey Heron
            "Chroicocephalus ridibundus",  # Black-headed Gull
            "Serinus serinus",  # Serin
        ],
    },
    # --- Birds: Types ---
    "birds_corvids": {
        "name": "Corvid Connoisseur",
        "type": "bird",
        "icon": "🪶",
        "species": [
            "Corvus corax",  # Common Raven
            "Corvus corone",  # Carrion Crow
            "Pica pica",  # Magpie
            "Garrulus glandarius",  # Jay
            "Coloeus monedula",  # Jackdaw
            "Corvus frugilegus",  # Rook
            "Pyrrhocorax pyrrhocorax",  # Red-billed Chough
            "Nucifraga caryocatactes",  # Spotted Nutcracker
        ],
    },
    "birds_owls": {
        "name": "Owl Observer",
        "type": "bird",
        "icon": "🦉",
        "species": [
            "Tyto alba",  # Barn Owl
            "Bubo bubo",  # Eurasian Eagle-owl
            "Athene noctua",  # Little Owl
            "Strix aluco",  # Tawny Owl
            "Asio otus",  # Long-eared Owl
            "Asio flammeus",  # Short-eared Owl
        ],
    },
    "birds_waterfowl": {
        "name": "Waterfowl",
        "type": "bird",
        "icon": "🦆",
        "species": [
            "Anas platyrhynchos",  # Mallard
            "Cygnus olor",  # Mute Swan
            "Branta canadensis",  # Canada Goose
            "Anser anser",  # Greylag Goose
            "Aythya fuligula",  # Tufted Duck
            "Tadorna tadorna",  # Shelduck
            "Mergus merganser",  # Goosander
            "Anas crecca",  # Eurasian Teal
        ],
    },
    "birds_raptors": {
        "name": "Raptors",
        "type": "bird",
        "icon": "🦅",
        "species": [
            "Buteo buteo",  # Common Buzzard
            "Milvus milvus",  # Red Kite
            "Accipiter nisus",  # Sparrowhawk
            "Falco tinnunculus",  # Kestrel
            "Falco peregrinus",  # Peregrine Falcon
            "Haliaeetus albicilla",  # White-tailed Eagle
            "Aquila chrysaetos",  # Golden Eagle
            "Pandion haliaetus",  # Osprey
        ],
    },
    "birds_waders": {
        "name": "Waders",
        "type": "bird",
        "icon": "🦩",
        "species": [
            "Ardea cinerea",  # Grey Heron
            "Ardea alba",  # Great Egret
            "Egretta garzetta",  # Little Egret
            "Vanellus vanellus",  # Lapwing
            "Haematopus ostralegus",  # Oystercatcher
            "Recurvirostra avosetta",  # Avocet
            "Grus grus",  # Common Crane
            "Numenius arquata",  # Curlew
        ],
    },
    "birds_songbirds": {
        "name": "Songbirds",
        "type": "bird",
        "icon": "🎵",
        "species": [
            "Erithacus rubecula",  # European Robin
            "Turdus merula",  # Blackbird
            "Turdus philomelos",  # Song Thrush
            "Luscinia megarhynchos",  # Nightingale
            "Fringilla coelebs",  # Chaffinch
            "Carduelis carduelis",  # Goldfinch
            "Alauda arvensis",  # Skylark
            "Sylvia atricapilla",  # Blackcap
        ],
    },
    # ============================================================
    # PLANTS
    # ============================================================
    # --- Plants: Regional ---
    "plants_uk": {
        "name": "British Wildflowers",
        "type": "plant",
        "icon": "🇬🇧",
        "species": [
            "Hyacinthoides non-scripta",  # Bluebell
            "Primula vulgaris",  # Primrose
            "Digitalis purpurea",  # Foxglove
            "Papaver rhoeas",  # Common Poppy
            "Leucanthemum vulgare",  # Oxeye Daisy
            "Ranunculus acris",  # Meadow Buttercup
            "Trifolium pratense",  # Red Clover
            "Centaurea cyanus",  # Cornflower
            "Geranium robertianum",  # Herb Robert
            "Silene dioica",  # Red Campion
        ],
    },
    "plants_france": {
        "name": "French Wildflowers",
        "type": "plant",
        "icon": "🇫🇷",
        "species": [
            "Lavandula angustifolia",  # Lavender
            "Papaver rhoeas",  # Common Poppy
            "Centaurea cyanus",  # Cornflower
            "Leucanthemum vulgare",  # Oxeye Daisy
            "Viola tricolor",  # Wild Pansy
            "Convolvulus arvensis",  # Field Bindweed
            "Echium vulgare",  # Viper's Bugloss
            "Cichorium intybus",  # Chicory
            "Dianthus carthusianorum",  # Carthusian Pink
            "Salvia pratensis",  # Meadow Clary
        ],
    },
    "plants_us": {
        "name": "American Wildflowers",
        "type": "plant",
        "icon": "🇺🇸",
        "species": [
            "Echinacea purpurea",  # Purple Coneflower
            "Rudbeckia hirta",  # Black-eyed Susan
            "Lupinus polyphyllus",  # Large-leaved Lupine
            "Asclepias tuberosa",  # Butterfly Milkweed
            "Helianthus annuus",  # Common Sunflower
            "Monarda didyma",  # Scarlet Beebalm
            "Phlox paniculata",  # Garden Phlox
            "Solidago canadensis",  # Canada Goldenrod
            "Aquilegia caerulea",  # Colorado Columbine
            "Castilleja coccinea",  # Indian Paintbrush
        ],
    },
    # --- Plants: Types ---
    "plants_orchids": {
        "name": "Orchid Hunter",
        "type": "plant",
        "icon": "🌸",
        "species": [
            "Orchis mascula",  # Early-purple Orchid
            "Dactylorhiza fuchsii",  # Common Spotted Orchid
            "Anacamptis pyramidalis",  # Pyramidal Orchid
            "Ophrys apifera",  # Bee Orchid
            "Orchis militaris",  # Military Orchid
            "Gymnadenia conopsea",  # Fragrant Orchid
            "Epipactis helleborine",  # Broad-leaved Helleborine
            "Neottia ovata",  # Common Twayblade
        ],
    },
    "plants_roses": {
        "name": "Rose Garden",
        "type": "plant",
        "icon": "🌹",
        "species": [
            "Rosa canina",  # Dog Rose
            "Rosa rubiginosa",  # Sweet Briar
            "Rosa arvensis",  # Field Rose
            "Rosa gallica",  # French Rose
            "Rosa spinosissima",  # Burnet Rose
            "Rosa rugosa",  # Rugosa Rose
        ],
    },
    "plants_garden": {
        "name": "Garden Classics",
        "type": "plant",
        "icon": "🌷",
        "species": [
            "Bellis perennis",  # Common Daisy
            "Taraxacum officinale",  # Dandelion
            "Plantago major",  # Greater Plantain
            "Trifolium repens",  # White Clover
            "Glechoma hederacea",  # Ground Ivy
            "Lamium purpureum",  # Red Dead-nettle
            "Veronica persica",  # Persian Speedwell
            "Stellaria media",  # Chickweed
        ],
    },
}


def get_poster_list():
  """Return list of all posters with basic info."""
  return [
      {
          "id": poster_id,
          "name": poster["name"],
          "icon": poster.get("icon", "🐦"),
      }
      for poster_id, poster in POSTERS.items()
  ]


def get_poster(poster_id: str):
  """Get a specific poster by ID."""
  return POSTERS.get(poster_id)
