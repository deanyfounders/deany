f = 'src/App.jsx'
c = open(f).read()
old = "const selectLes = (l, i) => { if (!l.questions.length) return; setSelectedLesson({...l, lessonIndex: i}); resetQuiz(l.questions); setScreen('quiz'); };"
new = "const selectLes = (l, i) => { if (l.id === 'lesson-1-1') { setSelectedLesson({...l, lessonIndex: i}); setScreen('lesson-component'); return; } if (!l.questions.length) return; setSelectedLesson({...l, lessonIndex: i}); resetQuiz(l.questions); setScreen('quiz'); };"
c2 = c.replace(old, new)
open(f, 'w').write(c2)
print('Done!' if c != c2 else 'No match found')
