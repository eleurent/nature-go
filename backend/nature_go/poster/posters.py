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
            "Sialia sialis",  # Eastern Bluebird
            "Haemorhous mexicanus",  # House Finch
            "Poecile atricapillus",  # Black-capped Chickadee
            "Corvus brachyrhynchos",  # American Crow
            "Mimus polyglottos",  # Northern Mockingbird
            "Zenaida macroura",  # Mourning Dove
            "Buteo jamaicensis",  # Red-tailed Hawk
            "Junco hyemalis",  # Dark-eyed Junco
            "Spinus tristis",  # American Goldfinch
            "Agelaius phoeniceus",  # Red-winged Blackbird
            "Archilochus colubris",  # Ruby-throated Hummingbird
            "Anas platyrhynchos",  # Mallard
            "Branta canadensis",  # Canada Goose
        ],
        "species_extended": [
            "Melospiza melodia",  # Song Sparrow
            "Cathartes aura",  # Turkey Vulture
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
            "Aegithalos caudatus",  # Long-tailed Tit
            "Troglodytes troglodytes",  # Wren
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
        ],
        "species_extended": [
            "Sitta europaea",  # Nuthatch
            "Ardea cinerea",  # Grey Heron
            "Anas platyrhynchos",  # Mallard
            "Periparus ater",  # Coal Tit
            "Poecile palustris",  # Marsh Tit
            "Certhia familiaris",  # Treecreeper
            "Dendrocopos major",  # Great Spotted Woodpecker
            "Picus viridis",  # Green Woodpecker
            "Garrulus glandarius",  # Jay
            "Coloeus monedula",  # Jackdaw
            "Corvus frugilegus",  # Rook
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
            "Hirundo rustica",  # Barn Swallow
            "Apus apus",  # Common Swift
            "Milvus milvus",  # Red Kite
            "Buteo buteo",  # Buzzard
            "Serinus serinus",  # Serin
        ],
        "species_extended": [
            "Chroicocephalus ridibundus",  # Black-headed Gull
            "Corvus corone",  # Carrion Crow
            "Garrulus glandarius",  # Jay
            "Sturnus vulgaris",  # Starling
            "Turdus philomelos",  # Song Thrush
            "Phoenicurus ochruros",  # Black Redstart
            "Motacilla alba",  # White Wagtail
            "Delichon urbicum",  # House Martin
            "Streptopelia turtur",  # Turtle Dove
            "Falco tinnunculus",  # Kestrel
            "Circus aeruginosus",  # Marsh Harrier
            "Ardea cinerea",  # Grey Heron
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
            "Corvus cornix",  # Hooded Crow
            "Pica pica",  # Magpie
            "Garrulus glandarius",  # Jay
            "Coloeus monedula",  # Jackdaw
            "Corvus frugilegus",  # Rook
            "Pyrrhocorax pyrrhocorax",  # Red-billed Chough
            "Pyrrhocorax graculus",  # Alpine Chough
            "Nucifraga caryocatactes",  # Spotted Nutcracker
        ],
        "species_extended": [
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
            "Pica hudsonia",  # Black-billed Magpie
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
            "Glaucidium passerinum",  # Eurasian Pygmy Owl
            "Bubo scandiacus",  # Snowy Owl
        ],
        "species_extended": [
            "Otus scops",  # Eurasian Scops Owl
            "Aegolius funereus",  # Boreal Owl
            "Strix uralensis",  # Ural Owl
            "Strix nebulosa",  # Great Grey Owl
            "Surnia ulula",  # Northern Hawk-owl
            # American owls
            "Bubo virginianus",  # Great Horned Owl
            "Strix varia",  # Barred Owl
            "Megascops asio",  # Eastern Screech-owl
            "Aegolius acadicus",  # Northern Saw-whet Owl
            "Athene cunicularia",  # Burrowing Owl
        ],
    },
    "birds_waterfowl": {
        "name": "Waterfowl",
        "type": "bird",
        "icon": "🦆",
        "species": [
            "Anas platyrhynchos",  # Mallard
            "Cygnus olor",  # Mute Swan
            "Cygnus cygnus",  # Whooper Swan
            "Branta canadensis",  # Canada Goose
            "Anser anser",  # Greylag Goose
            "Aythya fuligula",  # Tufted Duck
            "Aythya ferina",  # Common Pochard
            "Tadorna tadorna",  # Shelduck
            "Bucephala clangula",  # Common Goldeneye
            "Mergus merganser",  # Goosander
        ],
        "species_extended": [
            "Anas crecca",  # Eurasian Teal
            "Cygnus columbianus",  # Tundra Swan
            "Anser albifrons",  # Greater White-fronted Goose
            "Branta bernicla",  # Brent Goose
            "Branta leucopsis",  # Barnacle Goose
            "Aythya marila",  # Greater Scaup
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
            "Accipiter gentilis",  # Northern Goshawk
            "Falco tinnunculus",  # Kestrel
            "Falco peregrinus",  # Peregrine Falcon
            "Circus aeruginosus",  # Marsh Harrier
            "Haliaeetus albicilla",  # White-tailed Eagle
            "Aquila chrysaetos",  # Golden Eagle
            "Pandion haliaetus",  # Osprey
        ],
        "species_extended": [
            "Milvus migrans",  # Black Kite
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
        "name": "Waders & Herons",
        "type": "bird",
        "icon": "🦩",
        "species": [
            "Ardea cinerea",  # Grey Heron
            "Ardea alba",  # Great Egret
            "Egretta garzetta",  # Little Egret
            "Ciconia ciconia",  # White Stork
            "Grus grus",  # Common Crane
            "Vanellus vanellus",  # Lapwing
            "Haematopus ostralegus",  # Oystercatcher
            "Recurvirostra avosetta",  # Avocet
            "Numenius arquata",  # Curlew
            "Limosa limosa",  # Black-tailed Godwit
            "Botaurus stellaris",  # Bittern
        ],
        "species_extended": [
            "Bubulcus ibis",  # Cattle Egret
            "Nycticorax nycticorax",  # Night Heron
            "Pluvialis apricaria",  # Golden Plover
            "Charadrius hiaticula",  # Ringed Plover
            "Tringa totanus",  # Redshank
            "Tringa nebularia",  # Greenshank
            "Actitis hypoleucos",  # Common Sandpiper
            "Gallinago gallinago",  # Common Snipe
            "Himantopus himantopus",  # Black-winged Stilt
            "Ciconia nigra",  # Black Stork
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
            "Troglodytes troglodytes",  # Wren
            "Prunella modularis",  # Dunnock
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
    # --- Birds: NEW Type Posters ---
    "birds_seabirds": {
        "name": "Seabirds",
        "type": "bird",
        "icon": "🌊",
        "species": [
            "Fratercula arctica",  # Atlantic Puffin
            "Morus bassanus",  # Northern Gannet
            "Uria aalge",  # Common Guillemot
            "Alca torda",  # Razorbill
            "Rissa tridactyla",  # Black-legged Kittiwake
            "Fulmarus glacialis",  # Northern Fulmar
            "Phalacrocorax carbo",  # Great Cormorant
            "Phalacrocorax aristotelis",  # European Shag
            "Sterna hirundo",  # Common Tern
            "Sterna paradisaea",  # Arctic Tern
        ],
        "species_extended": [
            "Larus argentatus",  # Herring Gull
            "Larus fuscus",  # Lesser Black-backed Gull
            "Larus marinus",  # Great Black-backed Gull
            "Larus canus",  # Common Gull
            "Chroicocephalus ridibundus",  # Black-headed Gull
            "Cepphus grylle",  # Black Guillemot
            "Alle alle",  # Little Auk
            "Hydrobates pelagicus",  # European Storm Petrel
            "Stercorarius skua",  # Great Skua
            "Stercorarius parasiticus",  # Arctic Skua
            # American seabirds
            "Pelecanus occidentalis",  # Brown Pelican
            "Larus delawarensis",  # Ring-billed Gull
            "Sterna maxima",  # Royal Tern
        ],
    },
    "birds_colorful": {
        "name": "Colorful Birds",
        "type": "bird",
        "icon": "🌈",
        "species": [
            "Alcedo atthis",  # Common Kingfisher
            "Merops apiaster",  # European Bee-eater
            "Upupa epops",  # Hoopoe
            "Coracias garrulus",  # European Roller
            "Picus viridis",  # Green Woodpecker
            "Garrulus glandarius",  # Jay
            "Carduelis carduelis",  # Goldfinch
            "Pyrrhula pyrrhula",  # Bullfinch
            "Phoenicurus phoenicurus",  # Common Redstart
            "Oriolus oriolus",  # Golden Oriole
        ],
        "species_extended": [
            "Sitta europaea",  # Nuthatch
            "Chloris chloris",  # Greenfinch
            "Linaria cannabina",  # Common Linnet
            "Loxia curvirostra",  # Red Crossbill
            "Emberiza citrinella",  # Yellowhammer
            "Motacilla cinerea",  # Grey Wagtail
            "Motacilla flava",  # Yellow Wagtail
            "Dendrocopos major",  # Great Spotted Woodpecker
            # American colorful birds
            "Cardinalis cardinalis",  # Northern Cardinal
            "Cyanocitta cristata",  # Blue Jay
            "Sialia sialis",  # Eastern Bluebird
            "Icterus galbula",  # Baltimore Oriole
            "Setophaga petechia",  # Yellow Warbler
            "Piranga olivacea",  # Scarlet Tanager
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
            "Allium ursinum",  # Wild Garlic
            "Galanthus nivalis",  # Snowdrop
            "Anemone nemorosa",  # Wood Anemone
            "Trifolium pratense",  # Red Clover
            "Centaurea cyanus",  # Cornflower
            "Silene dioica",  # Red Campion
        ],
        "species_extended": [
            "Geranium robertianum",  # Herb Robert
            "Viola riviniana",  # Common Dog-violet
            "Ajuga reptans",  # Bugle
            "Geum urbanum",  # Wood Avens
            "Filipendula ulmaria",  # Meadowsweet
            "Lychnis flos-cuculi",  # Ragged Robin
            "Knautia arvensis",  # Field Scabious
            "Succisa pratensis",  # Devil's-bit Scabious
            "Crocus vernus",  # Spring Crocus
            "Narcissus pseudonarcissus",  # Wild Daffodil
        ],
    },
    "plants_france": {
        "name": "French Wildflowers",
        "type": "plant",
        "icon": "🇫🇷",
        "species": [
            "Lavandula angustifolia",  # Lavender
            "Thymus vulgaris",  # Thyme
            "Rosmarinus officinalis",  # Rosemary
            "Papaver rhoeas",  # Common Poppy
            "Centaurea cyanus",  # Cornflower
            "Leucanthemum vulgare",  # Oxeye Daisy
            "Viola tricolor",  # Wild Pansy
            "Echium vulgare",  # Viper's Bugloss
            "Cichorium intybus",  # Chicory
            "Dianthus carthusianorum",  # Carthusian Pink
            "Salvia pratensis",  # Meadow Clary
        ],
        "species_extended": [
            "Convolvulus arvensis",  # Field Bindweed
            "Cistus albidus",  # Grey-leaved Cistus
            "Santolina chamaecyparissus",  # Cotton Lavender
            "Iris germanica",  # Bearded Iris
            "Narcissus poeticus",  # Poet's Narcissus
            "Muscari neglectum",  # Grape Hyacinth
            "Orchis purpurea",  # Lady Orchid
            "Ophrys insectifera",  # Fly Orchid
            "Gentiana lutea",  # Yellow Gentian
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
            "Trillium grandiflorum",  # Large-flowered Trillium
            "Monarda didyma",  # Scarlet Beebalm
            "Phlox paniculata",  # Garden Phlox
            "Solidago canadensis",  # Canada Goldenrod
            "Aquilegia caerulea",  # Colorado Columbine
            "Castilleja coccinea",  # Indian Paintbrush
        ],
        "species_extended": [
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
            "Orchis purpurea",  # Lady Orchid
            "Dactylorhiza fuchsii",  # Common Spotted Orchid
            "Anacamptis pyramidalis",  # Pyramidal Orchid
            "Ophrys apifera",  # Bee Orchid
            "Orchis militaris",  # Military Orchid
            "Gymnadenia conopsea",  # Fragrant Orchid
            "Epipactis helleborine",  # Broad-leaved Helleborine
            "Neottia ovata",  # Common Twayblade
            "Cypripedium calceolus",  # Lady's Slipper Orchid
        ],
        "species_extended": [
            "Orchis simia",  # Monkey Orchid
            "Ophrys insectifera",  # Fly Orchid
            "Ophrys sphegodes",  # Early Spider Orchid
            "Himantoglossum hircinum",  # Lizard Orchid
            "Cephalanthera damasonium",  # White Helleborine
            "Platanthera bifolia",  # Lesser Butterfly Orchid
            "Spiranthes spiralis",  # Autumn Lady's-tresses
            "Dactylorhiza maculata",  # Heath Spotted-orchid
            "Listera cordata",  # Lesser Twayblade
            "Goodyera repens",  # Creeping Lady's-tresses
        ],
    },
    "plants_hedgerow": {
        "name": "Hedgerow & Shrubs",
        "type": "plant",
        "icon": "�",
        "species": [
            "Rosa canina",  # Dog Rose
            "Crataegus monogyna",  # Hawthorn
            "Prunus spinosa",  # Blackthorn
            "Sambucus nigra",  # Elder
            "Corylus avellana",  # Hazel
            "Rubus fruticosus",  # Blackberry
            "Ilex aquifolium",  # Holly
            "Viburnum opulus",  # Guelder Rose
            "Lonicera periclymenum",  # Honeysuckle
            "Hedera helix",  # Ivy
        ],
        "species_extended": [
            "Rosa rubiginosa",  # Sweet Briar
            "Rosa arvensis",  # Field Rose
            "Euonymus europaeus",  # Spindle
            "Ligustrum vulgare",  # Wild Privet
            "Cornus sanguinea",  # Dogwood
            "Rhamnus cathartica",  # Buckthorn
            "Viburnum lantana",  # Wayfaring Tree
            "Clematis vitalba",  # Old Man's Beard
            "Bryonia dioica",  # White Bryony
            "Humulus lupulus",  # Hop
        ],
    },
    "plants_lawn": {
        "name": "Lawn & Garden",
        "type": "plant",
        "icon": "�",
        "species": [
            "Bellis perennis",  # Common Daisy
            "Taraxacum officinale",  # Dandelion
            "Trifolium repens",  # White Clover
            "Ranunculus repens",  # Creeping Buttercup
            "Plantago major",  # Greater Plantain
            "Prunella vulgaris",  # Selfheal
            "Veronica chamaedrys",  # Germander Speedwell
            "Glechoma hederacea",  # Ground Ivy
            "Lamium purpureum",  # Red Dead-nettle
            "Stellaria media",  # Chickweed
        ],
        "species_extended": [
            "Veronica persica",  # Persian Speedwell
            "Capsella bursa-pastoris",  # Shepherd's Purse
            "Senecio vulgaris",  # Groundsel
            "Cardamine hirsuta",  # Hairy Bittercress
            "Oxalis corniculata",  # Creeping Wood-sorrel
            "Euphorbia peplus",  # Petty Spurge
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
