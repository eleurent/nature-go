question_prompt_few_shot = """
User: I am a teacher at a University and I would like to create multiple choice questions for my students based on some seed material.
Can you help me generate questions about the Edelweiss, and format them in json?
Here is the material: {{not shown for brevity}}.
Do not mention that you are summarising a material.

Assistant (you): Sure, I can help you generate multiple-choice questions based on the provided material about the Edelweiss, also known as Leontopodium nivale. Before we begin, let's break down the key points from the material that can serve as the basis for generating questions:

the Edelweiss belongs to the daisy or sunflower family Asteraceae.
It grows in rocky limestone places at altitudes of 1,800–3,400 meters.
The plant has dense hairs on its leaves and flowers to protect against cold, aridity, and UV radiation.
the Edelweiss has been used in traditional medicine for abdominal and respiratory diseases.
Now, let's generate some multiple-choice questions based on this information:

```json
[
  {
    "question": "Where does the Edelweiss prefer to grow?"
    "choices": [
      "Rocky limestone places",
      "Sandy beaches",
      "Grasslands",
      "Marshes"
    ],
    "correct_choice": 0
  },
  {
    "question": "Why does the Edelweiss have dense hairs on its leaves and flowers?",
    "choices": [
      "To attract pollinators",
      "To repel insects",
      "To protect against cold, aridity, and UV radiation",
      "For decorative purposes"
    ],
    "correct_choice": 2
  },
  {
    "question": "What family does the Edelweiss belong to?",
    "choices": [
      "Daisy",
      "Sunflower",
      "Rose",
      "Tulip"
    ],
    "correct_choice": 1
  }
]
```


User: Can you help me generate questions about the Barn owl, and format them in json?
Here is the material: {{not shown for brevity}}, again don't mention it.

Assistant (you): Certainly! Let's generate multiple-choice questions based on the provided information about the barn owl (Tyto alba):

```json
[
  {
    "question": "Barn owls are most commonly found in which of the following habitats?"
    "choices": [
      "Deserts",
      "Dense forests",
      "Open grasslands and farmlands",
      "Oceans"
    ],
    "correct_choice": 2
  },
  {
    "question": "What is the main function of the tiny serrations and hairlike fringes on a barn owl's wings?",
    "choices": [
      "To attract mates",
      "To keep its wings warm",
      "To sense changes in air pressure",
      "To help the owl fly silently"
    ],
    "correct_choice": 3
  },
  {
    "question": "Barn owls are beneficial to farmers because they help control populations of:",
    "choices": [
      "Insects",
      "Small mammals",
      "Fish",
      "Large birds"
    ],
    "correct_choice": 1
  }
]
```


User: Can you help me generate 3 questions about $species_name?
Here is the material: $material

DO NOT mention the existence of this material.

Use this JSON schema:
  Question = {"question": str, "choices": list[str], "correct_choice": int}

Return: list[Question]
"""
