// Pilot lesson registry - engineering chrome only (titles, subject tint, route
// display name). Not scholarship. route/position live in the ref files (the graph);
// this maps a lesson_id to how its row/card presents. routeName is used verbatim
// in the "your {route} route" copy.
export const LESSONS = {
  hist_b1_l2: { title: 'Land and Its People', subject: 'islamic-history', routeName: 'history', accent: '#E06A45', tint: '#FBEFE9', ink: '#B04A2C' },
  fin_l3: { title: 'Riba, Gharar, Maysir', subject: 'islamic-finance', routeName: 'finance', accent: '#F0B429', tint: '#FDF6E4', ink: '#9A6E08' },
};
export const lessonAccent = (id) => (LESSONS[id] && LESSONS[id].accent) || '#5C6A85';
export const lessonTint = (id) => (LESSONS[id] && LESSONS[id].tint) || '#F7F8FA';

export const lessonTitle = (id) => (LESSONS[id] && LESSONS[id].title) || id;
export const lessonSubject = (id) => (LESSONS[id] && LESSONS[id].subject) || null;
export const routeName = (id) => (LESSONS[id] && LESSONS[id].routeName) || (id || '').split('_')[0] || 'your';
