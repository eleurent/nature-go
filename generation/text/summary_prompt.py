summary_v1 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write three short summaries of the article. They should be written in the first person, as if it was a personal observation by a 19th century botanist during an expedition, an entry in his log / diary. They should be simple to understand, informal and not too scientific. The first one (long) should be about 10 sentences long. The second one (medium) should be about 6 sentences long. The last one (short) should be about 3 sentences long. Please use the following template:

Long summary: {{long_summary}}

Medium summary: {{medium_summary}}

Short summary: {{short_summary}}
"""

summary_v2 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write three short summaries of the article. They should be written in the first person, as if it was a personal observation by a 19th century botanist, an entry in his log / diary. They should be simple to understand, informal and not too scientific. The first one (long) should be about 10 sentences long. The second one (medium) should be about 6 sentences long. The last one (short) should be about 3 sentences long. Please use the following template:

Long summary: {{long_summary}}

Medium summary: {{medium_summary}}

Short summary: {{short_summary}}
"""

summary_v3 = """
Here is some seed material about {plant_name}: 
{material}

-----
I'm making a game where the more observations you have about the plant, the more long and precise the summary gets. If you take one picture, you get a short summary, if you take another one a medium summary, and if you take another one a long summary.

Write three short summaries of the article. They should be written in the first person, as if it was a personal observation by a 19th century botanist during an expedition, an entry in his log / diary. It should be simple to understand, informal and not too scientific.
Here are the features of each summary:
Long summary: 10 sentences long, written in a confident manner to show that the botanist has gathered extensive knowledge about this plant.
Medium summary: 6 sentences long. Fairly confident, but there are still things to be discovered.
Short summary: 3 sentences long. Enthusiastic about this new discovery, eager to know more, but unsure about a lot of facts that still seem mysterious. 
Here is the answer template:

Long summary: {{long_summary}}

Medium summary: {{medium_summary}}

Short summary: {{short_summary}}
"""

summary_v4 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write three short summaries of the article. They should be written in the first person, as if it was a personal observation by a 19th century botanist during a very dangerous expedition, an entry in his log / diary. They should be simple to understand, informal and not too scientific. The first one (long) should be about 10 sentences long. The second one (medium) should be about 6 sentences long. The last one (short) should be about 3 sentences long. Please use the following template:

Long summary: {{long_summary}}

Medium summary: {{medium_summary}}

Short summary: {{short_summary}}
"""

summary_v5 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write three short summaries of the article. They should be written in the first person, as if it was a personal observation by a 19th century botanist, an entry in his log / diary. They should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. The first one (long) should be about 15 sentences long. The second one (medium) should be about 6 sentences long. The last one (short) should be about 3 sentences long. Please use the following template:

Long summary: {{long_summary}}

Medium summary: {{medium_summary}}

Short summary: {{short_summary}}
"""

summary_v6 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write a long summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century botanist, an entry in his log / diary. it should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. It should be about 15 sentences long. After the full summary has been generated, break it down into three small independent parts, quoting/repeating it exactly. Please use the following template:

Full summary: {{long_full_summary}}

Discovery and Part 1: {{small_part_1}}

Part 2: {{small_part_2}}

Part 3: {{small_part_3}}
"""

summary_v7 = """
Here is some seed material about {plant_name}: 
{material}

-----
Write a short three-part summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century botanist, an entry in his diary. It should be simple to understand, informal and not too scientific. Put emphasis on history, fun anecdotes or popular references if available in the material. Follow the style of a naturalist who is discovering and studying the species and writing a diary.
[Formatting]: Break it down into three very small paragraphs with no line break, separated by two <BREAK_1> and <BREAK_2> delimiters as follows:

{{paragraph_1}}
<BREAK_1>
{{small_paragraph_2}}
<BREAK_2>
{{small_paragraph_3}}
<BREAK_3>
"""

summary3_v1 = """
Write a short summary of the article. It should be written in the first person, as if it was a personal observation by a 19th century botanist during an expedition, an entry in his log / diary. It should be simple to understand, informal, not too scientific, and contain a lot of fun facts and trivia to look smart during a diner. It should be made of three paragraphs, each one being about 5 sentences long. Please use the following template:

Example:
Input: Tradescantia zebrina
Material: {{some material}}

First paragraph:
... (some content with general observations, in the style of a 19th century botanist in an expedition)

Second paragraph:
... (some content with more precise observations but stays interesting and non technical, keep the style of a 19th century botanist)

Third paragraph:
... (even more precise observations, stays interesting and non technical, keep the styke of a 19th century botanist)

Input: {plant_name}
Material: {material}

First paragraph:
"""