import type { NotesDoc } from '../../lib/notesPdf';

// Condensed notes for /power-bi-setup. This one earns its PDF more than the
// others: it is the document a student wants open on a phone while they are
// setting up on a laptop, so the steps are written to be followed away from
// the page. The practice chart-builder becomes the written walkthrough.

export const POWERBI_NOTES: NotesDoc = {
  code: 'MBI806B',
  course: 'Business Data Analytics with Visualisation and Decision-Making',
  title: 'Setting up Power BI',
  summary:
    'Getting Power BI running on any laptop, signing in, and building your first chart. Written for people who have never opened a data tool.',
  accent: [15, 118, 110],
  fileName: 'MBI806B-Power-BI-setup-notes',
  sections: [
    {
      heading: 'The three parts of Power BI',
      standfirst: 'Instructions online rarely say which one they mean.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['Power BI Service', 'The online half, at app.powerbi.com, in any browser on any operating system. You sign in, build reports, and share them. This is where the course starts, and where a Mac stays.'],
            ['Power BI Desktop', 'An application you install. Windows only - there is no Mac version. The heavy end: full Power Query for reshaping messy data, deeper modelling, many more connectors. Free.'],
            ['Power BI mobile', 'An iOS and Android app for reading reports somebody has already built. You do not author in it, so it is not part of setting up.'],
          ],
        },
        {
          type: 'p',
          text:
            'Both authoring routes end in the same place. A report built in the browser is a real report, sitting in the same workspace Power BI Desktop would publish to.',
        },
      ],
    },
    {
      heading: 'Before you sign in',
      blocks: [
        {
          type: 'callout',
          title: 'Use your institutional email address',
          text:
            'Power BI sign-up requires a work or school email account. A personal Gmail, Hotmail or Outlook.com address is refused, and the error message does not explain why. Use the address your institution issued you. If you have already tried with a personal address, sign out completely, close the tab, and start again with the right one.',
        },
        {
          type: 'p',
          text:
            'A second, rarer blocker: some organisations switch off self-service sign-up. If you see a message saying your organisation does not allow it, that is an administrator setting. Nothing on your machine will fix it — email IT and ask for a Power BI licence.',
        },
      ],
    },
    {
      heading: 'If you have a Mac, Chromebook, iPad or Linux machine',
      standfirst: 'You will be working in the browser.',
      blocks: [
        {
          type: 'p',
          text:
            'Power BI Desktop is a Windows application. Microsoft has never shipped a Mac version and has not announced one. The service itself runs as a web application, though, and works on your machine today with nothing to install. Every exercise in this guide works for you.',
        },
        {
          type: 'numbered',
          pairs: [
            ['Open app.powerbi.com', 'Any modern browser on any operating system. Safari, Chrome, Edge and Firefox all work. Nothing to download.'],
            ['Sign in with your student email', 'The address your institution gave you. See the warning above - this is the step that catches people.'],
            ['Accept the free licence if prompted', 'You may see "Start free" or a trial prompt. The free licence covers everything here: you get My Workspace and can build and save reports in it.'],
            ['Find My Workspace', 'In the left-hand navigation. That is your own private area; nothing in it is visible to anyone else until you deliberately share it.'],
          ],
        },
        {
          type: 'callout',
          title: 'A note on virtual machines',
          text:
            'Other guides suggest running Windows on a Mac through Parallels or Boot Camp. Do not bother. You would be licensing and maintaining a second operating system to open one application. If you hit a point where the browser is not enough, ask before buying anything.',
        },
      ],
    },
    {
      heading: 'If you have Windows',
      standfirst: 'Browser first, then Desktop.',
      blocks: [
        {
          type: 'numbered',
          pairs: [
            ['Do the browser steps first', 'Desktop is an addition, not a replacement. You still need a Service account to publish anything.'],
            ['Open the Microsoft Store and search "Power BI Desktop"', 'Prefer this route: it updates itself, downloads only what changed, and does not need administrator rights.'],
            ['Or download the installer directly', 'From the Microsoft Download Center, choosing the 64-bit version. This route does need administrator rights.'],
            ['Open it and close the sign-in prompt', 'Power BI Desktop works without signing in. Sign in later, when you want to publish a report to your workspace.'],
          ],
        },
        {
          type: 'table',
          title: 'Minimum requirements for Power BI Desktop',
          head: ['Requirement', 'What you need'],
          rows: [
            ['Operating system', 'Windows 10 or later, or Windows Server 2016 or later'],
            ['Architecture', '64-bit only. The 32-bit version is no longer supported'],
            ['Framework', '.NET 4.7.2 or later, plus WebView2'],
            ['Memory', '2 GB available at minimum, 4 GB or more recommended'],
            ['Screen', 'At least 1440x900 or 1600x900'],
            ['Display scaling', 'Set text scaling to 100%'],
          ],
          weights: [1, 2],
        },
        {
          type: 'p',
          text:
            'Most laptops from the last few years clear all of this. The two that catch people out are screen size and display scaling, and both produce the same symptom: a dialog box you cannot reach or close.',
        },
      ],
    },
    {
      heading: 'Your first chart',
      standfirst: 'Three rows of made-up data.',
      blocks: [
        {
          type: 'numbered',
          title: 'The seven steps',
          pairs: [
            ['Go to My Workspace', 'In the left navigation at app.powerbi.com. In Power BI Desktop, start a new report from the Home tab instead.'],
            ['Choose New, then Semantic model', 'A semantic model is Power BI\'s name for the data a report sits on. Older menus and guides call the same thing a dataset.'],
            ['Pick "Paste or manually enter data"', 'Rather than connecting to a real source. The Power BI Desktop equivalent is the Enter data button on the Home tab.'],
            ['Type two columns and three rows', 'Item and Sales. Coffee 120, Tea 90, Juice 60. If you paste a header row, tick "Use first row as headers".'],
            ['Load it, then create a report', 'Your table now exists as a semantic model. Choose Create report next to it and the report editor opens on an empty canvas.'],
            ['Add a bar chart and fill the two wells', 'Click the bar chart icon in the Visualizations pane. Put Item on the axis and Sales on the values. The chart draws itself.'],
            ['Save it', 'Give it a name you will recognise. It lives in My Workspace, private to you, and reopens from any machine you sign in on.'],
          ],
        },
        {
          type: 'p',
          text:
            'Note what happened at step six. You never told Power BI to draw bars, sort them or label an axis — it worked that out from two fields dropped into two wells. Everything later is the same move, with real data and harder questions behind it.',
        },
        {
          type: 'callout',
          title: 'About pasted data',
          text:
            'Pasted data is a snapshot, not a connection. There is no way to refresh it, so to change it you re-paste or move to a file. It caps out around 512 KB, with table names up to 80 characters and column names up to 512. Three rows will not trouble that, but it is why real work starts from a file or a database.',
        },
      ],
    },
    {
      heading: 'Browser versus Desktop',
      standfirst: 'Where the browser stops.',
      blocks: [
        {
          type: 'table',
          head: ['What you want to do', 'Browser', 'Desktop', 'Notes'],
          rows: [
            ['Type or paste a small table and build from it', 'Yes', 'Yes', 'The exercise above. The same on both.'],
            ['Upload an Excel or CSV file', 'Yes', 'Yes', 'Both take a file straight from your machine.'],
            ['Build reports, charts, slicers and pages', 'Yes', 'Yes', 'The report editor in the browser is the same editor.'],
            ['Edit the data model, relationships and measures', 'Partly', 'Yes', 'The browser can edit models in a workspace; Desktop is more complete.'],
            ['Reshape messy data with Power Query', 'No', 'Yes', 'The one real gap: merging, splitting, unpivoting, cleaning columns.'],
            ['Connect to databases and the wider connector list', 'Partly', 'Yes', 'Desktop reaches far more sources, including a local SQL Server.'],
            ['Refresh data you pasted by hand', 'No', 'No', 'Pasted data is a snapshot. Re-paste, or move to a file.'],
            ['Share a report with somebody else', 'Partly', 'No', 'Sharing is a Power BI Pro feature. Building alone is free.'],
          ],
          weights: [1.7, 0.5, 0.5, 2],
        },
        {
          type: 'p',
          text:
            'Power Query is the row that matters. If you are on a Mac and the course reaches genuinely messy data that needs reshaping, come and ask rather than buying anything.',
        },
      ],
    },
    {
      heading: 'When it goes wrong',
      standfirst: 'These six come up every year.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['"We can\'t find an account with that email"', 'You used a personal address. Sign out completely and try again with your institution\'s email.'],
            ['"Your organisation doesn\'t allow self-service sign-up"', 'An administrator switched it off. Email IT and ask for a licence. Nothing on your machine will fix this.'],
            ['Signed in, but cannot find My Workspace', 'Open the left navigation with the menu icon at the top of the page. My Workspace is near the bottom of that list.'],
            ['The Store says Power BI Desktop is unavailable', 'Your Windows build may be too old, or the Store is managed. Use the direct download, or work in the browser.'],
            ['Power BI Desktop opens with large black areas', 'A Windows display-scaling issue. Search Windows for "blurry", turn on "Let Windows fix apps that are blurry", and restart it.'],
            ['Stuck, and class is tomorrow', 'Come anyway. Turning up with an unsolved setup problem is completely fine and much faster to fix in person.'],
          ],
        },
      ],
    },
    {
      heading: 'Where to look things up',
      standfirst: 'Microsoft changes their interface regularly. Where this document and their documentation disagree, theirs is correct.',
      blocks: [
        {
          type: 'kv',
          pairs: [
            ['Power BI Service', 'app.powerbi.com'],
            ['Power BI Desktop, Microsoft Store', 'aka.ms/pbidesktopstore'],
            ['Power BI Desktop, direct download', 'microsoft.com/download/details.aspx?id=58494'],
            ['Download and install Power BI Desktop', 'learn.microsoft.com/power-bi/fundamentals/desktop-get-the-desktop'],
            ['Sign up for the Power BI service', 'learn.microsoft.com/power-bi/fundamentals/service-self-service-signup-for-power-bi'],
            ['Create a report in the service', 'learn.microsoft.com/power-bi/create-reports/service-report-create-new'],
            ['Getting started with Power BI Desktop', 'learn.microsoft.com/power-bi/fundamentals/desktop-getting-started'],
            ['Power BI Essential Training', 'LinkedIn Learning - free through most institutional logins'],
          ],
        },
      ],
    },
  ],
};
