import Questions, { type QuestionItem } from '../lab/Questions';

// ─── Eight questions you can answer from the data card alone ──────────────
// Same idea as the linear regression lab: answer on paper first, then open
// the answer, which always says where on the Kaggle page it lives. Checked
// against the live page (October 2026) and against the CSV itself.

const QS: QuestionItem[] = [
  {
    q: 'How many customers are in it, and how many columns?',
    where: 'Data Explorer, About this file',
    a: <><b>7,043 customers and 21 columns.</b> The Data Explorer says it in one line: "The raw data contains 7043 rows (customers) and 21 columns (features)." The Summary on the right says 21 columns too.</>,
  },
  {
    q: 'Which column are we trying to predict, and what exactly does it mean?',
    where: 'Content, the first bullet, and the Data Explorer',
    a: <><b>Churn.</b> It means "customers who left within the last month". The Data Explorer even says "The 'Churn' column is our target." Churn is the business word for customers leaving, and you'll hear it in every subscription company.</>,
  },
  {
    q: 'Is this a real phone company?',
    where: 'The Context paragraph, and the IBM link at the bottom',
    a: <><b>No.</b> The card says "[IBM Sample Data Sets]". IBM made it up for training courses: its own page describes a fictional telco with 7,043 customers in California. The patterns are realistic, but no real company is behind them, so be careful what you claim.</>,
  },
  {
    q: 'Are you allowed to use it?',
    where: 'License, on the right',
    a: <><b>For learning, yes. For sharing the data itself, no.</b> The licence is "Data files © Original Authors". That isn't an open licence. Copyright stays with IBM. Using it in class and quoting a few results with credit is fine. Re-uploading the CSV somewhere, or putting it in a product, isn't. Name and link it in your report.</>,
  },
  {
    q: 'When is this data from?',
    where: 'The top of the page, and Expected update frequency',
    a: <><b>The card doesn't say.</b> It was uploaded "9 years ago", and the update frequency is "Not specified". There's no year anywhere. So nothing here tells you how customers behave today. Say so in your report.</>,
  },
  {
    q: 'Kaggle says Churn is 100% "mismatched". Is it broken?',
    where: 'Data Explorer → Column tab → Churn',
    a: <><b>No.</b> Same story as smoker in the last lab. Kaggle guessed it was a true/false column, but the file says "Yes" and "No", so nothing matched the guess. The data is fine. A model can't read "Yes" either, though, so you'll turn it into 1 and 0.</>,
  },
  {
    q: 'TotalCharges shows 0 missing, but 11 mismatched. What might that mean?',
    where: 'Column tab → TotalCharges',
    a: <><b>Eleven values in a money column aren't numbers.</b> They aren't empty, or Kaggle would count them as missing. Something else is sitting in those cells. Write down your guess. You'll find out exactly what in step 6, and it's the most important cleaning job in this lab.</>,
  },
  {
    q: 'customerID has 7,043 unique values. Should the model learn from it?',
    where: 'Column tab → customerID',
    a: <><b>No.</b> 7,043 customers, 7,043 different IDs: it's a name tag, not information about the customer. A model that learned "customer 7590-VHVEG left" has learned nothing it can use on anyone new. IDs are useful for finding duplicates, which is exactly what you'll use it for in step 6.</>,
  },
];

export default function DataCardQuestions() {
  return <Questions items={QS} />;
}
