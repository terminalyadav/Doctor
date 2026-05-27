# Essential Health Services — Doctor's Chamber

Fast, lightweight single-page site for a multi-doctor clinic in Howrah.

## Stack
- React 18 (functional components + hooks)
- Tailwind CSS
- lucide-react (icons only)
- Vite

## Run

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Customize
- Logo: replace the `HeartPulse` icon inside the header in [src/Clinic.jsx](src/Clinic.jsx) with an `<img>` of your logo.
- Google Map: swap `CLINIC.mapSrc` in [src/Clinic.jsx](src/Clinic.jsx) with the precise embed URL from Google Maps → Share → Embed a map.
- Doctor data: edit the `DOCTORS` array in [src/Clinic.jsx](src/Clinic.jsx).
