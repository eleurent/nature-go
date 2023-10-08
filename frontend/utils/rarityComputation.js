// details are in the generation/data/database_analysis.ipynb notebook
export const classifyRarity = (row) => {
    const rgpt = row.rarity_gpt;
    const ocdf = row.occurences_cdf;
  
    if (ocdf > 0) {
      if (rgpt <= 2.8) return 'Very Common';
      if ((rgpt > 2.8 && rgpt <= 3.4) || ocdf >= 0.3097) return 'Common';
      if ((rgpt > 3.4 && rgpt <= 3.6) || (ocdf < 0.3097 && ocdf >= 0.11)) return 'Uncommon';
      if ((rgpt > 3.6 && rgpt <= 4.2) || (ocdf < 0.11 && ocdf >= 0.01)) return 'Rare';
    }
  
    if (rgpt <= 2.8) return 'Very Common';
    if (rgpt > 2.8 && rgpt <= 3.4) return 'Common';
    if (rgpt > 3.4 && rgpt <= 3.8) return 'Uncommon';
    if (rgpt > 3.8 && rgpt <= 4.6) return 'Rare';
    if (rgpt > 4.6) return 'Legendary';
  };
  