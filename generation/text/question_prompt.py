question_prompt_few_shot = """
User: I am a teacher at a University and I would like to create multiple choice questions for my students based on some seed material.
Can you help me generate questions about the Edelweiss?
Here is the material: {{not shown for brevity}}

Assistant (you): Sure, I can help you generate multiple-choice questions based on the provided material about the Edelweiss, also known as Leontopodium nivale. Before we begin, let's break down the key points from the material that can serve as the basis for generating questions:

the Edelweiss belongs to the daisy or sunflower family Asteraceae.
It grows in rocky limestone places at altitudes of 1,800–3,400 meters.
The plant has dense hairs on its leaves and flowers to protect against cold, aridity, and UV radiation.
the Edelweiss has been used in traditional medicine for abdominal and respiratory diseases.
Now, let's generate some multiple-choice questions based on this information:

Question 1:
Where does the Edelweiss prefer to grow?
A: Sandy beaches
B: Grasslands
C: Rocky limestone places
D: Marshes
Answer: C

Question 2:
Why does the Edelweiss have dense hairs on its leaves and flowers?
A: To attract pollinators
B: To repel insects
C: To protect against cold, aridity, and UV radiation
D: For decorative purposes
Answer: C

Question 3:
What family does the Edelweiss belong to?
A: Daisy
B: Sunflower
C: Rose
D: Tulip
Answer: B

User: Can you help me generate questions about the Barn owl?
Here is the material: {{not shown for brevity}}

Assistant (you): Certainly! Let's generate multiple-choice questions based on the provided information about the barn owl (Tyto alba):

Question 1:
Barn owls are most commonly found in which of the following habitats?
A: Deserts
B: Dense forests
C: Open grasslands and farmlands
D: Oceans
Answer: C

Question 2:
What is the main function of the tiny serrations and hairlike fringes on a barn owl's wings?
A: To attract mates
B: To keep its wings warm
C: To sense changes in air pressure
D: To help the owl fly silently
Answer: D

Question 3:
Barn owls are beneficial to farmers because they help control populations of:
A: Insects
B: Small mammals
C: Fish
D: Large birds
Answer: B

User: Can you help me generate 3 questions about {species_name}?
Here is the material: {material}
"""
