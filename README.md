# WebbWizards Todo App

![CI](https://github.com/Grahnnen/WebbWizards/actions/workflows/ci.yml/badge.svg)
![codecov](https://codecov.io/gh/Grahnnen/WebbWizards/branch/main/graph/badge.svg)

A structured Todo application built with vanilla JavaScript.

This project focuses on clean architecture, accessibility, performance, and automated testing without using frontend frameworks.

---

## Project Description

WebbWizards Todo App is a modular and testable Todo application designed to demonstrate:

- Clear separation between UI, state management, and business logic  
- DOM-driven architecture without frameworks  
- Persistent data using `localStorage`  
- Accessibility best practices  
- Automated unit and accessibility testing  
- Performance optimization using Lighthouse  

The project simulates a professional frontend workflow using modern tooling while remaining framework-free.

---

## Live Demo

Deployed with GitHub Pages:

https://Grahnnen.github.io/WebbWizards/

---

## Installation & Running Locally

Clone the repository:

```bash
git clone https://github.com/Grahnnen/WebbWizards.git
cd WebbWizards
```

Install dependencies:

```
npm install
```

Run locally:

```
npm run dev
```

If no dev script exists, use a local development server (e.g., Live Server) to avoid ES module loading issues.

---

## Testing

This project uses:

Jest

@testing-library/dom

jest-axe

Run all tests:

```
npm test
```

Run tests with coverage:

```
npm run test -- --coverage
```

---

## Lighthouse Scores

Lighthouse audits were performed to evaluate:

Performance

Accessibility

Best Practices

SEO

### Desktop Results

<img width="492" height="133" alt="image" src="https://github.com/user-attachments/assets/ed681afb-cae4-42b6-a1c9-e24911cfd8ba" />

### Mobile Results

<img width="444" height="135" alt="image" src="https://github.com/user-attachments/assets/ca056b73-0581-47bd-a708-873000e83da5" />

## Members

Team Members & Roles
- Robin Grahn	
- Lukas Karlsson
- Lisa Ebbhagen
- Liza Hjortling
- Rolf Andersson

## Accessibility Reflection

Accessibility was treated as a core requirement rather than an afterthought.

Implemented practices:

- Semantic HTML landmarks
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management within modal
- Automated accessibility testing with jest-axe

Key insight:
Accessibility requires both automated tools and manual review to ensure proper user experience.

## Performance Reflection

Performance optimizations included:

- Avoiding unnecessary DOM re-renders

- Keeping bundle size minimal (no frameworks)

- Efficient filtering and sorting logic

- Lighthouse-driven refinements

The result is a lightweight, fast-loading application with high audit scores.

# Project Summary 

WebWizard was developed using Scrum over three sprints (Weeks 6–8) with rotating Product Owner and Scrum Master roles. The project progressed from core CRUD functionality to a fully optimized, testable, and installable web application.

During Sprint 1, the team implemented core features such as creating, editing, deleting, and completing todos, along with a mobile-first responsive layout and semantic HTML.

Sprint 2 focused on extended functionality, including due dates, filtering, star-marking, keyboard navigation, ARIA improvements, unit testing, and CI/CD integration.

Sprint 3 completed DOM and accessibility testing, implemented a Service Worker with offline support, added a Web App Manifest, and optimized Lighthouse scores.

Despite minor challenges such as illness and scheduling conflicts, all final sprint goals were achieved. The result is a performant, accessible, and well-tested application developed using a structured agile workflow.
