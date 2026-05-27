import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
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
  ChevronDown,
  Activity,
  CheckCircle2,
  MessageCircle,
  Search,
  Quote,
  Sparkles,
  Pill,
  Brain,
  Bone,
  Baby,
  Heart,
  Droplet,
  Plus,
  Minus,
  GraduationCap,
  Languages,
  ArrowRight,
  ImageIcon,
} from 'lucide-react';

/* ============================================================
   STATIC DATA
   ============================================================ */

const CLINIC = {
  name: 'Essential Health Services',
  subtitle: "Doctor's Chamber",
  tagline: 'Your Health, Our Priority',
  pillars: ['Compassion', 'Expertise', 'Care'],
  phones: ['7003859618', '8949155457'],
  whatsapp: '917003859618', // E.164 without "+" for wa.me
  address:
    'Shop Room No. 8, Balaji Residency, Near Heritage Academy School, 3 Gopal Banerjee Lane, Howrah – 711101, West Bengal',
  hours: 'Mon–Sat, 10:00 AM – 8:00 PM',
  sundayNote: 'Sunday by appointment',
  mapSrc:
    'https://www.google.com/maps?q=Balaji+Residency+3+Gopal+Banerjee+Lane+Howrah+711101&output=embed',
  heroVideo:
    'https://videos.pexels.com/video-files/4488726/4488726-uhd_2560_1440_25fps.mp4',
  heroPoster:
    'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=1920&q=70&auto=format&fit=crop',
};

/* Days as 0=Sun … 6=Sat to match JS Date.getDay() */
const DAY = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

/*
  Each doctor has machine-readable `slots` so we can compute
  "available now" and "today's schedule" automatically.
  start/end are 24h hours. Use [start, end] inclusive-start, exclusive-end.
*/
const DOCTORS = [
  {
    id: 'sanjay-gupta',
    name: 'Dr. Sanjay Gupta',
    qualifications: 'MD',
    specialty: 'Diabetology, Obesity, Liver & Metabolic Care',
    reg: 'Reg. 54578',
    schedule: 'Sat · 7–8 PM',
    slots: [{ day: DAY.SAT, start: 19, end: 20 }],
    tag: 'Diabetology',
    icon: Droplet,
    bio: 'Specialist in diabetes and metabolic disorders with extensive experience managing obesity, fatty liver, and lifestyle-related conditions through evidence-based protocols.',
    languages: ['English', 'Hindi', 'Bengali'],
    education: ['MD — Internal Medicine'],
    photo:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'manish-kumar-gupta',
    name: 'Dr. Manish Kumar Gupta',
    qualifications: 'BSc, MBBS (RG Kar) · Ex-HMO Orthopedic',
    specialty: 'General Physician & Ortho Care',
    schedule: 'Sat · 7–8 PM',
    slots: [{ day: DAY.SAT, start: 19, end: 20 }],
    tag: 'Orthopedics',
    icon: Bone,
    bio: 'Orthopedic-trained general physician with hands-on hospital experience in joint, bone, and musculoskeletal care, alongside everyday primary medicine.',
    languages: ['English', 'Hindi', 'Bengali'],
    education: ['MBBS — R. G. Kar Medical College', 'BSc'],
    photo:
      'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'jayanti-bhattacharya',
    name: 'Dr. Jayanti Bhattacharya',
    qualifications: 'MBBS (Cal), MHC · Leeds University, UK',
    specialty: 'Clinical Psychiatry',
    reg: 'Reg. 50720 (WBMC)',
    schedule: 'Sat · 3–4 PM',
    slots: [{ day: DAY.SAT, start: 15, end: 16 }],
    tag: 'Psychiatry',
    icon: Brain,
    bio: 'UK-trained clinical psychiatrist offering confidential support for anxiety, depression, sleep disorders, and stress — with a calm, patient-led approach.',
    languages: ['English', 'Bengali'],
    education: [
      'MBBS — University of Calcutta',
      'MHC — Mental Health Care, Leeds University, UK',
    ],
    photo:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'ravi-tiwari',
    name: 'Dr. Ravi Tiwari',
    qualifications: 'MBBS',
    specialty: 'General Physician',
    reg: 'Reg. 89797',
    schedule: 'Mon–Sat',
    slots: [
      { day: DAY.MON, start: 10, end: 20 },
      { day: DAY.TUE, start: 10, end: 20 },
      { day: DAY.WED, start: 10, end: 20 },
      { day: DAY.THU, start: 10, end: 20 },
      { day: DAY.FRI, start: 10, end: 20 },
      { day: DAY.SAT, start: 10, end: 20 },
    ],
    tag: 'General Medicine',
    icon: Stethoscope,
    bio: 'Family doctor available six days a week for fevers, infections, hypertension, preventive checkups, and ongoing care of chronic conditions.',
    languages: ['English', 'Hindi', 'Bengali'],
    education: ['MBBS'],
    photo:
      'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'paramita-saha',
    name: 'Dr. Paramita Saha',
    qualifications: 'MBBS (Hons), MS, DNB, MRCOG (UK)',
    specialty: 'Obstetrics & Gynecology',
    schedule: 'Tue & Wed',
    slots: [
      { day: DAY.TUE, start: 10, end: 20 },
      { day: DAY.WED, start: 10, end: 20 },
    ],
    tag: 'Gynecology',
    icon: Baby,
    bio: 'Internationally qualified gynecologist and obstetrician — antenatal care, fertility consultation, women’s health screening, and minor procedures.',
    languages: ['English', 'Bengali'],
    education: [
      'MBBS (Hons)',
      'MS — Obstetrics & Gynecology',
      'DNB — New Delhi',
      'MRCOG — Royal College, UK',
    ],
    photo:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'gaurav-singh',
    name: 'Dr. Gaurav Singh',
    qualifications: 'MBBS (WBMC) · Ex-House Staff Cardiology',
    specialty: 'Cardiology / General Medicine',
    schedule: 'Mon–Fri',
    slots: [
      { day: DAY.MON, start: 10, end: 20 },
      { day: DAY.TUE, start: 10, end: 20 },
      { day: DAY.WED, start: 10, end: 20 },
      { day: DAY.THU, start: 10, end: 20 },
      { day: DAY.FRI, start: 10, end: 20 },
    ],
    tag: 'Cardiology',
    icon: Heart,
    bio: 'Cardiology-trained physician handling chest pain evaluation, blood pressure management, ECG interpretation, and long-term heart health.',
    languages: ['English', 'Hindi', 'Bengali'],
    education: ['MBBS — WBMC', 'Ex-House Staff, Cardiology'],
    photo:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 't-p-thal',
    name: 'Dr. T. P. Thal',
    qualifications: 'MBBS, DPH (AIIMS Delhi)',
    specialty: 'Skin Specialist',
    schedule: 'Sun',
    slots: [{ day: DAY.SUN, start: 10, end: 18 }],
    tag: 'Dermatology',
    icon: Sparkles,
    bio: 'Dermatologist with AIIMS training — acne, eczema, fungal infections, pigmentation, hair fall, and cosmetic skin concerns.',
    languages: ['English', 'Hindi'],
    education: ['MBBS', 'DPH — AIIMS Delhi'],
    photo:
      'https://images.unsplash.com/photo-1580281657527-47f249e8f4df?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'm-c-ray',
    name: 'Dr. M. C. Ray',
    qualifications: 'DMS (Cal)',
    specialty: 'General Medicine',
    reg: 'Reg. 8914',
    schedule: 'Daily',
    slots: [
      { day: DAY.SUN, start: 10, end: 20 },
      { day: DAY.MON, start: 10, end: 20 },
      { day: DAY.TUE, start: 10, end: 20 },
      { day: DAY.WED, start: 10, end: 20 },
      { day: DAY.THU, start: 10, end: 20 },
      { day: DAY.FRI, start: 10, end: 20 },
      { day: DAY.SAT, start: 10, end: 20 },
    ],
    tag: 'General Medicine',
    icon: Pill,
    bio: 'Senior general physician available every day for routine consultations, repeat prescriptions, and continuity of care for families.',
    languages: ['English', 'Bengali'],
    education: ['DMS — University of Calcutta'],
    photo:
      'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=800&q=80&auto=format&fit=crop',
  },
];

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'doctors', label: 'Doctors' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
];

const STATS = [
  { value: 8, suffix: '+', label: 'Specialist Doctors', icon: Users },
  { value: 15, suffix: '+', label: 'Years of Care', icon: Award },
  { value: 10000, suffix: '+', label: 'Patients Served', icon: HeartPulse },
  { value: 6, suffix: '', label: 'Days a Week', icon: Calendar },
];

const SERVICES = [
  {
    icon: Droplet,
    title: 'Diabetes & Metabolic Care',
    body: 'Blood sugar control, lifestyle counseling, obesity & fatty liver management.',
    color: 'from-emerald-500/10 to-emerald-500/0',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Heart,
    title: 'Cardiology',
    body: 'ECG, blood pressure management, chest pain evaluation, long-term heart health.',
    color: 'from-rose-500/10 to-rose-500/0',
    iconColor: 'text-rose-600',
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    body: 'Joint pain, bone injuries, back pain, post-injury physiotherapy guidance.',
    color: 'from-amber-500/10 to-amber-500/0',
    iconColor: 'text-amber-600',
  },
  {
    icon: Baby,
    title: 'Gynecology & Obstetrics',
    body: 'Antenatal care, women’s health screening, fertility consultation.',
    color: 'from-pink-500/10 to-pink-500/0',
    iconColor: 'text-pink-600',
  },
  {
    icon: Brain,
    title: 'Psychiatry & Mental Health',
    body: 'Anxiety, depression, sleep disorders, stress — confidential & non-judgmental.',
    color: 'from-violet-500/10 to-violet-500/0',
    iconColor: 'text-violet-600',
  },
  {
    icon: Sparkles,
    title: 'Dermatology',
    body: 'Acne, eczema, hair fall, fungal infections, pigmentation and skin care.',
    color: 'from-fuchsia-500/10 to-fuchsia-500/0',
    iconColor: 'text-fuchsia-600',
  },
  {
    icon: Stethoscope,
    title: 'General Medicine',
    body: 'Fevers, infections, hypertension, diabetes follow-up, preventive checkups.',
    color: 'from-sky-500/10 to-sky-500/0',
    iconColor: 'text-sky-600',
  },
  {
    icon: ShieldCheck,
    title: 'Preventive Care',
    body: 'Routine checkups, vaccination guidance, family health planning.',
    color: 'from-blue-500/10 to-blue-500/0',
    iconColor: 'text-navy',
  },
];

const TESTIMONIALS = [
  {
    name: 'Riya Sharma',
    role: 'Patient · Howrah',
    text: 'Dr. Saha was incredibly thorough during my antenatal visits. The clinic is clean, well-organized, and the staff is genuinely caring.',
    rating: 5,
  },
  {
    name: 'Anirban Das',
    role: 'Patient · Salkia',
    text: 'I’ve been bringing my parents here for years. Dr. Tiwari and Dr. Ray are patient, attentive, and never rush appointments.',
    rating: 5,
  },
  {
    name: 'Sunita Mehra',
    role: 'Patient · Bally',
    text: 'Booked a same-week appointment with the cardiologist. Got a proper diagnosis and a treatment plan I could actually follow.',
    rating: 5,
  },
  {
    name: 'Rahul Banerjee',
    role: 'Patient · Howrah',
    text: 'The diabetes consultation with Dr. Gupta changed how I manage my condition. Practical advice, no jargon.',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'Do you accept walk-in patients?',
    a: 'Yes, walk-ins are welcome during consultation hours (Mon–Sat, 10 AM – 8 PM). For specific doctors who visit on fixed days/times, we strongly recommend booking ahead by phone or WhatsApp to avoid waiting.',
  },
  {
    q: 'How do I book an appointment?',
    a: 'Call us at 70038 59618 or 89491 55457, or tap the WhatsApp button on this page. Mention the doctor you want to see and your preferred time.',
  },
  {
    q: 'Is the clinic open on Sunday?',
    a: 'Sundays are by appointment only. Dr. T. P. Thal (skin) consults on Sundays. Please call ahead to confirm availability.',
  },
  {
    q: 'Do you offer home visits?',
    a: 'Home visits are not offered as a routine service. For urgent issues, please call us and we’ll guide you to the appropriate care option.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash, UPI (Google Pay / PhonePe / Paytm), and major debit/credit cards.',
  },
  {
    q: 'Is parking available nearby?',
    a: 'Yes, street parking is available on Gopal Banerjee Lane. The clinic is on the ground floor of Balaji Residency, easily accessible from the main road.',
  },
  {
    q: 'Do I need to bring previous medical records?',
    a: 'Yes, please bring any prior prescriptions, test reports, and a list of current medications — it helps the doctor make better decisions faster.',
  },
];

const GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80&auto=format&fit=crop',
    alt: 'Modern clinic reception area',
  },
  {
    url: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80&auto=format&fit=crop',
    alt: 'Doctor consulting a patient',
  },
  {
    url: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80&auto=format&fit=crop',
    alt: 'Clean consultation room with examination bed',
  },
  {
    url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80&auto=format&fit=crop',
    alt: 'Medical equipment and stethoscope on desk',
  },
  {
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80&auto=format&fit=crop',
    alt: 'Clinic waiting area with comfortable seating',
  },
  {
    url: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80&auto=format&fit=crop',
    alt: 'Pharmacy and medicine storage',
  },
];

const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ============================================================
   HELPERS
   ============================================================ */

const formatPhone = (p) => `${p.slice(0, 5)} ${p.slice(5)}`;
const formatStat = (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : n);

const isDoctorAvailable = (doctor, now = new Date()) => {
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  return doctor.slots.some(
    (s) => s.day === day && hour >= s.start && hour < s.end
  );
};

const getDoctorsAvailableToday = (doctors, now = new Date()) => {
  const day = now.getDay();
  return doctors.filter((d) => d.slots.some((s) => s.day === day));
};

const buildWhatsappLink = (text) =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(text)}`;

/* ============================================================
   SHARED HOOKS / COMPONENTS
   ============================================================ */

/* Reveal-on-scroll wrapper using IntersectionObserver — cheap, no lib. */
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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

/* Animated count-up; only starts when the element scrolls into view. */
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

/* Section header — keeps every section visually consistent. */
function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <Reveal className="text-center mb-14 max-w-2xl mx-auto">
      <p className="text-medgreen font-semibold text-sm tracking-[0.25em] uppercase">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-navy mt-3 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-slate-600 mt-4 text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

/* ============================================================
   FEATURE: Doctor Detail Modal
   ============================================================ */

function DoctorModal({ doctor, onClose }) {
  // Trap focus & close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!doctor) return null;

  const available = isDoctorAvailable(doctor);
  const waLink = buildWhatsappLink(
    `Hello, I'd like to book an appointment with ${doctor.name} (${doctor.tag}).`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
    >
      <div
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-slide-up">
        <button
          onClick={onClose}
          aria-label="Close doctor details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid sm:grid-cols-5 overflow-y-auto">
          {/* Photo column */}
          <div className="sm:col-span-2 relative bg-slate-100 aspect-[4/3] sm:aspect-auto sm:min-h-[420px]">
            <img
              src={doctor.photo}
              alt={`Portrait of ${doctor.name}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-white/0" />
            <div className="absolute bottom-4 left-4 right-4 sm:hidden text-white">
              <span className="inline-block bg-white/95 text-navy text-[11px] font-bold px-2.5 py-1 rounded-full">
                {doctor.tag}
              </span>
              <h3 className="font-bold text-2xl mt-2 drop-shadow-md">{doctor.name}</h3>
            </div>
          </div>

          {/* Detail column */}
          <div className="sm:col-span-3 p-6 sm:p-8">
            <div className="hidden sm:block">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block bg-medgreen/15 text-medgreen text-xs font-bold px-2.5 py-1 rounded-full">
                  {doctor.tag}
                </span>
                {available && (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    Available now
                  </span>
                )}
              </div>
              <h3
                id="doctor-modal-title"
                className="text-2xl font-bold text-navy"
              >
                {doctor.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{doctor.qualifications}</p>
            </div>

            <p className="text-slate-700 leading-relaxed mt-4">{doctor.bio}</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </div>
                <ul className="space-y-1 text-slate-700">
                  {doctor.education.map((e) => (
                    <li key={e} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-medgreen mt-1.5 flex-shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" /> Languages
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.languages.map((l) => (
                    <span
                      key={l}
                      className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Visiting Schedule
              </div>
              <div className="text-slate-800 font-medium">{doctor.schedule}</div>
              {doctor.reg && (
                <div className="text-[11px] text-slate-400 mt-2 font-mono">
                  {doctor.reg}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-medgreen hover:bg-emerald-600 text-white font-semibold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Book on WhatsApp
              </a>
              <a
                href={`tel:${CLINIC.phones[0]}`}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white border border-slate-300 hover:border-navy text-navy font-semibold px-5 py-3 rounded-xl transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Clinic
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURE: Floating WhatsApp Button
   ============================================================ */

function WhatsAppFAB() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 800);
    return () => clearTimeout(t);
  }, []);

  const link = buildWhatsappLink(
    'Hello, I would like to book an appointment at Essential Health Services.'
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 group flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white pl-3 pr-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } duration-500`}
    >
      <span className="relative flex w-9 h-9 rounded-full bg-white/15 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" aria-hidden="true" />
        <MessageCircle className="w-5 h-5 relative" />
      </span>
      <span className="font-semibold text-sm hidden sm:block pr-1">
        Chat with us
      </span>
    </a>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function Clinic() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'today' | tag
  const [activeDoctor, setActiveDoctor] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const now = useMemo(() => new Date(), []);
  const todayLabel = DAY_LABELS[now.getDay()];

  /* Sticky-header shadow swap on scroll. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu when crossing the md breakpoint. */
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

  /* Unique specialty tags for the filter row. */
  const tags = useMemo(() => {
    const set = new Set(DOCTORS.map((d) => d.tag));
    return ['all', 'today', ...set];
  }, []);

  /* Filter + search applied to doctor list. */
  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DOCTORS.filter((d) => {
      if (filter === 'today') {
        if (!d.slots.some((s) => s.day === now.getDay())) return false;
      } else if (filter !== 'all' && d.tag !== filter) {
        return false;
      }
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.tag.toLowerCase().includes(q)
      );
    });
  }, [query, filter, now]);

  const doctorsToday = useMemo(
    () => getDoctorsAvailableToday(DOCTORS, now),
    [now]
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-medgreen/30">
      {/* ============== HEADER ============== */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
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
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy to-[#2c5fc4] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
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

          <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
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
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-300 text-slate-700"
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
            className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur"
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
            <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-[#1a3a8f]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(44,168,79,0.25),transparent_55%)]" />
            <div className="absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-medgreen/20 blur-3xl animate-blob" aria-hidden="true" />
            <div className="absolute -bottom-40 -left-24 w-[32rem] h-[32rem] rounded-full bg-white/10 blur-3xl animate-blob-delayed" aria-hidden="true" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid md:grid-cols-12 gap-10 items-center w-full">
            <Reveal className="md:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-medium backdrop-blur mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-medgreen opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-medgreen" />
                </span>
                Open today · {doctorsToday.length} doctor{doctorsToday.length === 1 ? '' : 's'} consulting
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
                  href={buildWhatsappLink('Hello, I would like to book an appointment.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 bg-medgreen hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-medgreen/30 hover:shadow-xl hover:shadow-medgreen/40 transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  Book on WhatsApp
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
                      <div className="font-semibold text-lg">Today, {todayLabel}</div>
                      <div className="text-xs text-white/70">
                        {doctorsToday.length} specialist{doctorsToday.length === 1 ? '' : 's'} consulting
                      </div>
                    </div>
                  </div>

                  {doctorsToday.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {doctorsToday.slice(0, 4).map((d) => (
                        <li
                          key={d.id}
                          className="flex items-center justify-between gap-2 bg-white/5 rounded-lg px-3 py-2"
                        >
                          <span className="truncate">{d.name}</span>
                          <span className="text-[11px] text-white/70 flex-shrink-0">
                            {d.tag}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-white/75">
                      Sunday is by appointment. Please call to schedule.
                    </p>
                  )}

                  <div className="mt-5 pt-5 border-t border-white/15 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-medgreen" />
                    <span className="text-xs text-white/80">
                      Live availability shown in real time
                    </span>
                  </div>
                </div>
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

          <div className="absolute bottom-0 left-0 right-0 leading-[0]" aria-hidden="true">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 sm:h-16">
              <path d="M0,32 C320,80 720,0 1440,48 L1440,80 L0,80 Z" fill="#ffffff" />
            </svg>
          </div>
        </section>

        {/* ============== STATS ============== */}
        <section aria-label="Clinic at a glance" className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" role="list">
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

        {/* ============== SERVICES ============== */}
        <section id="services" className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="What We Treat"
              title="Comprehensive Care Across Specialties"
              subtitle="From everyday illnesses to chronic condition management — find the right specialist under one roof."
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Reveal
                    as="li"
                    delay={(i % 4) * 70}
                    key={s.title}
                    className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity`}
                      aria-hidden="true"
                    />
                    <div className="relative">
                      <div className={`inline-flex w-12 h-12 rounded-xl bg-white border border-slate-200 ${s.iconColor} items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-bold text-navy text-lg leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {s.body}
                      </p>
                      <a
                        href="#doctors"
                        onClick={(e) => handleNav(e, 'doctors')}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-medgreen transition-colors"
                      >
                        See specialists
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ============== DOCTORS ============== */}
        <section id="doctors" className="py-20 sm:py-24 bg-white relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-20 right-0 w-72 h-72 rounded-full bg-medgreen/5 blur-3xl" />
          <div aria-hidden="true" className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-navy/5 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Our Specialists"
              title="Meet Our Doctors"
              subtitle="Experienced consultants across diabetology, orthopedics, psychiatry, gynecology, cardiology, dermatology and general medicine."
            />

            {/* Search + filter row */}
            <Reveal className="mb-8 flex flex-col gap-3">
              <div className="relative max-w-md mx-auto w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, specialty…"
                  aria-label="Search doctors"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-medgreen/30 focus:border-medgreen transition-all shadow-sm"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {tags.map((t) => {
                  const active = filter === t;
                  const label =
                    t === 'all' ? 'All specialists' :
                    t === 'today' ? `Available today (${doctorsToday.length})` :
                    t;
                  return (
                    <button
                      key={t}
                      onClick={() => setFilter(t)}
                      className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                        active
                          ? 'bg-navy text-white border-navy shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-navy hover:text-navy'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {filteredDoctors.length === 0 ? (
              <Reveal className="text-center py-16">
                <p className="text-slate-500">No doctors match your search.</p>
                <button
                  onClick={() => { setQuery(''); setFilter('all'); }}
                  className="mt-3 text-sm font-semibold text-medgreen hover:underline"
                >
                  Clear filters
                </button>
              </Reveal>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                {filteredDoctors.map((d, i) => {
                  const available = isDoctorAvailable(d, now);
                  return (
                    <Reveal
                      as="li"
                      delay={(i % 4) * 70}
                      key={d.id}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDoctor(d)}
                        className="group block w-full text-left bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-slate-200/70 overflow-hidden transition-all duration-500 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-medgreen/40"
                        aria-label={`View details for ${d.name}`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                          <img
                            src={d.photo}
                            alt={`Portrait of ${d.name}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/75 via-navy/10 to-transparent" />
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-navy text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {d.tag}
                          </span>
                          {available && (
                            <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                              </span>
                              LIVE
                            </span>
                          )}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <h3 className="font-bold text-lg leading-tight drop-shadow-md">
                              {d.name}
                            </h3>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col">
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                            {d.qualifications}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 mt-2 line-clamp-2">
                            {d.specialty}
                          </p>
                          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-sm min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-medgreen/10 text-medgreen flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                                  Visiting
                                </div>
                                <div className="text-slate-800 font-medium text-sm truncate">
                                  {d.schedule}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-medgreen group-hover:translate-x-1 transition-all flex-shrink-0" />
                          </div>
                        </div>
                      </button>
                    </Reveal>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        {/* ============== HOURS & WHY ============== */}
        <section id="hours" className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6 lg:gap-8">
            <Reveal>
              <article className="relative overflow-hidden bg-gradient-to-br from-navy via-[#234aae] to-[#2c5fc4] text-white rounded-3xl p-8 sm:p-10 shadow-xl h-full">
                <div aria-hidden="true" className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-medgreen/20 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Consultation Hours</h2>
                  </div>
                  <p className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    10:00 AM – 8:00 PM
                  </p>
                  <p className="text-white/85 mt-2 text-lg">Monday – Saturday</p>
                  <div className="mt-7 pt-7 border-t border-white/15 flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-medgreen mt-0.5 flex-shrink-0" />
                    <p className="text-white/90">
                      <span className="font-semibold">Sunday:</span> {CLINIC.sundayNote}.
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>

            <Reveal delay={120}>
              <article className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-medgreen/15 text-medgreen flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-navy">Why Choose Us</h2>
                </div>
                <ul className="space-y-5 text-slate-700">
                  {[
                    { title: 'Compassion', body: 'Patient-first care at every visit, with time taken to listen.' },
                    { title: 'Expertise', body: 'Qualified specialists across multiple disciplines under one roof.' },
                    { title: 'Care', body: 'Convenient hours and a trusted single chamber for the whole family.' },
                  ].map((p) => (
                    <li key={p.title} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-lg bg-medgreen/10 border border-medgreen/20 text-medgreen flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-navy">{p.title}</div>
                        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{p.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </div>
        </section>

        {/* ============== TESTIMONIALS ============== */}
        <section aria-label="Patient testimonials" className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Patient Voices"
              title="What Our Patients Say"
              subtitle="Real feedback from families who trust us with their care."
            />
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
              {TESTIMONIALS.map((t, i) => (
                <Reveal
                  as="li"
                  delay={(i % 4) * 80}
                  key={t.name}
                  className="relative bg-gradient-to-br from-slate-50 to-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <Quote className="absolute top-4 right-4 w-8 h-8 text-medgreen/20" aria-hidden="true" />
                  <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">"{t.text}"</p>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="font-bold text-navy text-sm">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== GALLERY ============== */}
        <section id="gallery" className="py-20 sm:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Inside Our Clinic"
              title="A Clean, Welcoming Space"
              subtitle="Modern, hygienic, and designed for patient comfort."
            />
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4" role="list">
              {GALLERY.map((g, i) => (
                <Reveal
                  as="li"
                  delay={(i % 3) * 80}
                  key={g.url}
                  className={`relative overflow-hidden rounded-2xl bg-slate-200 group ${
                    i === 0 ? 'col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' : 'aspect-square'
                  }`}
                >
                  <img
                    src={g.url}
                    alt={g.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span className="truncate">{g.alt}</span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ============== FAQ ============== */}
        <section id="faq" className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Frequently Asked"
              title="Common Questions"
              subtitle="Quick answers to what patients ask before their first visit."
            />
            <Reveal>
              <ul className="space-y-3" role="list">
                {FAQS.map((f, i) => {
                  const open = openFaq === i;
                  return (
                    <li
                      key={f.q}
                      className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                        open ? 'border-medgreen/40 shadow-md' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? -1 : i)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left"
                        aria-expanded={open}
                        aria-controls={`faq-${i}`}
                      >
                        <span className="font-semibold text-navy text-sm sm:text-base">
                          {f.q}
                        </span>
                        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          open ? 'bg-medgreen text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </span>
                      </button>
                      <div
                        id={`faq-${i}`}
                        className={`grid transition-all duration-300 ease-out ${
                          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ============== CONTACT ============== */}
        <section id="contact" className="py-20 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <SectionHeader
              eyebrow="Get In Touch"
              title="Contact & Location"
              subtitle="Call, message, or visit us at the chamber."
            />

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

                <Reveal delay={60}>
                  <a
                    href={buildWhatsappLink('Hello, I would like to book an appointment.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-[#25D366] hover:bg-[#1ebe5b] text-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-lg">WhatsApp</h3>
                    </div>
                    <p className="text-sm text-white/90 mt-1">
                      Tap to chat with us and book instantly.
                    </p>
                  </a>
                </Reveal>

                <Reveal delay={120}>
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

                <Reveal delay={180}>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-medgreen/15 text-medgreen flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy text-lg">Hours</h3>
                    </div>
                    <p className="text-slate-700 text-sm">{CLINIC.hours}</p>
                    <p className="text-slate-500 text-sm mt-1">{CLINIC.sundayNote}</p>
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
        <div aria-hidden="true" className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-medgreen/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold">{CLINIC.name}</div>
                <div className="text-xs text-white/60">{CLINIC.subtitle}</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-md">
              {CLINIC.tagline}. {CLINIC.pillars.join(' · ')}. A multi-specialty
              chamber serving Howrah with compassion, expertise, and care since
              years.
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
                  <a href={`tel:${p}`} className="text-white/85 hover:text-medgreen transition-colors">
                    {formatPhone(p)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={buildWhatsappLink('Hello, I would like to book an appointment.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-white/85 hover:text-medgreen transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-medgreen" />
                  WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-white/85">
                <MapPin className="w-4 h-4 text-medgreen mt-0.5" />
                <span>Howrah – 711101, West Bengal</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
            <div>&copy; {year} {CLINIC.name}. All rights reserved.</div>
            <div className="flex items-center gap-1.5">
              Crafted with
              <HeartPulse className="w-3.5 h-3.5 text-medgreen" />
              for better healthcare
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <WhatsAppFAB />

      {/* Doctor detail modal */}
      {activeDoctor && (
        <DoctorModal doctor={activeDoctor} onClose={() => setActiveDoctor(null)} />
      )}
    </div>
  );
}
