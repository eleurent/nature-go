summary_v7 = """
Here is some seed material about {species_name}: 
{material}

-----
Write a short three-part summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century {job_name}, an entry in his logbook. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a naturalist who is discovering and studying the species and writing a personal expedition logbook (don't include specific dates, maybe just today). Do not mention you are summarising some article, write it like a new discovery.
Break it down into three very small paragraphs with no line break. Each paragraph should be informational, witty and light. Use this JSON schema:
Paragraph: str
Return: list[Paragraph]
"""
