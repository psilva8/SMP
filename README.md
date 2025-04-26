# SMP Directory - Los Angeles Scalp Micropigmentation

A directory website for finding top-rated Scalp Micropigmentation (SMP) clinics in Los Angeles. The site helps users discover SMP providers by area throughout Los Angeles County.

## Features

- Browse SMP clinics by LA neighborhoods and areas
- View detailed information about each clinic including ratings and contact details
- Clean, modern UI built with HTML, CSS (Tailwind), and JavaScript
- Mobile-responsive design
- SEO-optimized pages for each area

## Project Structure

- `index.html` - Main homepage
- `areas.html` - Directory of all areas covered
- `about.html` - Information about SMP treatments
- `areas/` - Area-specific pages (dynamically generated)
- `scripts.js` - Core JavaScript functionality
- `generate-area-pages.js` - Node.js script to generate area pages

## Getting Started

1. Clone the repository
2. Run a local server (e.g., `python -m http.server 8000`)
3. Open `http://localhost:8000` in your browser

## Area Pages

The site uses a clean URL structure for area pages (e.g., `/areas/beverly-hills/`). These pages are generated using the Node.js script `generate-area-pages.js`.

To generate new area pages:

```bash
node generate-area-pages.js
```

## Data Source

Clinic data is stored in a JSON file and dynamically loaded on the client side.

## License

MIT License 