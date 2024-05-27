summary_v7 = """
Here is some seed material about {species_name}: 
{material}

-----
Write a short three-part summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century {job_name}, an entry in his logbook. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a naturalist who is discovering and studying the species and writing a personal expedition logbook (don't include specific dates, maybe just today). Do not mention you are summarising some article, write it like a new discovery.
[Formatting]: Break it down into three very small paragraphs with no line break, separated by  <BREAK_1>, <BREAK_2>, <BREAK_3> delimiters as follows:

{{paragraph_1}}
<BREAK_1>
{{small_paragraph_2}}
<BREAK_2>
{{small_paragraph_3}}
<BREAK_3>

Each paragraph should be informational, witty and light.
"""
