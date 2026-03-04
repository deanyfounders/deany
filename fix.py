import re

with open('src/App.jsx', 'r') as f:
    code = f.read()

# Find the modules 'islamic-finance' starting at the right spot
# It starts with 'islamic-finance': [{ and we need to find its matching ]
target = "'islamic-finance': [{"
pos = code.find(target, code.find("modules"))
if pos == -1:
    print("ERROR: not found")
    exit(1)

bracket_start = code.index('[', pos)
depth = 0
end = bracket_start
for i in range(bracket_start, len(code)):
    if code[i] == '[':
        depth += 1
    elif code[i] == ']':
        depth -= 1
    if depth == 0:
        end = i + 1
        break

replacement = """'islamic-finance': [{
      id: 'module-b1', title: "Why This Matters", subtitle: "Islam is pro-wealth, pro-commerce — and your money is a trust", icon: "🎯", color: "#d97706", difficulty: "Beginner", estimatedTime: "50 min", lessonCount: 5,
      mascotMessage: "This is your foundation — by the end you'll see money through the lens of amānah!",
      lessons: [
        { id: 'lesson-1-1', title: "The Trader Prophet         { id: 'lesson-1-1', title:ti-money", duration: "12 min", questions: [] },
        { id: 'lesson-1-2', title: "Money as Amānah", description: "You don't own wealth, you manage it", duration: "13 min", questions: [] },
        { id: 'lesson-1-3', title: "The Three Prohibitions", description: "Ribā, gharar and maysir basics", duration: "14 min", questions: [] },
        { id: 'lesson-1-4'        { id: 'lesson-1-4'        { id: ption: "What IS this deal doing, not what's it called", duration: "13 min", questions: [] },
        { id: 'lesson-1-5', title: "Your Money Right Now", description: "Guided self-assessment of your own finances", duration: "12 min", questions: [] },
      ]
    }]"""

code = code[:pos] + replacement + code[end:]
with open('src/App.jsx', 'w') as f:
    f.write(code)
print("DONE - replaced islamic-finance modules at position", pos)
