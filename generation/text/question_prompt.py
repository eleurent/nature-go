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

Question 4:
What is one traditional medicinal use of the Edelweiss?
A: Treating skin rashes
B: Curing headaches
C: Remedying abdominal and respiratory diseases
D: Enhancing memory
Answer: C

User: Can you help me generate questions about the Austrian copper rose?
Here is the material: {{not shown for brevity}}

Assistant (you): Certainly! Let's generate multiple-choice questions based on the provided information about the Austrian copper rose, Rosa foetida:

Question 1:
What is the primary reason the Austrian copper rose was important to European horticulture?
A: Its unique scent
B: Its vibrant yellow flowers
C: Its resistance to black spot
D: Its contribution to the stock of cultivated roses
Answer: B

Question 2:
Who successfully cultivated the Austrian copper rose in the imperial garden of Rudolf II in Vienna?
A: Joris Hoefnagel
B: Joseph Pernet-Ducher
C: Carolus Clusius
D: Antoine Ducher
Answer: C

Question 3:
What is one drawback of the Austrian copper rose?
A: Its objectionable scent
B: Its lack of vigor
C: Its susceptibility to black spot
D: Its spindly bush shape
Answer: A

Question 4:
Where does the name 'Rosa foetida' come from?
A: it is Latin for "having a bad smell"
B: it means "baby rose" in Latin
C: it comes from the greek word for "happiness"
D: it was discoevered by Dr. Foetid
Answer: A

User: Can you help me generate 4 questions about {plant_name}?
Here is the material: {material}
"""
