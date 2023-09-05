question_prompt_few_shot = """
User: I am a teacher at a University and I would like to create multiple choice questions for my students based on some seed material.
Can you help me generate questions about Leontopodium nivale?
Here is the material: {{not shown for brevity}}

Assistant (you): Sure, I can help you generate multiple-choice questions based on the provided material about Leontopodium nivale, commonly known as edelweiss. Before we begin, let's break down the key points from the material that can serve as the basis for generating questions:

Edelweiss belongs to the daisy or sunflower family Asteraceae.
It grows in rocky limestone places at altitudes of 1,800–3,400 meters.
The plant has dense hairs on its leaves and flowers to protect against cold, aridity, and UV radiation.
Edelweiss has been used in traditional medicine for abdominal and respiratory diseases.
Now, let's generate some multiple-choice questions based on this information:

Question 1:
Where does edelweiss prefer to grow?
A: Sandy beaches
B: Grasslands
C: Rocky limestone places
D: Marshes
Answer: C

Question 2:
Why does edelweiss have dense hairs on its leaves and flowers?
A: To attract pollinators
B: To repel insects
C: To protect against cold, aridity, and UV radiation
D: For decorative purposes
Answer: C

Question 3:
What family does edelweiss belong to?
A: Daisy
B: Sunflower
C: Rose
D: Tulip
Answer: B

Question 4:
What is one traditional medicinal use of edelweiss?
A: Treating skin rashes
B: Curing headaches
C: Remedying abdominal and respiratory diseases
D: Enhancing memory
Answer: C

User: Can you help me generate questions about Rosa × alba?
Here is the material: {{not shown for brevity}}

Assistant (you): Certainly! Let's generate multiple-choice questions based on the provided information about Rosa × alba, the white rose of York:

Question 1:
What is the primary reason Rosa × alba was originally grown in ancient times?
A: Winter-hardiness
B: Disease resistance
C: Aromatic scent of flowers
D: Colorful petals
Answer: C

Question 2:
What is the chromosome ploidy of Rosa × alba?
A: Diploid
B: Tetraploid
C: Hexaploid
D: Octaploid
Answer: C

Question 3:
Which of the following is NOT a cultivar of Rosa × alba?
A: Rosa 'Alba Maxima'
B: Rosa 'Chloris'
C: Rosa 'Lemon Blush'
D: Rosa 'Ruby Red'
Answer: D

Question 4:
What is the primary symbolism of white roses, as mentioned in the provided external link?
A: Romantic love
B: Purity and innocence
C: Passion and desire
D: Friendship
Answer: B

User: Can you help me generate 4 questions about {plant_name}?
Here is the material: {material}
"""

