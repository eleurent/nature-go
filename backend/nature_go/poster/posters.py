"""Poster configurations - all use scientific names for species lookup."""

POSTERS = {
    # Regional Posters
    "western_us": {
        "name": "Western United States",
        "icon": "🌄",
        "species": [
            "Turdus migratorius",  # American Robin
            "Haemorhous mexicanus",  # House Finch
            "Calypte anna",  # Anna's Hummingbird
            "Poecile atricapillus",  # Black-capped Chickadee
            "Corvus brachyrhynchos",  # American Crow
            "Mimus polyglottos",  # Northern Mockingbird
            "Zenaida macroura",  # Mourning Dove
            "Buteo jamaicensis",  # Red-tailed Hawk
            "Passer domesticus",  # House Sparrow
            "Sturnus vulgaris",  # European Starling
            "Cyanocitta stelleri",  # Steller's Jay
            "Sayornis nigricans",  # Black Phoebe
            "Setophaga coronata",  # Yellow-rumped Warbler
            "Zonotrichia leucophrys",  # White-crowned Sparrow
            "Junco hyemalis",  # Dark-eyed Junco
            "Spinus psaltria",  # Lesser Goldfinch
            "Spinus tristis",  # American Goldfinch
            "Agelaius phoeniceus",  # Red-winged Blackbird
            "Melospiza melodia",  # Song Sparrow
            "Dryobates pubescens",  # Downy Woodpecker
            "Dryobates villosus",  # Hairy Woodpecker
            "Accipiter cooperii",  # Cooper's Hawk
            "Cathartes aura",  # Turkey Vulture
            "Ardea herodias",  # Great Blue Heron
            "Anas platyrhynchos",  # Mallard
            "Branta canadensis",  # Canada Goose
            "Haliaeetus leucocephalus",  # Bald Eagle
            "Sturnella neglecta",  # Western Meadowlark
            "Poecile gambeli",  # Mountain Chickadee
            "Selasphorus rufus",  # Rufous Hummingbird
        ],
    },
    "uk": {
        "name": "United Kingdom",
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
            "Aegithalos caudatus",  # Long-tailed Tit
            "Troglodytes troglodytes",  # Wren
            "Prunella modularis",  # Dunnock
            "Periparus ater",  # Coal Tit
            "Chloris chloris",  # Greenfinch
            "Dendrocopos major",  # Great Spotted Woodpecker
            "Sitta europaea",  # Nuthatch
            "Garrulus glandarius",  # Jay
            "Streptopelia decaocto",  # Collared Dove
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Turdus viscivorus",  # Mistle Thrush
            "Phasianus colchicus",  # Pheasant
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
            "Falco tinnunculus",  # Kestrel
            "Ardea cinerea",  # Grey Heron
            "Anas platyrhynchos",  # Mallard
            "Cygnus olor",  # Mute Swan
            "Branta canadensis",  # Canada Goose
        ],
    },
    "france": {
        "name": "France",
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
            "Corvus corone",  # Carrion Crow
            "Carduelis carduelis",  # Goldfinch
            "Aegithalos caudatus",  # Long-tailed Tit
            "Troglodytes troglodytes",  # Wren
            "Serinus serinus",  # Serin
            "Chloris chloris",  # Greenfinch
            "Dendrocopos major",  # Great Spotted Woodpecker
            "Sitta europaea",  # Nuthatch
            "Garrulus glandarius",  # Jay
            "Streptopelia decaocto",  # Collared Dove
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Upupa epops",  # Hoopoe
            "Merops apiaster",  # Bee-eater
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
            "Falco tinnunculus",  # Kestrel
            "Ardea cinerea",  # Grey Heron
            "Anas platyrhynchos",  # Mallard
            "Cygnus olor",  # Mute Swan
            "Ardea alba",  # Great Egret
            "Chroicocephalus ridibundus",  # Black-headed Gull
        ],
    },
    # Species Group Posters
    "corvids": {
        "name": "Corvid Connoisseur",
        "icon": "🪶",
        "species": [
            "Corvus corax",
            "Corvus corone",
            "Corvus cornix",
            "Pica pica",
            "Nucifraga caryocatactes",
            "Pyrrhocorax pyrrhocorax",
            "Pyrrhocorax graculus",
            "Coloeus monedula",
            "Corvus frugilegus",
            "Garrulus glandarius",
        ],
    },
    "owls": {
        "name": "Owl Observer",
        "icon": "🦉",
        "species": [
            "Tyto alba",
            "Bubo bubo",
            "Otus scops",
            "Athene noctua",
            "Strix aluco",
            "Asio otus",
            "Asio flammeus",
        ],
    },
    "waterfowl": {
        "name": "Waterfowl Whisperer",
        "icon": "🦆",
        "species": [
            "Anser anser",
            "Branta bernicla",
            "Branta leucopsis",
            "Branta canadensis",
            "Cygnus olor",
            "Cygnus cygnus",
            "Tadorna tadorna",
            "Anas platyrhynchos",
            "Anas crecca",
            "Aythya ferina",
            "Aythya fuligula",
            "Bucephala clangula",
            "Mergus merganser",
        ],
    },
    "waders": {
        "name": "Wading Wonderer",
        "icon": "🦩",
        "species": [
            "Ardea cinerea",
            "Ardea alba",
            "Egretta garzetta",
            "Bubulcus ibis",
            "Nycticorax nycticorax",
            "Botaurus stellaris",
            "Grus grus",
            "Himantopus himantopus",
            "Recurvirostra avosetta",
            "Haematopus ostralegus",
            "Vanellus vanellus",
            "Pluvialis apricaria",
        ],
    },
    "raptors": {
        "name": "Raptor Ranger",
        "icon": "🦅",
        "species": [
            "Buteo buteo",
            "Milvus milvus",
            "Milvus migrans",
            "Accipiter nisus",
            "Accipiter gentilis",
            "Circus aeruginosus",
            "Circus cyaneus",
            "Pernis apivorus",
            "Haliaeetus albicilla",
            "Aquila chrysaetos",
            "Falco tinnunculus",
            "Falco peregrinus",
            "Pandion haliaetus",
        ],
    },
    "woodland": {
        "name": "Woodland Wanderer",
        "icon": "🌲",
        "species": [
            "Dendrocopos major",
            "Picus viridis",
            "Sitta europaea",
            "Certhia familiaris",
            "Garrulus glandarius",
            "Parus major",
            "Cyanistes caeruleus",
            "Poecile palustris",
            "Aegithalos caudatus",
            "Regulus regulus",
            "Phylloscopus collybita",
            "Sylvia atricapilla",
        ],
    },
    "coastal": {
        "name": "Coastal Connoisseur",
        "icon": "🌊",
        "species": [
            "Larus argentatus",
            "Larus fuscus",
            "Larus marinus",
            "Larus canus",
            "Rissa tridactyla",
            "Sterna hirundo",
            "Sterna paradisaea",
            "Fratercula arctica",
            "Alca torda",
            "Uria aalge",
            "Phalacrocorax carbo",
            "Morus bassanus",
        ],
    },
    "songbirds": {
        "name": "Songbird Specialist",
        "icon": "🎵",
        "species": [
            "Erithacus rubecula",
            "Turdus merula",
            "Turdus philomelos",
            "Luscinia megarhynchos",
            "Fringilla coelebs",
            "Carduelis carduelis",
            "Chloris chloris",
            "Emberiza citrinella",
            "Alauda arvensis",
            "Hirundo rustica",
            "Delichon urbicum",
            "Sturnus vulgaris",
        ],
    },
    "backyard": {
        "name": "Backyard Birder",
        "icon": "🏡",
        "species": [
            "Passer domesticus",
            "Columba livia",
            "Streptopelia decaocto",
            "Pica pica",
            "Turdus merula",
            "Erithacus rubecula",
            "Parus major",
            "Cyanistes caeruleus",
            "Fringilla coelebs",
            "Carduelis carduelis",
            "Sturnus vulgaris",
            "Motacilla alba",
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
