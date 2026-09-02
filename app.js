/* =====================================================================
   30 Day Beginner Workout — app.js
   No frameworks, no build step. Hash-based routing between three views:
     #/            home
     #/program     grid of 30 days
     #/day/N       detail for day N
   Progress is stored in localStorage under STORAGE_KEY.
===================================================================== */

const STORAGE_KEY = 'beginnerWorkout30.completedDays';

/* ---------------------------------------------------------------------
   Icons — simple, consistent line-art figures (viewBox 0 0 100 100).
   Stroke color/width/caps are controlled centrally via CSS.
--------------------------------------------------------------------- */
const ICONS = {
  march: `<circle cx="50" cy="17" r="8"/><line x1="49" y1="25" x2="46" y2="55"/>
    <line x1="47" y1="32" x2="29" y2="27"/><line x1="47" y1="32" x2="63" y2="45"/>
    <line x1="46" y1="55" x2="33" y2="62"/><line x1="33" y1="62" x2="39" y2="82"/>
    <line x1="46" y1="55" x2="58" y2="86"/>`,

  arm_circle: `<circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="62"/>
    <line x1="50" y1="34" x2="18" y2="28"/><line x1="50" y1="34" x2="82" y2="28"/>
    <path d="M84,18 a9,9 0 1,1 -5,-3"/>
    <line x1="50" y1="62" x2="38" y2="88"/><line x1="50" y1="62" x2="62" y2="88"/>`,

  side_bend: `<circle cx="58" cy="16" r="8"/>
    <path d="M55,24 Q66,42 58,66"/>
    <line x1="56" y1="30" x2="72" y2="14"/>
    <line x1="58" y1="42" x2="38" y2="52"/>
    <line x1="58" y1="66" x2="48" y2="90"/><line x1="58" y1="66" x2="66" y2="90"/>`,

  cat_cow: `<path d="M18,58 Q50,32 82,58"/><circle cx="16" cy="52" r="7"/>
    <line x1="22" y1="58" x2="22" y2="80"/><line x1="34" y1="60" x2="34" y2="80"/>
    <line x1="78" y1="58" x2="78" y2="80"/><line x1="66" y1="60" x2="66" y2="80"/>`,

  squat: `<circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="46"/>
    <line x1="50" y1="30" x2="30" y2="36"/><line x1="50" y1="30" x2="70" y2="36"/>
    <line x1="50" y1="46" x2="34" y2="60"/><line x1="34" y1="60" x2="37" y2="84"/>
    <line x1="50" y1="46" x2="66" y2="60"/><line x1="66" y1="60" x2="63" y2="84"/>`,

  pushup_wall: `<line x1="86" y1="8" x2="86" y2="92"/>
    <circle cx="26" cy="70" r="8"/>
    <line x1="32" y1="65" x2="68" y2="30"/>
    <line x1="60" y1="34" x2="80" y2="22"/>
    <line x1="32" y1="65" x2="16" y2="82"/>
    <line x1="60" y1="44" x2="76" y2="34"/>`,

  bridge: `<circle cx="12" cy="66" r="7"/>
    <path d="M18,66 L42,66 L60,44 L80,66"/>
    <line x1="80" y1="66" x2="80" y2="86"/><line x1="66" y1="66" x2="63" y2="86"/>`,

  calf_raise: `<circle cx="50" cy="15" r="8"/><line x1="50" y1="23" x2="50" y2="58"/>
    <line x1="50" y1="30" x2="34" y2="40"/><line x1="50" y1="30" x2="66" y2="40"/>
    <line x1="50" y1="58" x2="47" y2="82"/><line x1="47" y1="82" x2="58" y2="86"/>
    <path d="M68,64 l0,-14 l6,6" />`,

  hamstring_stretch: `<circle cx="52" cy="16" r="8"/>
    <path d="M50,24 Q48,46 30,72"/>
    <path d="M50,30 Q40,46 26,58"/>
    <line x1="50" y1="46" x2="66" y2="52"/>
    <line x1="30" y1="72" x2="30" y2="90"/>`,

  childpose: `<circle cx="80" cy="46" r="7"/>
    <path d="M20,80 Q46,80 56,46 L74,44"/>
    <line x1="56" y1="46" x2="82" y2="34"/>
    <line x1="30" y1="80" x2="30" y2="60"/><line x1="46" y1="80" x2="46" y2="60"/>`,

  breathing: `<circle cx="50" cy="50" r="34" stroke-dasharray="3 6"/>
    <circle cx="50" cy="24" r="8"/>
    <path d="M50,32 L34,58 L66,58 Z"/>`,

  kneetochest: `<circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="48" y2="52"/>
    <line x1="49" y1="34" x2="34" y2="40"/><line x1="49" y1="34" x2="62" y2="46"/>
    <path d="M48,52 Q34,50 33,36"/>
    <line x1="48" y1="52" x2="60" y2="86"/>`,

  plank: `<circle cx="12" cy="52" r="7"/>
    <line x1="18" y1="56" x2="82" y2="56"/>
    <line x1="20" y1="56" x2="20" y2="76"/><line x1="30" y1="56" x2="30" y2="76"/>
    <line x1="78" y1="56" x2="78" y2="76"/><line x1="68" y1="56" x2="68" y2="76"/>`,

  steptouch: `<circle cx="50" cy="16" r="8"/><line x1="50" y1="24" x2="50" y2="55"/>
    <line x1="50" y1="32" x2="34" y2="30"/><line x1="50" y1="32" x2="66" y2="30"/>
    <line x1="50" y1="55" x2="30" y2="85"/><line x1="50" y1="55" x2="62" y2="85"/>
    <path d="M74,50 l8,0 l-4,-5 M82,50 l-4,5"/>`,

  superman: `<path d="M20,50 Q50,40 80,50"/>
    <circle cx="14" cy="46" r="7"/>
    <line x1="20" y1="50" x2="10" y2="36"/>
    <line x1="80" y1="50" x2="90" y2="36"/><line x1="80" y1="50" x2="90" y2="60"/>`,

  legext: `<line x1="70" y1="30" x2="70" y2="88"/><line x1="70" y1="88" x2="88" y2="88"/>
    <circle cx="50" cy="34" r="8"/><line x1="50" y1="42" x2="52" y2="66"/>
    <line x1="51" y1="46" x2="66" y2="50"/>
    <line x1="52" y1="66" x2="70" y2="66"/>
    <line x1="52" y1="66" x2="34" y2="74"/><line x1="34" y1="74" x2="34" y2="88"/>`,

  shoulderroll: `<circle cx="50" cy="17" r="8"/><line x1="50" y1="25" x2="48" y2="62"/>
    <line x1="48" y1="62" x2="40" y2="88"/><line x1="48" y1="62" x2="56" y2="88"/>
    <line x1="49" y1="34" x2="49" y2="52"/>
    <path d="M40,30 a9,9 0 1,1 3,8" />
    <path d="M58,30 a9,9 0 1,0 -3,8" />`,

  wallsit: `<line x1="20" y1="8" x2="20" y2="92"/>
    <circle cx="26" cy="30" r="7"/>
    <line x1="26" y1="37" x2="26" y2="60"/>
    <line x1="26" y1="60" x2="52" y2="60"/>
    <line x1="52" y1="60" x2="52" y2="88"/>`,

  rest_moon: `<path d="M62,18 A26,26 0 1,0 62,82 A20,20 0 1,1 62,18 Z"/>
    <line x1="76" y1="24" x2="82" y2="24"/><line x1="79" y1="21" x2="79" y2="27"/>
    <line x1="82" y1="36" x2="87" y2="36"/>`
};

function iconSvg(key) {
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${ICONS[key] || ICONS.breathing}</svg>`;
}

/* ---------------------------------------------------------------------
   Exercise library — base info shared across the days that use them.
--------------------------------------------------------------------- */
const EXERCISES = {
  march_in_place: {
    name: 'Standing March in Place', icon: 'march',
    desc: 'Stand tall and gently lift one knee at a time, like a slow, easy walk in place. Let your arms swing naturally and keep your breathing steady.'
  },
  arm_circles: {
    name: 'Arm Circles', icon: 'arm_circle',
    desc: 'Extend your arms out to the sides at shoulder height and draw small, slow circles. Keep your shoulders relaxed throughout.'
  },
  side_bend: {
    name: 'Standing Side Bend', icon: 'side_bend',
    desc: 'Stand with feet hip-width apart. Slide one hand down the side of your leg while reaching the other arm gently overhead, then switch sides.'
  },
  cat_cow: {
    name: 'Cat-Cow Stretch', icon: 'cat_cow',
    desc: 'On hands and knees, slowly arch your back up, then let it dip down, moving with your breath. A gentle way to wake up the spine.'
  },
  chair_squat: {
    name: 'Chair-Assisted Squat', icon: 'squat',
    desc: 'Stand in front of a sturdy chair. Lower yourself slowly as if sitting down, lightly tap the seat, then stand back up. Hold the chair back for balance if you need to.'
  },
  wall_pushup: {
    name: 'Wall Push-Up', icon: 'pushup_wall',
    desc: 'Face a wall with your hands on it at shoulder height. Slowly bend your elbows to bring your chest toward the wall, then push back to start.'
  },
  glute_bridge: {
    name: 'Gentle Glute Bridge', icon: 'bridge',
    desc: 'Lie on your back with knees bent, feet flat on the floor. Slowly lift your hips a few inches, hold briefly, then lower with control.'
  },
  calf_raise: {
    name: 'Standing Calf Raise', icon: 'calf_raise',
    desc: 'Stand tall, holding a wall or chair for balance, and slowly rise onto your toes. Lower back down with control.'
  },
  toe_reach: {
    name: 'Standing Toe Reach', icon: 'hamstring_stretch',
    desc: 'Stand with feet hip-width apart and hinge gently forward from your hips, letting your arms hang toward your feet. Keep your knees soft, never locked.'
  },
  childs_pose: {
    name: "Child's Pose", icon: 'childpose',
    desc: 'Kneel and sit back onto your heels, then fold forward, resting your forehead toward the floor with arms stretched ahead. Breathe slowly.'
  },
  deep_breathing: {
    name: 'Deep Breathing', icon: 'breathing',
    desc: 'Sit or lie comfortably. Inhale slowly through your nose, hold briefly, then exhale even more slowly. Let your shoulders soften with every breath out.'
  },
  knee_to_chest: {
    name: 'Standing Knee-to-Chest', icon: 'kneetochest',
    desc: 'Stand tall and gently pull one knee toward your chest with your hands. Hold briefly, then switch sides.'
  },
  modified_plank: {
    name: 'Knee Plank Hold', icon: 'plank',
    desc: 'Come onto your forearms and knees, keeping your back flat like a tabletop. Hold the position while breathing steadily.'
  },
  step_touch: {
    name: 'Step Touch', icon: 'steptouch',
    desc: 'Step one foot out to the side, tap the other foot beside it, then step back the other way. Keep it light and easy, almost like a slow dance step.'
  },
  superman_lift: {
    name: 'Gentle Superman Lift', icon: 'superman',
    desc: 'Lie face down with arms extended forward. Slowly lift your arms and legs a few inches off the floor, hold briefly, then lower with control.'
  },
  seated_leg_ext: {
    name: 'Seated Leg Extension', icon: 'legext',
    desc: 'Sit tall in a chair and slowly straighten one leg out in front of you. Hold briefly, then lower and switch legs.'
  },
  shoulder_rolls: {
    name: 'Shoulder Rolls', icon: 'shoulderroll',
    desc: 'Lift your shoulders up toward your ears, then roll them back and down in one smooth circle.'
  },
  wall_sit: {
    name: 'Short Wall Sit', icon: 'wallsit',
    desc: 'Lean your back against a wall and slide down until your knees are bent at a gentle angle, like sitting in an invisible chair. Keep it brief.'
  }
};

/* ---------------------------------------------------------------------
   30 day program. Each workout/recovery day lists the exercises it uses
   with day-specific sets/reps/duration/rest so intensity can progress
   gradually. Rest days carry no exercise list.
--------------------------------------------------------------------- */
const PROGRAM = [
  { day: 1, type: 'workout', title: 'Gentle Full-Body Wake-Up', difficulty: 'Very easy', duration: '10 min', exercises: [
    { key: 'march_in_place', duration: '30 sec', sets: 2, rest: '30 sec' },
    { key: 'arm_circles', reps: '10 each direction', sets: 1, rest: '20 sec' },
    { key: 'cat_cow', reps: '8', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '5 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 2, type: 'recovery', title: 'Stretch & Breathe', difficulty: 'Very easy', duration: '8 min', exercises: [
    { key: 'childs_pose', duration: '40 sec', sets: 1, rest: '—' },
    { key: 'toe_reach', duration: '30 sec', sets: 1, rest: '—' },
    { key: 'shoulder_rolls', reps: '10', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '6 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 3, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 4, type: 'workout', title: 'Standing Basics', difficulty: 'Very easy', duration: '10 min', exercises: [
    { key: 'march_in_place', duration: '40 sec', sets: 2, rest: '30 sec' },
    { key: 'side_bend', reps: '8 each side', sets: 1, rest: '20 sec' },
    { key: 'chair_squat', reps: '6', sets: 1, rest: '45 sec' },
    { key: 'deep_breathing', duration: '5 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 5, type: 'recovery', title: 'Mobility Flow', difficulty: 'Very easy', duration: '8 min', exercises: [
    { key: 'cat_cow', reps: '10', sets: 1, rest: '—' },
    { key: 'knee_to_chest', reps: '6 each side', sets: 1, rest: '—' },
    { key: 'childs_pose', duration: '40 sec', sets: 1, rest: '—' }
  ]},
  { day: 6, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 7, type: 'workout', title: 'Beginner Circuit I', difficulty: 'Easy', duration: '12 min', exercises: [
    { key: 'march_in_place', duration: '45 sec', sets: 2, rest: '30 sec' },
    { key: 'chair_squat', reps: '8', sets: 2, rest: '45 sec' },
    { key: 'wall_pushup', reps: '6', sets: 1, rest: '45 sec' },
    { key: 'toe_reach', duration: '30 sec', sets: 1, rest: '—' }
  ]},
  { day: 8, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 9, type: 'recovery', title: 'Gentle Stretch', difficulty: 'Easy', duration: '8 min', exercises: [
    { key: 'side_bend', reps: '8 each side', sets: 1, rest: '—' },
    { key: 'toe_reach', duration: '30 sec', sets: 1, rest: '—' },
    { key: 'childs_pose', duration: '45 sec', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '6 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 10, type: 'workout', title: 'Beginner Circuit II', difficulty: 'Easy', duration: '12 min', exercises: [
    { key: 'march_in_place', duration: '45 sec', sets: 2, rest: '30 sec' },
    { key: 'wall_pushup', reps: '8', sets: 2, rest: '45 sec' },
    { key: 'glute_bridge', reps: '8', sets: 1, rest: '45 sec' },
    { key: 'calf_raise', reps: '10', sets: 1, rest: '30 sec' }
  ]},
  { day: 11, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 12, type: 'workout', title: 'Lower Body Basics', difficulty: 'Easy', duration: '12 min', exercises: [
    { key: 'chair_squat', reps: '8', sets: 2, rest: '45 sec' },
    { key: 'glute_bridge', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'calf_raise', reps: '10', sets: 2, rest: '30 sec' },
    { key: 'toe_reach', duration: '30 sec', sets: 1, rest: '—' }
  ]},
  { day: 13, type: 'recovery', title: 'Stretch & Breathe', difficulty: 'Easy', duration: '8 min', exercises: [
    { key: 'cat_cow', reps: '10', sets: 1, rest: '—' },
    { key: 'side_bend', reps: '8 each side', sets: 1, rest: '—' },
    { key: 'childs_pose', duration: '45 sec', sets: 1, rest: '—' }
  ]},
  { day: 14, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 15, type: 'workout', title: 'Beginner Circuit III', difficulty: 'Easy-moderate', duration: '14 min', exercises: [
    { key: 'march_in_place', duration: '1 min', sets: 2, rest: '30 sec' },
    { key: 'wall_pushup', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'chair_squat', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'modified_plank', duration: '15 sec', sets: 1, rest: '45 sec' }
  ]},
  { day: 16, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 17, type: 'workout', title: 'Core & Balance Intro', difficulty: 'Easy-moderate', duration: '14 min', exercises: [
    { key: 'modified_plank', duration: '15 sec', sets: 2, rest: '45 sec' },
    { key: 'superman_lift', reps: '8', sets: 1, rest: '45 sec' },
    { key: 'glute_bridge', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'seated_leg_ext', reps: '8 each leg', sets: 1, rest: '30 sec' }
  ]},
  { day: 18, type: 'recovery', title: 'Mobility Flow', difficulty: 'Easy', duration: '8 min', exercises: [
    { key: 'cat_cow', reps: '10', sets: 1, rest: '—' },
    { key: 'knee_to_chest', reps: '8 each side', sets: 1, rest: '—' },
    { key: 'step_touch', duration: '40 sec', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '6 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 19, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 20, type: 'workout', title: 'Full Body Flow I', difficulty: 'Easy-moderate', duration: '15 min', exercises: [
    { key: 'step_touch', duration: '45 sec', sets: 2, rest: '30 sec' },
    { key: 'wall_pushup', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'chair_squat', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'glute_bridge', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'modified_plank', duration: '20 sec', sets: 1, rest: '45 sec' }
  ]},
  { day: 21, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 22, type: 'workout', title: 'Full Body Flow II', difficulty: 'Easy-moderate', duration: '15 min', exercises: [
    { key: 'march_in_place', duration: '1 min', sets: 2, rest: '30 sec' },
    { key: 'wall_pushup', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'superman_lift', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'calf_raise', reps: '12', sets: 2, rest: '30 sec' },
    { key: 'modified_plank', duration: '20 sec', sets: 1, rest: '45 sec' }
  ]},
  { day: 23, type: 'recovery', title: 'Stretch & Breathe', difficulty: 'Easy', duration: '8 min', exercises: [
    { key: 'side_bend', reps: '10 each side', sets: 1, rest: '—' },
    { key: 'toe_reach', duration: '35 sec', sets: 1, rest: '—' },
    { key: 'childs_pose', duration: '45 sec', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '6 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 24, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 25, type: 'workout', title: 'Strength Basics I', difficulty: 'Moderate', duration: '16 min', exercises: [
    { key: 'chair_squat', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'wall_pushup', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'glute_bridge', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'modified_plank', duration: '25 sec', sets: 2, rest: '45 sec' },
    { key: 'wall_sit', duration: '10 sec', sets: 1, rest: '60 sec' }
  ]},
  { day: 26, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 27, type: 'workout', title: 'Strength Basics II', difficulty: 'Moderate', duration: '16 min', exercises: [
    { key: 'chair_squat', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'superman_lift', reps: '10', sets: 2, rest: '45 sec' },
    { key: 'calf_raise', reps: '12', sets: 2, rest: '30 sec' },
    { key: 'wall_sit', duration: '12 sec', sets: 2, rest: '60 sec' },
    { key: 'seated_leg_ext', reps: '10 each leg', sets: 1, rest: '30 sec' }
  ]},
  { day: 28, type: 'recovery', title: 'Mobility Flow', difficulty: 'Easy', duration: '8 min', exercises: [
    { key: 'cat_cow', reps: '10', sets: 1, rest: '—' },
    { key: 'knee_to_chest', reps: '8 each side', sets: 1, rest: '—' },
    { key: 'side_bend', reps: '8 each side', sets: 1, rest: '—' },
    { key: 'deep_breathing', duration: '6 slow breaths', sets: 1, rest: '—' }
  ]},
  { day: 29, type: 'rest', title: 'Rest Day', difficulty: '—', duration: '—' },
  { day: 30, type: 'workout', title: 'Celebration Full-Body', difficulty: 'Moderate', duration: '18 min', exercises: [
    { key: 'march_in_place', duration: '1 min', sets: 1, rest: '30 sec' },
    { key: 'chair_squat', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'wall_pushup', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'glute_bridge', reps: '12', sets: 2, rest: '45 sec' },
    { key: 'modified_plank', duration: '25 sec', sets: 2, rest: '45 sec' },
    { key: 'wall_sit', duration: '12 sec', sets: 1, rest: '60 sec' }
  ]}
];

/* ---------------------------------------------------------------------
   Progress storage
--------------------------------------------------------------------- */
function getCompletedDays() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function setCompletedDays(arr) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) { /* localStorage unavailable — progress just won't persist */ }
}

function isDayComplete(day) {
  return getCompletedDays().includes(day);
}

function toggleDayComplete(day) {
  const days = getCompletedDays();
  const idx = days.indexOf(day);
  if (idx === -1) days.push(day); else days.splice(idx, 1);
  setCompletedDays(days);
}

/* ---------------------------------------------------------------------
   Rendering
--------------------------------------------------------------------- */
const typeLabel = { workout: 'Workout', recovery: 'Active recovery', rest: 'Rest' };
const dotClass = { workout: 'dot-workout', recovery: 'dot-recovery', rest: 'dot-rest' };
const badgeClass = { workout: 'badge-type-workout', recovery: 'badge-type-recovery', rest: 'badge-type-rest' };

function renderHome() {
  const completed = getCompletedDays();
  const cta = document.getElementById('home-cta');
  const note = document.getElementById('home-progress-note');

  if (completed.length === 0) {
    cta.textContent = 'Start your journey';
    cta.setAttribute('href', '#/program');
    note.textContent = '';
  } else if (completed.length >= 30) {
    cta.textContent = 'Program complete — view your days';
    cta.setAttribute('href', '#/program');
    note.textContent = "You've finished all 30 days. Take a moment to be proud of that.";
  } else {
    const nextDay = PROGRAM.find(d => !completed.includes(d.day));
    cta.textContent = nextDay ? `Continue — Day ${nextDay.day}` : 'Continue your program';
    cta.setAttribute('href', nextDay ? `#/day/${nextDay.day}` : '#/program');
    note.textContent = `${completed.length} of 30 days completed so far.`;
  }
}

function renderProgramProgress() {
  const completed = getCompletedDays().length;
  const pct = Math.round((completed / 30) * 100);
  document.getElementById('progress-count').textContent = `${completed} / 30 days completed`;
  document.getElementById('progress-percent').textContent = `${pct}%`;
  document.getElementById('progress-bar-fill').style.width = `${pct}%`;
}

function renderProgramGrid() {
  const grid = document.getElementById('day-grid');
  grid.innerHTML = PROGRAM.map(d => {
    const done = isDayComplete(d.day);
    return `
      <button class="day-card${done ? ' completed' : ''}" data-day="${d.day}" aria-label="Day ${d.day}: ${d.title}${done ? ', completed' : ''}">
        <span class="day-card-check">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="3"><path d="M4 12l5 5L20 7"/></svg>
        </span>
        <div class="day-card-num">${d.day}</div>
        <div class="day-card-type">
          <span class="day-card-dot ${dotClass[d.type]}"></span>${typeLabel[d.type]}
        </div>
      </button>`;
  }).join('');

  grid.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      const day = card.getAttribute('data-day');
      window.location.hash = `#/day/${day}`;
    });
  });

  renderProgramProgress();
}

function renderDay(dayNum) {
  const d = PROGRAM.find(p => p.day === dayNum);
  const container = document.getElementById('day-detail-content');

  if (!d) {
    container.innerHTML = `<p>That day couldn't be found.</p>`;
    return;
  }

  const done = isDayComplete(d.day);

  let exercisesHtml = '';
  if (d.type === 'rest') {
    exercisesHtml = `
      <div class="rest-panel">
        <p>Recovery is part of the plan, not a break from it. Take today off from structured exercise — a short easy walk is fine if you feel like it, but mostly just rest. Your body is adapting behind the scenes.</p>
      </div>`;
  } else {
    exercisesHtml = `<div class="exercise-list">` + d.exercises.map(ex => {
      const base = EXERCISES[ex.key];
      const amount = ex.duration ? `<span><strong>${ex.duration}</strong></span>` : `<span><strong>${ex.reps}</strong> reps</span>`;
      return `
        <div class="exercise-card">
          <div class="exercise-icon">${iconSvg(base.icon)}</div>
          <div class="exercise-info">
            <h3 class="exercise-name">${base.name}</h3>
            <div class="exercise-meta">
              ${amount}
              <span>${ex.sets} set${ex.sets > 1 ? 's' : ''}</span>
              <span>Rest: ${ex.rest}</span>
            </div>
            <p class="exercise-desc">${base.desc}</p>
          </div>
        </div>`;
    }).join('') + `</div>`;
  }

  const prev = PROGRAM.find(p => p.day === dayNum - 1);
  const next = PROGRAM.find(p => p.day === dayNum + 1);

  container.innerHTML = `
    <div class="day-hero">
      <p class="day-hero-num">Day ${d.day} of 30</p>
      <h1 class="day-hero-title">${d.title}</h1>
      <div class="day-badges">
        <span class="badge ${badgeClass[d.type]}">${typeLabel[d.type]}</span>
        ${d.type !== 'rest' ? `<span class="badge">${d.difficulty}</span><span class="badge">${d.duration}</span>` : ''}
      </div>
    </div>
    ${exercisesHtml}
    <div class="complete-section">
      <button class="btn-complete${done ? ' is-done' : ''}" id="complete-btn">
        ${done ? '✓ Day completed' : 'Mark day complete'}
      </button>
    </div>
    <div class="day-nav">
      ${prev ? `<a href="#/day/${prev.day}">‹ Day ${prev.day}</a>` : `<span class="disabled">.</span>`}
      ${next ? `<a href="#/day/${next.day}">Day ${next.day} ›</a>` : `<span class="disabled">.</span>`}
    </div>
  `;

  document.getElementById('complete-btn').addEventListener('click', () => {
    toggleDayComplete(d.day);
    renderDay(dayNum);
  });
}

/* ---------------------------------------------------------------------
   Routing
--------------------------------------------------------------------- */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function route() {
  const hash = window.location.hash || '#/';
  const dayMatch = hash.match(/^#\/day\/(\d+)$/);

  if (hash === '#/' || hash === '') {
    renderHome();
    showView('view-home');
  } else if (hash === '#/program') {
    renderProgramGrid();
    showView('view-program');
  } else if (dayMatch) {
    renderDay(parseInt(dayMatch[1], 10));
    showView('view-day');
  } else {
    renderHome();
    showView('view-home');
  }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
