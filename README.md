## Borsa Go

A simple stock profit and purification calculator built with React and TypeScript.  
It helps you calculate gross and net profit, purification amounts, and keep a history of your calculations.

### Features

- **Interactive calculator**

  - Purchase and market value inputs
  - Support for direct market value or shares × price
  - Total fees or multiple discrete fee items
  - Calculates:
    - Gross profit
    - Net profit
    - Purifying amount
    - Final (purified) profit

- **Saved calculations**

  - Save any calculation to local storage
  - View all saved entries in a table
  - Edit existing entries and re-save without duplicating
  - Delete entries you no longer need

- **Export to Excel (CSV)**
  - Export the saved calculations table to a CSV file
  - Open directly in Excel or any spreadsheet program

### Tech Stack

- **React** (with hooks)
- **TypeScript**
- **Vite** (development & build)
- **Tailwind CSS / shadcn-ui style components**
- LocalStorage for persistence

### Getting Started

1. **Clone the repo**

```bash
git clone git@github.com:Rami-Ayad/Borsa-Go.git
cd Borsa-Go
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the dev server**

```bash
npm run dev
```

Then open the printed local URL in your browser (usually `http://localhost:5173`).

### Build for Production

```bash
npm run build
```

The production build will be output to the `dist` folder.

### Linting

If you have lint scripts configured (e.g. with ESLint), you can run:

```bash
npm run lint
```

### Notes

- Saved calculations are stored in the browser’s `localStorage`, keyed by `borsa_go_saved_entries`.
- Exported CSV files can be opened in Excel, Google Sheets, or any spreadsheet app.
