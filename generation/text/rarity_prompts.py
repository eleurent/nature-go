rarity_v1 = """How rare is it to encounter the plant {plant_name}? Consider the following scale: 1. Very common 2. Common 3. 
Uncommon 4. Rare 5. Very rare 6. Extremely rare 7. Endangered 8. Extinct 9. Unknown Please write a short summary of 
the rarity of the plant {plant_name}, and at the end write the number corresponding to the rarity of the plant 
{plant_name} on the scale above."""

rarity_wiki_v1 = """How rare is it to encounter the plant {plant_name}? 
Here is some seed material about {plant_name}:
{material}

Consider the following scale: 1. Very common 2. Common 3. 
Uncommon 4. Rare 5. Very rare 6. Extremely rare 7. Endangered 8. Extinct 9. Unknown Please write a short summary of 
the rarity of the plant {plant_name}, and at the end write the number corresponding to the rarity of the plant 
{plant_name} on the scale above."""

rarity_batch_v1 = """How rare is it to encounter a given plant? Consider the following scale: 1. Very common 2. Common 3. 
Uncommon 4. Rare 5. Very rare 6. Extremely rare 7. Endangered 8. Extinct 9. You will be given a list of plant name, and 
you will have to write the numbers corresponding to the rarity of each one. 
Example:
Input: [Pulmonaria affinis, Ocimum basilicum, Acer pseudoplatanus, Anemone coronaria, Poa pratensis, Abronia ammophila...]
Output:
Pulmonaria affinis: 4
Ocimum basilicum: 1
Acer pseudoplatanus: 2
Anemone coronaria: 4
Poa pratensis: 1
Abronia ammophila: 6

Input: {plant_names}
Output:
 """