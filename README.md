# CrUX Dashboard

A web app to fetch and visualize Chrome UX Report (CrUX) data for one or more URLs, with filtering, sorting, summary, and actionable insights.

---

## Features
- Enter multiple URLs (one per line)
- Fetch CrUX metrics (FCP, LCP, CLS) for each URL
- Filter and sort results
- Summary row for averages
- Insights & Recommendations for each URL
- Error handling for invalid URLs or API issues

---

## Setup & Run Instructions

### 1. Unzip the Project
Extract the contents of `crux.zip` to your desired location.

### 2. Install Prerequisites
- **Node.js** (v16 or v18 recommended)
- **npm** (comes with Node.js)

### 3. Backend Setup
```sh
cd crux/backend
npm install
cp .env.example .env
# Edit .env and set your Google Chrome UX Report API key
```
- Open `.env` and set:
  ```
  CRUX_API_KEY=your_actual_crux_api_key_here
  ```
  > You must obtain a valid API key from Google Cloud Console with the Chrome UX Report API enabled.

- Start the backend:
  ```sh
  npm start
  ```
  The backend will run on [http://localhost:5050](http://localhost:5050).

### 4. Frontend Setup
```sh
cd crux/frontend
npm install
npm start
```
- The app will open at [http://localhost:3000](http://localhost:3000).

### 5. Usage
- Enter one or more URLs (one per line) in the input box.
- Click **SEARCH** to fetch and view Chrome UX Report metrics.
- Use filter and sort features as needed.
- View summary and actionable insights below the table.

---

### Notes
- **API Key:** Use your own Google API key. The `.env.example` file provides the required variable name.
- **No node_modules:** Run `npm install` in both `backend` and `frontend` to install dependencies.
- **No sensitive data:** The `.env` file is not included in the zip for security.

---

### Project Structure
```
crux/
  backend/
    index.js
    package.json
    package-lock.json
    .env.example
  frontend/
    src/
    public/
    package.json
  .gitignore
  README.md
```

---

## Demo Video
- [Include a link to your screen recording here]
- Show entering URLs, searching, filtering, sorting, and viewing insights

---

## Design & Architecture
- **Frontend:** React + Material UI, Axios for API calls
- **Backend:** Node.js + Express, Axios for CrUX API
- **API:** Google Chrome UX Report API
- **State:** Managed with React hooks

---

## Known Issues
- CrUX API may not have data for all URLs
- API key must be set and enabled for Chrome UX Report API
- React/MUI version mismatches can cause hook errors (use React 18.2.0)
- Some UI features may require a page reload if switching input modes

---

## Next Steps / Improvements
- Deploy frontend (Vercel/Netlify) and backend (Render/Heroku)
- Add authentication for API key management
- Allow CSV export of results
- Add more detailed insights (e.g., historical trends, charts)
- Add loading spinners and better error messages
- Write unit and integration tests

---

## License
MIT 
 