import type { NotesDoc } from '../../lib/notesPdf';

// Condensed notes for /intro-to-business-analytics. The decision-framework
// stepper and the flip cards become, on paper, the seven steps and the table
// of everyday systems they were teaching.

export const ANALYTICS_NOTES: NotesDoc = {
  code: 'MBI806B',
  course: 'Business Data Analytics with Visualisation and Decision-Making',
  title: 'Business Decision-Making with AI and ML',
  summary:
    'How decisions get made, what AI and machine learning are, where they show up in a business, and what the course assesses.',
  accent: [15, 118, 110],
  fileName: 'MBI806B-Business-Analytics-notes',
  sections: [
    {
      heading: 'How a decision gets made',
      standfirst: 'A framework, before any AI enters the picture.',
      blocks: [
        {
          type: 'p',
          text:
            'A framework is a structured way to get from a problem to a choice you can defend. Most bad decisions are not bad analysis: they are good analysis of the wrong question, or a choice nobody reviewed afterwards.',
        },
        {
          type: 'numbered',
          title: 'The seven steps',
          pairs: [
            ['Define the problem', 'Say clearly what the issue or opportunity is, and understand its context.'],
            ['Gather information', 'Work out what data you need, then go and get it. Not everything easy to collect is worth collecting.'],
            ['Generate alternatives', 'Produce more than one option, including ones that are not immediately obvious. A choice between one option is not a choice.'],
            ['Evaluate alternatives', 'Weigh each option\'s risk, cost and likely outcome. This is where the analysis earns its keep.'],
            ['Choose one', 'Pick the option that fits the goals and is achievable with what you have.'],
            ['Implement it', 'Turn the choice into real actions, each with somebody responsible and a date attached.'],
            ['Review and learn', 'Check what happened and be honest about what you would do differently. Most people skip this one.'],
          ],
        },
        {
          type: 'callout',
          title: 'Where analytics fits',
          text:
            'Data-driven decision-making uses analysis to find patterns instead of relying on judgement alone. The human still decides, with better information, mostly at steps 2 and 4.',
        },
      ],
    },
    {
      heading: 'What AI and machine learning are',
      standfirst: 'Definitions that need no computer science background.',
      blocks: [
        {
          type: 'p',
          title: 'Artificial intelligence',
          text:
            'If you are interacting with a machine, by typing or talking, and it feels enough like talking to a person that you cannot easily tell the difference, that machine is behaving intelligently. AI is not about building an all-powerful machine. It is about building systems that behave in a human-like way, either by communicating with us or, in robotics, by physically doing something in the world.',
        },
        {
          type: 'p',
          title: 'Machine learning',
          text:
            'A computer program that learns to behave a certain way without a person explicitly programming every rule. It can end up behaving in ways its own creator did not fully predict. The learning comes from three things working together: data the program is given, a way of measuring how wrong its current behaviour is, and a feedback loop that uses that error to improve next time. Nobody writes "if this, then that" — the machine works it out from examples.',
        },
        {
          type: 'p',
          title: 'The relationship between them',
          text:
            'Machine learning is one specific way of building AI: training a model on data until it can perform a task. Every machine learning system is a form of AI. Not every AI system uses machine learning. The rule of thumb: all ML is AI, not all AI is ML.',
        },
        {
          type: 'numbered',
          title: 'Where data science fits, in four steps',
          pairs: [
            ['Gather data', 'From internal systems, public sources or third parties.'],
            ['Clean and structure it', 'Make sure it is usable, complete and consistent, before you trust it.'],
            ['Model and analyse it', 'Use statistics and machine learning to explore patterns and test ideas.'],
            ['Interpret the results', 'Communicate what you found clearly enough that somebody can act on it.'],
          ],
        },
      ],
    },
    {
      heading: 'The four ways a machine can learn',
      standfirst: 'These come up constantly through the course.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['Supervised learning', 'You give it labelled examples - emails already marked spam or not spam - and it learns the pattern between them.'],
            ['Unsupervised learning', 'No labels at all. It finds structure on its own, such as grouping customers into segments nobody defined in advance.'],
            ['Semi-supervised learning', 'A small batch of labelled examples plus a much larger pile of unlabelled ones. Useful when labelling everything by hand is too expensive.'],
            ['Reinforcement learning', 'It learns by trial and error, taking a reward or penalty for each action and adjusting to earn more reward over time.'],
          ],
        },
      ],
    },
    {
      heading: 'AI you already use',
      standfirst: 'Six everyday systems and the technique behind each.',
      blocks: [
        {
          type: 'table',
          head: ['What you see', 'What it is'],
          rows: [
            ['A streaming app queues your next show before you ask', 'Recommendation system. It learned your taste from what you already watched; nobody typed rules for "things you will like".'],
            ['Your bank texts about a payment that does not look like you', 'Fraud detection. It compares the transaction against your normal pattern and flags what does not fit.'],
            ['A map app says traffic will clear in 12 minutes', 'Predictive analysis. It has seen this road at this time often enough to forecast what usually happens next.'],
            ['A chatbot gives you a useful answer at 2am', 'Natural language processing, handling a routine question so a person does not have to be awake.'],
            ['A delivery app knows roughly when your order arrives', 'The forecasting used in supply chains, predicting demand and timing from patterns in past deliveries.'],
            ['Your photos app knows who is in the photo', 'Machine learning trained on labelled examples: enough tagged photos that it worked out how to recognise faces.'],
          ],
          weights: [1, 1.6],
        },
        {
          type: 'callout',
          title: 'Bring one of your own',
          text:
            'We open the course with this as a group activity. Come with an example from your own life rather than one off this list.',
        },
      ],
    },
    {
      heading: 'Where this shows up in a business',
      standfirst: 'Five areas, across almost every industry.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['Customer experience', 'Chatbots and assistants answer routine questions at any hour. Machine learning uses a customer\'s history to recommend what they might want next.'],
            ['Operational efficiency', 'Repetitive work such as data entry gets automated, and machine learning can predict a machine failure before it happens.'],
            ['Data-driven decisions', 'Large volumes of business data are searched for patterns nobody would spot manually, then used to forecast what happens next.'],
            ['Fraud and security', 'Transaction patterns are watched for anything unusual, and the system improves as it sees more data.'],
            ['Supply chains', 'Inventory, demand and delivery routes are optimised so a business can react faster and spend less doing it.'],
          ],
        },
        {
          type: 'kv',
          title: 'What AI contributes to a decision',
          pairs: [
            ['Predictive analysis', 'Studies large datasets for patterns a person would take far too long to find, and forecasts what customers or markets are likely to do.'],
            ['Recommendation systems', 'The same idea that picks your next show, redirected at business decisions.'],
            ['Decision support systems', 'In finance, healthcare and logistics, surfacing the relevant data at the moment somebody has to decide something important.'],
          ],
        },
        {
          type: 'callout',
          title: 'A caveat',
          text:
            'None of this is automatically safe to trust. The data has to be accurate, and somebody still has to interpret what the algorithm says. As AI takes a larger part in decisions affecting real people, bias, transparency and accountability matter. LO4 assesses exactly this.',
        },
      ],
    },
    {
      heading: 'What the course assesses',
      standfirst: 'Word for word from the course descriptor.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['LO1', 'Evaluate advanced business data analytics techniques, including AI and ML algorithms, to make informed decisions within a business organization.'],
            ['LO2', 'Apply industry-standard business analytics tools to improve the efficiency and effectiveness of decision-making processes in a business context.'],
            ['LO3', 'Assess and apply different data visualization techniques to convey specific types of business information for an organization.'],
            ['LO4', 'Critically evaluate business analytics practices from an ethical and data privacy perspective within a business context.'],
          ],
        },
        {
          type: 'bullets',
          title: 'The twelve topics across the course',
          items: [
            'Business decision-making with AI and ML',
            'Data visualisation for business communication',
            'Advanced data analysis with AI and ML',
            'Risk management in AI/ML applications',
            'Addressing data privacy and security risks in business analytics',
            'Decision-making frameworks',
            'Advanced visualisation techniques',
            'Integrating findings and visualisations into decisions',
            'Industry-standard business analytics tools',
            'Advanced data analysis and predictive modelling',
            'Ethical considerations in business analytics',
            'Future trends in business data analytics',
          ],
        },
        {
          type: 'p',
          text:
            'MBI806B is a 15 credit, Level 8 course. It builds on MBI805B, taken alongside it, and needs MBI801 as a foundation; MBI807B, Business Intelligence and Data Warehousing, follows it. 150 learning hours in total: 36 in class and 114 on your own. No coding, statistics or prior AI experience is assumed.',
        },
      ],
    },
    {
      heading: 'Coming prepared',
      blocks: [
        {
          type: 'bullets',
          items: [
            'Bring a laptop, with Power BI open in a browser if you can. There is a separate setup guide covering this on any operating system.',
            'Bring no prior experience. If you have never opened a data tool before, the course was written for you.',
            'Bring one example of AI you have noticed in your own life. It gets used in the group discussion.',
          ],
        },
        {
          type: 'callout',
          title: 'Why it is worth learning',
          text:
            'Automating routine work saves time and money. Personalised, faster support keeps customers loyal. You understand your own operations more deeply. Businesses that adopt early tend to out-innovate those that wait, and the same tools keep working as the business grows.',
        },
      ],
    },
  ],
};
