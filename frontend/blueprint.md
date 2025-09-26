
# Auto-Apply Blueprint

## Overview

This document outlines the project structure, features, and implementation details of the "Auto-Apply" application.

## Project Structure

- `src/`
  - `components/`
    - `About.jsx`: Displays information about the founders.
    - `Chatbot.jsx`: Provides a chatbot interface for user assistance.
    - `Home.jsx`: The main component that renders the sidebar and main content.
    - `JobView.jsx`: Displays job listings.
    - `Login.jsx`: Handles user authentication.
    - `Resume.jsx`: Allows users to manage their resumes.
    - `Settings.jsx`: Provides application settings.
    - `Sidebar.jsx`: The main navigation component.
  - `App.jsx`: The root component that sets up routing.
  - `main.jsx`: The application entry point.

## Features

- **User Authentication:** Users can log in to the application.
- **Job Dashboard:** Users can view and manage job applications.
- **Resume Management:** Users can upload and manage their resumes.
- **Application Settings:** Users can configure their application preferences.
- **About Page:** Provides information about the company founders.
- **Chatbot:** An AI-powered assistant to help users.

## Design and Styling

- **Component Library:** The application uses `react-tabs` for the "About" page.
- **Styling:** CSS files are located alongside their respective components.

## Implemented Changes

### Integrating "About" Page

**Goal:** Move the "About" page into the main application layout, so it appears in the content area instead of on a separate page.

**Steps:**

1.  **Modified `src/components/Home.jsx`:**
    -   Imported the `About` component.
    -   Added a new `<Route>` for `/about` within the `<Routes>` component, rendering the `About` component.

2.  **Modified `src/App.jsx`:**
    -   Removed the standalone `<Route>` for `/about`.

3.  **Modified `src/components/Sidebar.jsx`:**
    -   Updated the `to` prop of the "About" link to `"/home/about"`.

### Keyword Search

**Goal:** Add a keyword feature below the search bar to store search terms.

**Steps:**

1.  **Modified `src/components/JobList.jsx`:**
    -   Added state to manage keywords (`keywords`) and search input (`searchInput`).
    -   Created a `handleSearchKeyDown` function to add a new keyword when the "Enter" key is pressed.
        -   The keyword must be 2 words or less.
        -   The maximum number of keywords is 10.
        -   Duplicate keywords are not allowed.
    -   Created a `removeKeyword` function to remove a keyword.
    -   Rendered the keywords below the search bar, with a remove button for each.
    -   Added basic styling for the keywords and remove button.
