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