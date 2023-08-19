# Nature go

[![Deploy backend](https://github.com/eleurent/nature-go/actions/workflows/deploy-backend.yml/badge.svg)](https://github.com/eleurent/nature-go/actions/workflows/deploy-backend.yml)
[![Deploy frontend](https://github.com/eleurent/nature-go/actions/workflows/deploy-frontend.yml/badge.svg)](https://github.com/eleurent/nature-go/actions/workflows/deploy-frontend.yml)

A generative AI project

## Summary

Inspired by Pokemon Go, this app is an augmented reality game about discovering and observing wildlife.
The universe / mood revolves around playing a young naturalist in the 19th century, doing fieldwork in botany, ornithology / zoology.

- **Discovering species**: when hiking, the player photographs wildlife, and pictures are sent to an identification API (e.g. PlantNet, Merlin Bird ID).
- **Collecting observations**: observations are gathered in an herbarium and an ornithology logbook.
- **Studying/Researching**: collecting enough observations enables to *study* a species, by answering trivia questions or taking identification exams.

## Graphic style

- [Figma project](https://www.figma.com/file/iPjswR0CeXpBdz94pG0Bgh/Nature-Go?type=design&mode=design&t=kyAtjChl3VWXbrzz-1)

The app should generally feel like a scientist's expedition log / notebook. Discovered species are illustrated like in an herbarium, or a natural zoology journal.

- **Resource**: the [Biodiversity Heritage Library](https://www.flickr.com/photos/biodivlibrary/)
- Keywords: naturalist logbook, ornithology journal, botany, birdwatching, birder, botanist, Charles Darwin
- Menus appearance: turning pages of the journal / diary / notebook
- Species: each specie will have one or several illustrations in [this style](https://www.flickr.com/photos/biodivlibrary/).

## Gameplay

### 1. Fieldwork: observing species

The base activity is to wander in nature and take photos of species of two categories

- Flowers (Botany)
- Birds (Ornithology)
- (Insects? (Entomomlogy))

Each observation is stored, along with

- the picture
- the date and time
- the location
- the specie, obtained from the identification service

Each observation is rewarded with XP, which allows to level up.

### 2. University: studying species

Once enough observations of any species have been collected, this unlocks the ability to do an academic study of this species.

There can be several kind of studies:

1. answering a **knowledge exam** (quizz with multiple choice or open questions)
  - a quizz is passed only by correctly answering 100% correctly (?)
  - the questions are sampled from discovered species only
  - a quizz can be taken again, but each question already answered has diminishing returns (incentivizes discovering new species to get new questions).
  - the difficulty of the quizz can be controlled through the difficulty of its questions, or the number of questions in the quizz
2. taking an **identification test**: given images of birds/plants that have been observed, find the correct specie
  - either select the correct image matching a given species label, or the correct species label matching a given image.
  - the difficulty will increase naturally as we discover more and more species
  - there will be a lot of repetition initially, but this is key to learning

Studying is also rewarded with XP, but not only.

Could we do active learning to adapt the tests content to the user's past attempts?

### 3. Academia: writing publications?

After a few species have been studied, we can write a  (fake) publication based on that content, e.g.

```bibtex
Leurent, E., & Smith, J. (1823). A comparative study of the morphology and ecology of edelweiss, forget-me-not, and daffodils. Journal of Botany, 23(2), 45-56.
```

This would mostly a cosmetic reward for completing studies, and also allows to upgrade our **title** and **appearance**?

- Scout (1 publication needed to level up)
- PhD student (+2 publications needed)
- Postdoc / Research Fellow (+4 publications needed)
- Professor

Maybe remove this part if it's not useful.

### 4. Levelling and unlocking content

Initially, the number of features is limited. The player can unlock new features by earning XP and levelling up.
For each discipline, we track

- Level 1 (2-3 species worth of XP required to level up)

    Only fieldwork is available, limited to 1 observation per specie.

- Level 2

    Unlocks making multiple observations per specie (collect XP faster)

- Level 3

    Unlocks additional content (illustrations / summaries) after N=3? 5? observations of a specie

- Level 4

   Unlocks the University. Only an easy quizz can be done

- Level 5

   Unlocks the identification tests at the university

- Level 6

  Unlocks Academia and publications

- Level 7

  Unlocks the harder tests, more risky but more rewarding

### 5. Other content

- A map showing all the observations made by the player
- For each specie, a heatmap of all observations in the dataset (like in Seek)

# Content generation

### Generating species illustrations

A diffusion model can be used to batch generate illustrations of evey species in [this style](https://www.flickr.com/photos/biodivlibrary/).

- Prompt a txt2img model directly.
- If the result is not accurate enough for rare species, we can do img2img with a reference image.
- To improve style consistency, we can finetune a model for a specific style.

### Generating species summaries

Using LLMs, we can batch generate a summary/description for every discovered specie.

- a short summary
- a longer one is unlocked after getting more observations

### Generating quizzes

Using LLMs, generate a list of questions on a (discovered) specie by

- Fetching wikipedia or other content sources on the specie
- Prompt tuning to extract questions, see e.g. [Karpathy's Anki flashcards example](https://twitter.com/karpathy/status/1663262981302681603?s=20).


## Usage

Set the server public url:
- `BASE_URL` in `backend/nature_go/nature_go/settings.py`
- `API_URL` in `frontend/app.json`

For instance, it should be `http://localhost/` for local development, and something like `https://eleurent-curly-space-umbrella-jrjrw4g7rvfqgq-8000.preview.app.github.dev/` when using a Github codespace.

Then run

```
./launch.sh
```

Useful options: --web, and --tunnel for serving mobile on CodeSpace.
