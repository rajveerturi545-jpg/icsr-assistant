// DEMO DATA ONLY: simplified lists for practice.
// To add a drug, copy one line and change the name and reactions.
// Always use lowercase.

const drugs = {
  "paracetamol": ["nausea", "rash", "urticaria", "hypersensitivity", "angioedema", "thrombocytopenia", "hepatotoxicity"],
  "amoxicillin": ["rash", "urticaria", "pruritus", "diarrhoea", "nausea", "vomiting", "candidiasis", "hypersensitivity", "anaphylaxis"],
  "ibuprofen": ["dyspepsia", "abdominal pain", "nausea", "diarrhoea", "gastric ulcer", "gastrointestinal haemorrhage", "headache", "dizziness", "rash", "fluid retention"],
  "metformin": ["diarrhoea", "nausea", "vomiting", "abdominal pain", "decreased appetite", "taste disturbance", "lactic acidosis", "vitamin b12 deficiency"],
  "atorvastatin": ["myalgia", "arthralgia", "headache", "nausea", "diarrhoea", "constipation", "dyspepsia", "flatulence", "insomnia", "rhabdomyolysis", "hepatic enzyme increased"],
  "azithromycin": ["diarrhoea", "nausea", "vomiting", "abdominal pain", "headache", "rash", "electrocardiogram qt prolonged", "hepatotoxicity", "anaphylaxis"],
  "cetirizine": ["somnolence", "headache", "dizziness", "dry mouth", "fatigue", "nausea", "abdominal pain"],
  "omeprazole": ["headache", "diarrhoea", "abdominal pain", "nausea", "vomiting", "constipation", "flatulence", "rash", "hypomagnesaemia"]
};

// Small term-coding dictionary (everyday words to a standard term)
const terms = {
  "stomach pain": { pt: "Abdominal pain", soc: "Gastrointestinal disorders" },
  "tummy pain": { pt: "Abdominal pain", soc: "Gastrointestinal disorders" },
  "belly pain": { pt: "Abdominal pain", soc: "Gastrointestinal disorders" },
  "loose motions": { pt: "Diarrhoea", soc: "Gastrointestinal disorders" },
  "loose motion": { pt: "Diarrhoea", soc: "Gastrointestinal disorders" },
  "throwing up": { pt: "Vomiting", soc: "Gastrointestinal disorders" },
  "skin rash": { pt: "Rash", soc: "Skin and subcutaneous tissue disorders" },
  "rash": { pt: "Rash", soc: "Skin and subcutaneous tissue disorders" },
  "itching": { pt: "Pruritus", soc: "Skin and subcutaneous tissue disorders" },
  "hives": { pt: "Urticaria", soc: "Skin and subcutaneous tissue disorders" },
  "sleepiness": { pt: "Somnolence", soc: "Nervous system disorders" },
  "drowsiness": { pt: "Somnolence", soc: "Nervous system disorders" },
  "headache": { pt: "Headache", soc: "Nervous system disorders" },
  "giddiness": { pt: "Dizziness", soc: "Nervous system disorders" },
  "muscle pain": { pt: "Myalgia", soc: "Musculoskeletal and connective tissue disorders" },
  "high bp": { pt: "Hypertension", soc: "Vascular disorders" }
};