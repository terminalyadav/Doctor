import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Calendar,
  Menu,
  X,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Award,
  Users,
  Star,
  ChevronRight,
  Activity,
  CheckCircle2,
} from 'lucide-react';

// Static clinic data — kept outside component so render doesn't re-allocate.
const CLINIC = {
  name: 'Essential Health Services',
  subtitle: "Doctor's Chamber",
  tagline: 'Your Health, Our Priority',
  pillars: ['Compassion', 'Expertise', 'Care'],
  phones: ['7003859618', '8949155457'],
  address:
    'Shop Room No. 8, Balaji Residency, Near Heritage Academy School, 3 Gopal Banerjee Lane, Howrah – 711101, West Bengal',
  hours: 'Mon–Sat, 10:00 AM – 8:00 PM',
  sundayNote: 'Sunday by appointment',
  mapSrc:
    'https://www.google.com/maps?q=Balaji+Residency+3+Gopal+Banerjee+Lane+Howrah+711101&output=embed',
  // Free, royalty-free medical b-roll from Coverr (CDN-hosted MP4). Muted, looping, decorative.
  heroVideo: 'https://videos.pexels.com/video-files/4488726/4488726-uhd_2560_1440_25fps.mp4',
  heroPoster:
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=70&auto=format&fit=crop',
};

// Unsplash neutral professional headshots. Each `photo` can be swapped for a real portrait URL later.
const DOCTORS = [
  {
    name: 'Dr. Sanjay Gupta',
    qualifications: 'MD',
    specialty: 'Diabetology, Obesity, Liver & Metabolic Care',
    reg: 'Reg. 54578',
    schedule: 'Sat · 7–8 PM',
    tag: 'Diabetology',
    photo:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. Manish Kumar Gupta',
    qualifications: 'BSc, MBBS (RG Kar) · Ex-HMO Orthopedic',
    specialty: 'General Physician & Ortho Care',
    schedule: 'Sat · 7–8 PM',
    tag: 'Orthopedics',
    photo:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. Jayanti Bhattacharya',
    qualifications: 'MBBS (Cal), MHC · Leeds University, UK',
    specialty: 'Clinical Psychiatry',
    reg: 'Reg. 50720 (WBMC)',
    schedule: 'Sat · 3–4 PM',
    tag: 'Psychiatry',
    photo:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. Ravi Tiwari',
    qualifications: 'MBBS',
    specialty: 'General Physician',
    reg: 'Reg. 89797',
    schedule: 'Mon–Sat',
    tag: 'General Medicine',
    photo:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. Paramita Saha',
    qualifications: 'MBBS (Hons), MS, DNB, MRCOG (UK)',
    specialty: 'Obstetrics & Gynecology',
    schedule: 'Tue & Wed',
    tag: 'Gynecology',
    photo:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. Gaurav Singh',
    qualifications: 'MBBS (WBMC) · Ex-House Staff Cardiology',
    specialty: 'Cardiology / General Medicine',
    schedule: 'Mon–Fri',
    tag: 'Cardiology',
    photo:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. T. P. Thal',
    qualifications: 'MBBS, DPH (AIIMS Delhi)',
    specialty: 'Skin Specialist',
    schedule: 'Sun',
    tag: 'Dermatology',
    photo:
      'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=600&q=75&auto=format&fit=crop',
  },
  {
    name: 'Dr. M. C. Ray',
    qualifications: 'DMS (Cal)',
    specialty: 'General Medicine',
    reg: 'Reg. 8914',
    schedule: 'Daily',
    tag: 'General Medicine',
    photo:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=600&q=75&auto=format&fit=crop',
  },
];

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'hours', label: 'Hours' },
  { id: 'contact', label: 'Contact' },
];

const STATS = [
  { value: 8, suffix: '+', label: 'Specialist Doctors', icon: Users },
  { value: 15, suffix: '+', label: 'Years of Care', icon: Award },
  { value: 10000, suffix: '+', label: 'Patients Served', icon: HeartPulse },
  { value: 6, suffix: '', label: 'Days a Week', icon: Calendar },
];

const formatPhone = (p) => `${p.slice(0, 5)} ${p.slice(5)}`;
const formatStat = (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : n);

// Reveal-on-scroll wrapper using IntersectionObserver — cheap, no lib.
function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

// Animated count-up; only starts when the element scrolls into view.
function Counter({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          // easeOutCubic
          const eased = 1 - Math.pow(1 - t, 3);
          setVal(Math.round(to * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {formatStat(val)}
      {suffix}
    </span>
  );
}

export default function Clinic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll to swap header style.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNav = useCallback((e, id) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-medgreen/30">
      {/* ============== HEADER ============== */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm'
            : 'bg-white/70 backdrop-blur border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(e) => handleNav(e, 'home')}
            className="flex items-center gap-3 group"
            aria-label={`${CLINIC.name} home`}
          >
            <div className="relative">
              <div
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy to-[#2c5fc4] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform"
                aria-hidden="true"
              >
                <HeartPulse className="w-6 h-6 text-white" strokeWidth={2.25} />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-medgreen ring-2 ring-white animate-pulse"
                aria-hidden="true"
              />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-navy text-sm sm:text-base tracking-tight">
                {CLINIC.name}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 hidden xs:block">
                {CLINIC.subtitle}
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => handleNav(e, n.id)}
                className="text-sm font-medium text-slate-700 hover:text-navy transition-colors relative after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0 after:bg-medgreen after:transition-all after:duration-300 hover:after:w-full"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${CLINIC.phones[0]}`}
              className="hidden sm:inline-flex items-center gap-2 bg-medgreen hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              aria-label="Call clinic now"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
            <a
              href={`tel:${CLINIC.phones[0]}`}
              className="sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg bg-medgreen text-white shadow-sm"
              aria-label="Call clinic now"
            >
              <Phone className="w-5 h-5" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 text-slate-700"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur"
            aria-label="Mobile primary"
          >
            <ul className="px-4 py-2">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => handleNav(e, n.id)}
                    className="flex items-center justify-between py-3 text-slate-700 font-medium border-b border-slate-100 last:border-0"
                  >
                    <span>{n.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main>
        {/* ============== HERO ============== */}
        <section
          id="home"
          className="relative overflow-hidden text-white isolate min-h-[88vh] flex items-center"
        >
          {/* Background video layer */}
          <div className="absolute inset-0 -z-10">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={CLINIC.heroPoster}
              aria-hidden="true"
            >
              <source src={CLINIC.heroVideo} type="video/mp4" />
            </video>
            {/* Color overlay: brand-tinted, ensures text contrast */}
            <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-[#1a3a8f]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(44,168,79,0.25),transparent_55%)]" />
            {/* Subtle moving mesh */}
            <div
              aria-hidden="true"
              className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-medgreen/20 blur-3xl animate-blob"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-40 -left-24 w-[32rem] h-[32rem] rounded-full bg-white/10 blur-3xl animate-blob-delayed"
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid md:grid-cols-12 gap-10 items-center w-full">
            <Reveal className="md:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-medgreen opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-medgreen" />
                </span>
                Now consulting · Howrah, West Bengal
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                {CLINIC.name}
                <span className="block bg-gradient-to-r from-white via-emerald-200 to-medgreen bg-clip-text text-transparent mt-2">
                  {CLINIC.tagline}
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed">
                A trusted multi-specialty chamber bringing together 8 experienced
                consultants — from cardiology to gynecology — under one roof.
              </p>
              <p className="mt-3 text-sm text-white/65 tracking-wide">
                {CLINIC.pillars.join(' · ')}
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <a
                  href="#contact"
                  onClick={(e) => handleNav(e, 'contact')}
                  className="group inline-flex items-center justify-center gap-2 bg-medgreen hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-medgreen/30 hover:shadow-xl hover:shadow-medgreen/40 transition-all hover:-translate-y-0.5"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href={`tel:${CLINIC.phones[0]}`}
                  className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-navy font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5"
                  aria-label={`Call ${formatPhone(CLINIC.phones[0])}`}
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medgreen" />
                  Qualified specialists
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medgreen" />
                  Mon – Sat, 10 AM – 8 PM
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medgreen" />
                  Walk-in & appointment
                </div>
              </div>
            </Reveal>

            <Reveal delay={150} className="md:col-span-5">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                {/* Floating info card */}
                <div className="relative bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
                  <div className="absolute -top-3 -right-3 bg-medgreen text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Trusted Care
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white text-navy flex items-center justify-center shadow-md">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">8 Specialists</div>
                      <div className="text-xs text-white/70">
                        Under one roof
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3.5 text-sm">
                    <li className="flex items-start gap-3">
                      <Clock className="w-4 h-4 mt-0.5 text-medgreen flex-shrink-0" />
                      <span>{CLINIC.hours}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 mt-0.5 text-medgreen flex-shrink-0" />
                      <span>{CLINIC.sundayNote}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-medgreen flex-shrink-0" />
                      <span>Howrah – 711101, West Bengal</span>
                    </li>
                  </ul>
                  <div className="mt-5 pt-5 border-t border-white/15 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-medgreen" />
                    <span className="text-xs text-white/80">
                      Live consultations today
                    </span>
                  </div>
                </div>
                {/* Decorative floating pill */}
                <div className="absolute -bottom-5 -left-4 bg-white text-navy rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float">
                  <div className="w-9 h-9 rounded-lg bg-medgreen/15 text-medgreen flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[11px] text-slate-500 font-medium">
                      Quality
                    </div>
                    <div className="text-sm font-bold">Certified Care</div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Wave divider */}
          <div
            className="absolute bottom-0 left-0 right-0 leading-[0]"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 80"
              preserveAspectRatio="none"
              className="w-full h-12 sm:h-16"
            >
              <path
                d="M0,32 C320,80 720,0 1440,48 L1440,80 L0,80 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>

        {/* ============== STATS ============== */}
        <section
          aria-label="Clinic at a glance"
          className="bg-white py-12 sm:py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ul
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
              role="list"
            >
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal
                    as="li"
                    delay={i * 80}
                    key={s.label}
                    className="bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 text-center hover:shadow-lg hover:-translate-y-0.5 transition-all"
                  >
                    <div className="inline-flex w-12 h-12 rounded-xl bg-navy/5 text-navy items-center justify-center mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-navy tracking-tight">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                      {s.label}
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ============== DOCTORS ============== */}
        <section
          id="doctors"
          className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
        >
          <div
            aria-hidden="true"
            className="absolute top-20 right-0 w-72 h-72 rounded-full bg-medgreen/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-navy/5 blur-3xl"
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-medgreen font-semibold text-sm tracking-[0.2em] uppercase">
                Our Specialists
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mt-3 tracking-tight">
                Meet Our Doctors
              </h2>
              <p className="text-slate-600 mt-4 text-lg leading-relaxed">
                Experienced consultants across diabetology, orthopedics, psychiatry,
                gynecology, cardiology, dermatology and general medicine.
              </p>
            </Reveal>

            <ul
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              role="list"
            >
              {DOCTORS.map((d, i) => (
                <Reveal
                  as="li"
                  delay={(i % 4) * 80}
                  key={d.name}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-slate-200/70 overflow-hidden transition-all duration-500 hover:-translate-y-1 flex flex-col"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={d.photo}
                      alt={`Portrait of ${d.name}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-navy text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {d.tag}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                        {d.name}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {d.qualifications}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 mt-2">
                      {d.specialty}
                    </p>
                    {d.reg && (
                      <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                        {d.reg}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2 text-sm">
                      <div className="w-7 h-7 rounded-lg bg-medgreen/10 text-medgreen flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          Visiting
                        </div>
                        <div className="text-slate-800 font-medium text-sm">
                          {d.schedule}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== HOURS & INFO ============== */}
        <section id="hours" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal>
              <article className="relative overflow-hidden bg-gradient-to-br from-navy via-[#234aae] to-[#2c5fc4] text-white rounded-3xl p-8 sm:p-10 shadow-xl h-full">
                <div
                  aria-hidden="true"
                  className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-medgreen/20 blur-3xl"
                />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      Consultation Hours
                    </h2>
                  </div>
                  <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    10:00 AM – 8:00 PM
                  </p>
                  <p className="text-white/85 mt-2 text-lg">Monday – Saturday</p>
                  <div className="mt-7 pt-7 border-t border-white/15 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-medgreen mt-0.5 flex-shrink-0" />
                    <p className="text-white/90">
                      <span className="font-semibold">Sunday:</span>{' '}
                      {CLINIC.sundayNote}.
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal delay={120}>
              <article className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-medgreen/15 text-medgreen flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-navy">
                    Why Choose Us
                  </h2>
                </div>
                <ul className="space-y-5 text-slate-700">
                  {[
                    {
                      title: 'Compassion',
                      body: 'Patient-first care at every visit, with time taken to listen.',
                    },
                    {
                      title: 'Expertise',
                      body: 'Qualified specialists across multiple disciplines under one roof.',
                    },
                    {
                      title: 'Care',
                      body: 'Convenient hours and a trusted single chamber for the whole family.',
                    },
                  ].map((p) => (
                    <li key={p.title} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 text-medgreen flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-navy">{p.title}</div>
                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                          {p.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </section>

        {/* ============== CONTACT ============== */}
        <section
          id="contact"
          className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-medgreen font-semibold text-sm tracking-[0.2em] uppercase">
                Get In Touch
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mt-3 tracking-tight">
                Contact &amp; Location
              </h2>
              <p className="text-slate-600 mt-4 text-lg">
                Call to book an appointment or visit us at the chamber.
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Reveal>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-medgreen/15 text-medgreen flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy text-lg">Phone</h3>
                    </div>
                    <ul className="space-y-2">
                      {CLINIC.phones.map((p) => (
                        <li key={p}>
                          <a
                            href={`tel:${p}`}
                            className="text-xl font-semibold text-slate-800 hover:text-medgreen transition-colors inline-flex items-center gap-2 group"
                            aria-label={`Call ${formatPhone(p)}`}
                          >
                            {formatPhone(p)}
                            <ChevronRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy text-lg">Address</h3>
                    </div>
                    <address className="not-italic text-slate-700 leading-relaxed text-sm">
                      {CLINIC.address}
                    </address>
                  </div>
                </Reveal>

                <Reveal delay={160}>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-medgreen/15 text-medgreen flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy text-lg">Hours</h3>
                    </div>
                    <p className="text-slate-700 text-sm">{CLINIC.hours}</p>
                    <p className="text-slate-500 text-sm mt-1">
                      {CLINIC.sundayNote}
                    </p>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={120} className="lg:col-span-3">
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full min-h-[420px]">
                  <iframe
                    title={`Map showing ${CLINIC.name} location in Howrah`}
                    src={CLINIC.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '420px' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ============== FOOTER ============== */}
      <footer className="relative bg-navy text-white overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-medgreen/10 blur-3xl"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">{CLINIC.name}</div>
                <div className="text-xs text-white/60">{CLINIC.subtitle}</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              {CLINIC.tagline}. {CLINIC.pillars.join(' · ')}.
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => handleNav(e, n.id)}
                    className="text-white/75 hover:text-medgreen transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3 h-3 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90 mb-4">
              Reach Us
            </h3>
            <ul className="space-y-2.5 text-sm">
              {CLINIC.phones.map((p) => (
                <li key={p} className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-medgreen" />
                  <a
                    href={`tel:${p}`}
                    className="text-white/85 hover:text-medgreen transition-colors"
                  >
                    {formatPhone(p)}
                  </a>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-white/85">
                <MapPin className="w-4 h-4 text-medgreen mt-0.5" />
                <span>Howrah – 711101, West Bengal</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
            <div>
              &copy; {year} {CLINIC.name}. All rights reserved.
            </div>
            <div className="flex items-center gap-1.5">
              Crafted with
              <HeartPulse className="w-3.5 h-3.5 text-medgreen" />
              for better healthcare
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
