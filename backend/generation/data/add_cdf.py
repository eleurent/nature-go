import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('plantnet_species.csv')
df['cdfOccurences'] = (df['numberOfOccurrences']).rank() / df.shape[0]
df.to_csv('plantnet_species_cdf.csv')
# df.sort_values(by='numberOfOccurrences', ascending=False, inplace=True)
# df['log_occ'] = np.log(df['numberOfOccurrences'])
# df.plot(x='cdfOccurences', y='numberOfOccurrences')
# plt.show()
