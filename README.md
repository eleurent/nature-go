# Nature go

A generative AI project

## Summary

Inspired by Pokemon go, this app is an augmented reality game about discovering observing wildlife.
The universe / mood revolves around being a young naturalist in the 19th century, doing fieldwork in botany and zoology (ornithology specifically).

- **Discovering species**: when hiking, the player photographs wildlife, and pictures are sent to an identification API (e.g. PlantNet, Merlin Bird ID).
- **Collecting observations**: observations are gathered in an herbarium and an ornithology logbook.

## Graphic style

The app should generally feel like a scientist's expedition log / notebook. Discovered species are illustrated like in an herbarium, or a natural zoology journal.

- **Resource**: the [Biodiversity Heritage Library](https://www.flickr.com/photos/biodivlibrary/)
- Keywords: naturalist logbook, ornithology journal, botany, birdwatching, birder, botanist, Charles Darwin
- Menus appearance: turning pages of the journal / diary / notebook
- Species: each specie will have an illustration in [this style](https://www.flickr.com/photos/biodivlibrary/).

## Gameplay

### 1. Fieldwork: observing species

The base activity is to wander in Nature and take photos of species of two categories

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

Once enough observations of a species have been collected, this unlocks the ability to do an academic study.
There can be several kind of studies:

- answering a **knowledge exam** (quizz with multiple choice or open questions)
  - a quizz is passed only by correctly answering 100% correctly, and we do not give feedback only the final score.
  - the questions are sampled over discovered species
  - a quizz can be passed again, but each question already answered has diminishing returns (incentivizes discovering new species to get new questions).
  - the difficulty of the quizz can be controlled through the difficulty of its questions, or the number of questions in the quizz
- passing an **identification test**: given images of birds/plants that have been observed, find the correct specie
  - the difficulty will increase naturally as we discover more and more species
  - there will be a lot of repetition initially, but this is key to learning
- possibly do active learning to adapt the tests content to the user's past attempts?

Studying is also rewarded with XP, but not only.

### 3. Academia: writing publications?

After a few species have been studied, we can write a  (fake) publication based on that content, e.g.

```bibtex
Leurent, E., & Smith, J. (1823). A comparative study of the morphology and ecology of edelweiss, forget-me-not, and daffodils. Journal of Botany, 23(2), 45-56.
```

This is mostly a cosmetic reward for completing studies, and also allows to upgrade our **title** and **appearance**

- Scout (1 publication needed to level up)
- PhD student (+2 publications needed)
- Postdoc / Research Fellow (+4 publications needed)
- Professor

### 4. Levelling and unlocking content

Initially, the number of features is limited. The player can unlock new features by earning XP and levelling up.
For each discipline, we track

- Level 1 (2-3 observations required to level up)

    Only fieldwork is available, limited to 1 observation per specie.

- Level 2

    Unlocks making multiple observations per specie (collect XP faster)

- Level 3

    Unlocks additional content (illustrations / summaries) after N=5 observations of a specie

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

# TO DO

## ML

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

### Training a Bird ID classifier

Unfortunately, unlike PlantNet, Merlin Bird ID doesn't have an open API.
We can try to train our own model, but we need a dataset.

## Software engineering

### Backend with Django

Write the model and json views for:

- All supported species
- User, XPs, level, title, etc.
- Observations of the user (picture, time, location, api response, identified specie)
- Quizz questions
- User's quizz responses / scores
- User's ID test responses / scores

### Frontent with Expo and React Native

- One component per django view
  - Main menu
    - Herbarium
      - Specie
        - Observations
