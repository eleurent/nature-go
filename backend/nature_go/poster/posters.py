"""Poster configurations - all use scientific names for species lookup.

Each poster has:
- species: Core species displayed in the poster UI (Europe-focused for type
posters)
- species_extended: Additional worldwide species that count for progress but
aren't displayed
"""

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
        "species_extended": [
            "Sialia sialis",  # Eastern Bluebird
            "Thryothorus ludovicianus",  # Carolina Wren
            "Baeolophus bicolor",  # Tufted Titmouse
            "Sitta carolinensis",  # White-breasted Nuthatch
            "Picoides pubescens",  # Downy Woodpecker
            "Melanerpes carolinus",  # Red-bellied Woodpecker
            "Quiscalus quiscula",  # Common Grackle
            "Molothrus ater",  # Brown-headed Cowbird
            "Sturnus vulgaris",  # European Starling
            "Passer domesticus",  # House Sparrow
            "Setophaga petechia",  # Yellow Warbler
            "Spizella passerina",  # Chipping Sparrow
            "Zonotrichia albicollis",  # White-throated Sparrow
            "Pipilo erythrophthalmus",  # Eastern Towhee
            "Icterus galbula",  # Baltimore Oriole
            "Archilochus colubris",  # Ruby-throated Hummingbird
            "Calypte anna",  # Anna's Hummingbird
            "Selasphorus rufus",  # Rufous Hummingbird
            "Accipiter cooperii",  # Cooper's Hawk
            "Haliaeetus leucocephalus",  # Bald Eagle
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
        "species_extended": [
            "Aegithalos caudatus",  # Long-tailed Tit
            "Periparus ater",  # Coal Tit
            "Poecile palustris",  # Marsh Tit
            "Certhia familiaris",  # Treecreeper
            "Dendrocopos major",  # Great Spotted Woodpecker
            "Picus viridis",  # Green Woodpecker
            "Garrulus glandarius",  # Jay
            "Coloeus monedula",  # Jackdaw
            "Corvus frugilegus",  # Rook
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Turdus viscivorus",  # Mistle Thrush
            "Prunella modularis",  # Dunnock
            "Chloris chloris",  # Greenfinch
            "Pyrrhula pyrrhula",  # Bullfinch
            "Streptopelia decaocto",  # Collared Dove
            "Falco tinnunculus",  # Kestrel
            "Cygnus olor",  # Mute Swan
            "Branta canadensis",  # Canada Goose
            "Phasianus colchicus",  # Pheasant
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
        "species_extended": [
            "Corvus corone",  # Carrion Crow
            "Garrulus glandarius",  # Jay
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Phoenicurus ochruros",  # Black Redstart
            "Motacilla alba",  # White Wagtail
            "Hirundo rustica",  # Barn Swallow
            "Delichon urbicum",  # House Martin
            "Apus apus",  # Common Swift
            "Streptopelia turtur",  # Turtle Dove
            "Falco tinnunculus",  # Kestrel
            "Circus aeruginosus",  # Marsh Harrier
            "Ardea alba",  # Great Egret
            "Egretta garzetta",  # Little Egret
            "Cygnus olor",  # Mute Swan
            "Anas platyrhynchos",  # Mallard
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
        "species_extended": [
            "Corvus cornix",  # Hooded Crow
            "Corvus monedula",  # Jackdaw (alt)
            "Pyrrhocorax graculus",  # Alpine Chough
            "Cyanopica cyanus",  # Azure-winged Magpie
            "Perisoreus infaustus",  # Siberian Jay
            # American corvids
            "Corvus brachyrhynchos",  # American Crow
            "Corvus ossifragus",  # Fish Crow
            "Corvus cryptoleucus",  # Chihuahuan Raven
            "Cyanocitta cristata",  # Blue Jay
            "Cyanocitta stelleri",  # Steller's Jay
            "Aphelocoma californica",  # California Scrub-Jay
            "Nucifraga columbiana",  # Clark's Nutcracker
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
        "species_extended": [
            "Otus scops",  # Eurasian Scops Owl
            "Glaucidium passerinum",  # Eurasian Pygmy Owl
            "Aegolius funereus",  # Boreal Owl
            "Strix uralensis",  # Ural Owl
            "Strix nebulosa",  # Great Grey Owl
            "Surnia ulula",  # Northern Hawk-owl
            "Nyctea scandiaca",  # Snowy Owl
            # American owls
            "Bubo virginianus",  # Great Horned Owl
            "Strix varia",  # Barred Owl
            "Megascops asio",  # Eastern Screech-owl
            "Bubo scandiacus",  # Snowy Owl (US)
            "Aegolius acadicus",  # Northern Saw-whet Owl
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
        "species_extended": [
            "Cygnus cygnus",  # Whooper Swan
            "Cygnus columbianus",  # Tundra Swan
            "Anser albifrons",  # Greater White-fronted Goose
            "Branta bernicla",  # Brent Goose
            "Branta leucopsis",  # Barnacle Goose
            "Aythya ferina",  # Common Pochard
            "Aythya marila",  # Greater Scaup
            "Bucephala clangula",  # Common Goldeneye
            "Somateria mollissima",  # Common Eider
            "Anas strepera",  # Gadwall
            "Anas acuta",  # Northern Pintail
            "Spatula clypeata",  # Northern Shoveler
            # American waterfowl
            "Aix sponsa",  # Wood Duck
            "Anas rubripes",  # American Black Duck
            "Bucephala albeola",  # Bufflehead
            "Lophodytes cucullatus",  # Hooded Merganser
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
        "species_extended": [
            "Milvus migrans",  # Black Kite
            "Accipiter gentilis",  # Northern Goshawk
            "Circus aeruginosus",  # Marsh Harrier
            "Circus cyaneus",  # Hen Harrier
            "Pernis apivorus",  # Honey Buzzard
            "Buteo lagopus",  # Rough-legged Buzzard
            "Falco subbuteo",  # Hobby
            "Falco columbarius",  # Merlin
            "Gyps fulvus",  # Griffon Vulture
            "Neophron percnopterus",  # Egyptian Vulture
            # American raptors
            "Buteo jamaicensis",  # Red-tailed Hawk
            "Buteo lineatus",  # Red-shouldered Hawk
            "Accipiter cooperii",  # Cooper's Hawk
            "Haliaeetus leucocephalus",  # Bald Eagle
            "Cathartes aura",  # Turkey Vulture
            "Falco sparverius",  # American Kestrel
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
        "species_extended": [
            "Bubulcus ibis",  # Cattle Egret
            "Nycticorax nycticorax",  # Night Heron
            "Botaurus stellaris",  # Bittern
            "Ciconia ciconia",  # White Stork
            "Pluvialis apricaria",  # Golden Plover
            "Charadrius hiaticula",  # Ringed Plover
            "Tringa totanus",  # Redshank
            "Tringa nebularia",  # Greenshank
            "Actitis hypoleucos",  # Common Sandpiper
            "Gallinago gallinago",  # Common Snipe
            "Limosa limosa",  # Black-tailed Godwit
            "Himantopus himantopus",  # Black-winged Stilt
            # American waders
            "Ardea herodias",  # Great Blue Heron
            "Egretta thula",  # Snowy Egret
            "Butorides virescens",  # Green Heron
            "Charadrius vociferus",  # Killdeer
            "Actitis macularius",  # Spotted Sandpiper
            "Tringa melanoleuca",  # Greater Yellowlegs
            "Grus canadensis",  # Sandhill Crane
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
        "species_extended": [
            "Phoenicurus phoenicurus",  # Common Redstart
            "Saxicola rubicola",  # European Stonechat
            "Oenanthe oenanthe",  # Northern Wheatear
            "Acrocephalus scirpaceus",  # Reed Warbler
            "Phylloscopus collybita",  # Chiffchaff
            "Phylloscopus trochilus",  # Willow Warbler
            "Regulus regulus",  # Goldcrest
            "Emberiza citrinella",  # Yellowhammer
            "Anthus pratensis",  # Meadow Pipit
            "Hirundo rustica",  # Barn Swallow
            # American songbirds
            "Turdus migratorius",  # American Robin
            "Sialia sialis",  # Eastern Bluebird
            "Mimus polyglottos",  # Northern Mockingbird
            "Cardinalis cardinalis",  # Northern Cardinal
            "Spinus tristis",  # American Goldfinch
            "Melospiza melodia",  # Song Sparrow
            "Setophaga petechia",  # Yellow Warbler
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
        "species_extended": [
            "Anemone nemorosa",  # Wood Anemone
            "Allium ursinum",  # Wild Garlic
            "Galanthus nivalis",  # Snowdrop
            "Crocus vernus",  # Spring Crocus
            "Narcissus pseudonarcissus",  # Wild Daffodil
            "Viola riviniana",  # Common Dog-violet
            "Ajuga reptans",  # Bugle
            "Geum urbanum",  # Wood Avens
            "Filipendula ulmaria",  # Meadowsweet
            "Lychnis flos-cuculi",  # Ragged Robin
            "Knautia arvensis",  # Field Scabious
            "Succisa pratensis",  # Devil's-bit Scabious
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
        "species_extended": [
            "Cistus albidus",  # Grey-leaved Cistus
            "Thymus vulgaris",  # Thyme
            "Rosmarinus officinalis",  # Rosemary
            "Santolina chamaecyparissus",  # Cotton Lavender
            "Iris germanica",  # Bearded Iris
            "Narcissus poeticus",  # Poet's Narcissus
            "Muscari neglectum",  # Grape Hyacinth
            "Orchis purpurea",  # Lady Orchid
            "Ophrys insectifera",  # Fly Orchid
            "Gentiana lutea",  # Yellow Gentian
            "Leontopodium alpinum",  # Edelweiss
            "Eryngium campestre",  # Field Eryngo
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
        "species_extended": [
            "Trillium grandiflorum",  # Large-flowered Trillium
            "Sanguinaria canadensis",  # Bloodroot
            "Claytonia virginica",  # Spring Beauty
            "Mertensia virginica",  # Virginia Bluebells
            "Penstemon digitalis",  # Foxglove Beardtongue
            "Oenothera biennis",  # Evening Primrose
            "Symphyotrichum novae-angliae",  # New England Aster
            "Liatris spicata",  # Blazing Star
            "Lobelia cardinalis",  # Cardinal Flower
            "Eupatorium purpureum",  # Joe-Pye Weed
            "Iris versicolor",  # Blue Flag Iris
            "Lilium superbum",  # Turk's Cap Lily
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
        "species_extended": [
            "Orchis purpurea",  # Lady Orchid
            "Orchis simia",  # Monkey Orchid
            "Ophrys insectifera",  # Fly Orchid
            "Ophrys sphegodes",  # Early Spider Orchid
            "Himantoglossum hircinum",  # Lizard Orchid
            "Cephalanthera damasonium",  # White Helleborine
            "Platanthera bifolia",  # Lesser Butterfly Orchid
            "Cypripedium calceolus",  # Lady's Slipper Orchid
            "Spiranthes spiralis",  # Autumn Lady's-tresses
            "Dactylorhiza maculata",  # Heath Spotted-orchid
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
        "species_extended": [
            "Rosa centifolia",  # Cabbage Rose
            "Rosa damascena",  # Damask Rose
            "Rosa moschata",  # Musk Rose
            "Rosa multiflora",  # Multiflora Rose
            "Rosa glauca",  # Red-leaved Rose
            "Rosa moyesii",  # Moyes Rose
            "Rosa foetida",  # Austrian Briar
            "Rosa villosa",  # Apple Rose
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
        "species_extended": [
            "Capsella bursa-pastoris",  # Shepherd's Purse
            "Senecio vulgaris",  # Groundsel
            "Cardamine hirsuta",  # Hairy Bittercress
            "Oxalis corniculata",  # Creeping Wood-sorrel
            "Euphorbia peplus",  # Petty Spurge
            "Poa annua",  # Annual Meadow-grass
            "Cerastium fontanum",  # Common Mouse-ear
            "Geranium molle",  # Dove's-foot Crane's-bill
            "Medicago lupulina",  # Black Medick
            "Lotus corniculatus",  # Bird's-foot Trefoil
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


def get_all_species_for_poster(poster_id: str) -> list[str]:
  """Get all species (core + extended) that count for a poster."""
  poster = POSTERS.get(poster_id)
  if not poster:
    return []
  return poster.get("species", []) + poster.get("species_extended", [])
