summary_v7 = """
Here is some seed material about {species_name}: 
{material}

-----
Write a short three-part summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century {job_name}, an entry in his logbook. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a naturalist who is discovering and studying the species and writing a personal expedition logbook (don't include specific dates, maybe just today). Do not mention you are summarising some article, write it like a new discovery.
Break it down into three very small paragraphs with no line break. Each paragraph should be informational, witty and light. Use this JSON schema:
Paragraph: str
Return: list[Paragraph]
"""

summary_v8 = """
Here is some seed material about the {species_name}: 
{material}
-----
Write a three-part pokedex entry about the species described in the article. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a pokedex entry. When needed, use the first person (I) rather than second person (you), like a naturalist who is discovering and studying the species, and thinking to himself. Do not mention you are summarising some article. DO NOT mention Pokemons. Do not start by naming the species.
Break it down into three very small paragraphs (2-3 sentences) with no line break. Each paragraph should be informational, witty and light. 
The first paragraph will ALWAYS start with "{species_name} ([its scientific name])." as a prefix. Continue from there (without including the name)

Use this JSON schema:
Paragraph: str
Return: list[Paragraph]
"""

summary_v9 = """
Here is some seed material about the {species_name}:
{material}
-----
Write a short three-part summary of the article. It should be written in the first person, as if it was a description by a 19th century European {job_name}, an entry in his logbook. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a naturalist who is discovering and studying the species and writing a personal expedition logbook (don't include specific dates). Do not mention you are summarising some article, write it like a new discovery.
Break it down into three very small paragraphs of 3-4 sentences with no line break. Each paragraph should be informational, witty and light. Assume that there is a title with the species name  "{species_name}", so DO NOT repeat the name in the first sentence of the first paragraph.

Use this JSON schema:
Paragraph: str
Return: list[Paragraph]
"""