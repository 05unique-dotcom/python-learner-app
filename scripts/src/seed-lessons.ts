import { eq } from "drizzle-orm";
import { db, lessonsTable, challengesTable, pool } from "@workspace/db";

interface ChallengeSeed {
  question: string;
  type: "multiple_choice" | "fill_in_the_blank";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface LessonSeed {
  title: string;
  description: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  challenges: ChallengeSeed[];
}

const lessons: LessonSeed[] = [
  {
    title: "List Comprehension",
    description: "Write shorter, faster loops to build lists using Python's list comprehension syntax.",
    order: 7,
    difficulty: "intermediate",
    content: `A list comprehension lets you build a new list from an existing iterable in a single, readable line — instead of writing a full for-loop with .append().

## Basic Syntax

\`\`\`python
squares = [x ** 2 for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
\`\`\`

This replaces the longer version:

\`\`\`python
squares = []
for x in range(5):
    squares.append(x ** 2)
\`\`\`

## Adding a Condition

You can filter items using an \`if\` clause at the end:

\`\`\`python
evens = [x for x in range(10) if x % 2 == 0]
print(evens)  # [0, 2, 4, 6, 8]
\`\`\`

## Transforming Strings

\`\`\`python
words = ["hello", "world"]
upper_words = [w.upper() for w in words]
print(upper_words)  # ['HELLO', 'WORLD']
\`\`\`

## Nested Loops

\`\`\`python
pairs = [(x, y) for x in range(2) for y in range(2)]
print(pairs)  # [(0, 0), (0, 1), (1, 0), (1, 1)]
\`\`\`

List comprehensions are more "Pythonic" and usually faster than an equivalent for-loop, but readability matters — if a comprehension gets too complex, a regular loop may be clearer.`,
    challenges: [
      {
        question: "What does `[x * 2 for x in range(3)]` evaluate to?",
        type: "multiple_choice",
        options: ["[0, 2, 4]", "[2, 4, 6]", "[0, 1, 2]", "[1, 2, 3]"],
        correctAnswer: "[0, 2, 4]",
        explanation: "range(3) yields 0, 1, 2. Each is multiplied by 2, giving [0, 2, 4].",
      },
      {
        question: "Which list comprehension keeps only even numbers from 0-9?",
        type: "multiple_choice",
        options: [
          "[x for x in range(10) if x % 2 == 0]",
          "[x for x in range(10) if x % 2 == 1]",
          "[x % 2 for x in range(10)]",
          "[x for x in range(10) while x % 2 == 0]",
        ],
        correctAnswer: "[x for x in range(10) if x % 2 == 0]",
        explanation: "The `if x % 2 == 0` condition filters for even numbers only.",
      },
      {
        question: "Fill in the blank: `[w.upper() for w in [\"hi\", \"bye\"]]` produces a list of ___ strings.",
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "uppercase",
        explanation: "`.upper()` converts each string in the list to uppercase.",
      },
      {
        question: "What is the main benefit of a list comprehension over a for-loop with .append()?",
        type: "multiple_choice",
        options: [
          "It is shorter and often more readable",
          "It can only be used with numbers",
          "It automatically sorts the list",
          "It removes duplicates automatically",
        ],
        correctAnswer: "It is shorter and often more readable",
        explanation: "List comprehensions condense loop + append logic into a single expressive line.",
      },
      {
        question: "What does `[(x, y) for x in range(2) for y in range(2)]` produce?",
        type: "multiple_choice",
        options: [
          "[(0, 0), (0, 1), (1, 0), (1, 1)]",
          "[(0, 0), (1, 1)]",
          "[0, 1, 0, 1]",
          "An error, nested loops aren't allowed",
        ],
        correctAnswer: "[(0, 0), (0, 1), (1, 0), (1, 1)]",
        explanation: "Nested for-clauses in a comprehension work like nested loops, producing all combinations.",
      },
    ],
  },
  {
    title: "Lambda Functions",
    description: "Create small, anonymous, one-line functions with Python's lambda expressions.",
    order: 8,
    difficulty: "intermediate",
    content: `A lambda function is a small anonymous function defined with the \`lambda\` keyword instead of \`def\`. It can take any number of arguments but only has a single expression.

## Basic Syntax

\`\`\`python
square = lambda x: x ** 2
print(square(5))  # 25
\`\`\`

This is equivalent to:

\`\`\`python
def square(x):
    return x ** 2
\`\`\`

## Multiple Arguments

\`\`\`python
add = lambda a, b: a + b
print(add(3, 4))  # 7
\`\`\`

## Common Use: sorted() and map()

Lambdas shine when you need a quick throwaway function, often passed to another function:

\`\`\`python
names = ["Charlie", "Alice", "Bob"]
names.sort(key=lambda name: len(name))
print(names)  # ['Bob', 'Alice', 'Charlie']

nums = [1, 2, 3, 4]
doubled = list(map(lambda x: x * 2, nums))
print(doubled)  # [2, 4, 6, 8]
\`\`\`

## Common Use: filter()

\`\`\`python
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens)  # [2, 4, 6]
\`\`\`

Lambdas are best for short, simple operations. For anything more complex, a regular named function with \`def\` is clearer and easier to debug.`,
    challenges: [
      {
        question: "Which keyword is used to define an anonymous function in Python?",
        type: "multiple_choice",
        options: ["lambda", "def", "func", "anon"],
        correctAnswer: "lambda",
        explanation: "The `lambda` keyword creates a small anonymous function.",
      },
      {
        question: "What does `(lambda x, y: x + y)(3, 4)` return?",
        type: "multiple_choice",
        options: ["7", "12", "34", "Error"],
        correctAnswer: "7",
        explanation: "The lambda adds its two arguments: 3 + 4 = 7.",
      },
      {
        question: "Fill in the blank: A lambda function can only contain a single ___.",
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "expression",
        explanation: "Unlike `def` functions, lambdas are limited to one expression with no statements.",
      },
      {
        question: "Which built-in function is commonly paired with lambda to transform every item in a list?",
        type: "multiple_choice",
        options: ["map()", "range()", "input()", "print()"],
        correctAnswer: "map()",
        explanation: "`map(function, iterable)` applies the function (often a lambda) to every item.",
      },
      {
        question: "What does `list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4]))` return?",
        type: "multiple_choice",
        options: ["[2, 4]", "[1, 3]", "[1, 2, 3, 4]", "[]"],
        correctAnswer: "[2, 4]",
        explanation: "`filter` keeps only items where the lambda returns True — here, the even numbers.",
      },
    ],
  },
  {
    title: "Modules and pip",
    description: "Organize code with modules and install third-party packages using pip.",
    order: 9,
    difficulty: "intermediate",
    content: `A module is simply a Python file (.py) containing code you can reuse elsewhere. Python also ships with a huge standard library of built-in modules, and pip lets you install thousands more from PyPI.

## Importing a Built-in Module

\`\`\`python
import math
print(math.sqrt(16))  # 4.0
print(math.pi)  # 3.14159...
\`\`\`

## Import Variants

\`\`\`python
from math import sqrt
print(sqrt(25))  # 5.0

import math as m
print(m.floor(3.7))  # 3
\`\`\`

## Creating Your Own Module

If you save this in \`greetings.py\`:

\`\`\`python
def say_hello(name):
    return f"Hello, {name}!"
\`\`\`

You can use it in another file:

\`\`\`python
import greetings
print(greetings.say_hello("Asha"))
\`\`\`

## Installing Packages with pip

pip is Python's package manager. From the terminal:

\`\`\`bash
pip install requests
\`\`\`

Then in your code:

\`\`\`python
import requests
response = requests.get("https://api.example.com")
\`\`\`

Popular packages include \`requests\` (HTTP calls), \`numpy\` (numerical computing), and \`pandas\` (data analysis). Always check a package's documentation before using it.`,
    challenges: [
      {
        question: "Which statement imports the entire `math` module?",
        type: "multiple_choice",
        options: ["import math", "include math", "using math", "require math"],
        correctAnswer: "import math",
        explanation: "`import math` loads the module so you can call `math.something()`.",
      },
      {
        question: "What command installs a third-party package named `requests`?",
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "pip install requests",
        explanation: "`pip install <package>` downloads and installs packages from PyPI.",
      },
      {
        question: "What does `from math import sqrt` allow you to do?",
        type: "multiple_choice",
        options: [
          "Call sqrt() directly without the math. prefix",
          "Import every function except sqrt",
          "Delete the sqrt function",
          "Rename math to sqrt",
        ],
        correctAnswer: "Call sqrt() directly without the math. prefix",
        explanation: "This import style brings a single name into your namespace directly.",
      },
      {
        question: "What is a Python module?",
        type: "multiple_choice",
        options: [
          "A .py file containing reusable code",
          "A type of loop",
          "A built-in data type",
          "A special kind of variable",
        ],
        correctAnswer: "A .py file containing reusable code",
        explanation: "Any Python file can act as a module that other files import and reuse.",
      },
      {
        question: "What does `import math as m` do?",
        type: "multiple_choice",
        options: [
          "Imports math under the alias m",
          "Creates a new module called m",
          "Deletes the math module",
          "Imports only the m function from math",
        ],
        correctAnswer: "Imports math under the alias m",
        explanation: "The `as` keyword lets you give an imported module a shorter alias.",
      },
    ],
  },
  {
    title: "File Handling",
    description: "Read from and write to files on disk using Python's built-in file operations.",
    order: 10,
    difficulty: "intermediate",
    content: `Python makes it easy to read and write files using the built-in \`open()\` function.

## Writing to a File

\`\`\`python
with open("notes.txt", "w") as f:
    f.write("Hello, file!")
\`\`\`

Using \`with\` automatically closes the file when you're done, even if an error occurs.

## Reading a File

\`\`\`python
with open("notes.txt", "r") as f:
    content = f.read()
    print(content)  # Hello, file!
\`\`\`

## Reading Line by Line

\`\`\`python
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())
\`\`\`

## Appending to a File

\`\`\`python
with open("notes.txt", "a") as f:
    f.write("\\nAnother line")
\`\`\`

## File Modes

- \`"r"\` — read (default, file must exist)
- \`"w"\` — write (overwrites existing content, creates file if missing)
- \`"a"\` — append (adds to the end, creates file if missing)
- \`"r+"\` — read and write

Always prefer the \`with open(...) as f:\` pattern — it guarantees the file gets closed properly.`,
    challenges: [
      {
        question: "Which file mode overwrites the entire contents of a file?",
        type: "multiple_choice",
        options: ['"w"', '"r"', '"a"', '"x"'],
        correctAnswer: '"w"',
        explanation: '"w" mode opens a file for writing and erases existing content.',
      },
      {
        question: "What is the main benefit of using `with open(...) as f:`?",
        type: "multiple_choice",
        options: [
          "The file is automatically closed afterward",
          "It reads files faster",
          "It converts the file to JSON",
          "It only works with text files",
        ],
        correctAnswer: "The file is automatically closed afterward",
        explanation: "The `with` statement ensures proper cleanup (closing the file) even if errors occur.",
      },
      {
        question: 'Fill in the blank: `open("notes.txt", "___")` mode adds new content to the end of a file without erasing it.',
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "a",
        explanation: '"a" stands for append, adding to the end of the file.',
      },
      {
        question: "Which method reads the entire contents of a file as a single string?",
        type: "multiple_choice",
        options: ["f.read()", "f.readline()", "f.open()", "f.close()"],
        correctAnswer: "f.read()",
        explanation: "`.read()` returns the whole file content as one string.",
      },
      {
        question: "What happens if you open a file in \"r\" mode and it doesn't exist?",
        type: "multiple_choice",
        options: [
          "Python raises a FileNotFoundError",
          "Python creates the file automatically",
          "Python returns an empty string",
          "Nothing happens",
        ],
        correctAnswer: "Python raises a FileNotFoundError",
        explanation: '"r" mode requires the file to already exist, otherwise an error is raised.',
      },
    ],
  },
  {
    title: "Exception Handling (try/except)",
    description: "Handle errors gracefully in your programs using try, except, else, and finally.",
    order: 11,
    difficulty: "intermediate",
    content: `Errors happen — a file might be missing, a user might type letters instead of numbers. Exception handling lets your program respond gracefully instead of crashing.

## Basic try/except

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("You can't divide by zero!")
\`\`\`

## Catching Multiple Exception Types

\`\`\`python
try:
    value = int(input("Enter a number: "))
except ValueError:
    print("That's not a valid number!")
except ZeroDivisionError:
    print("Division by zero isn't allowed!")
\`\`\`

## Catching Any Exception

\`\`\`python
try:
    risky_operation()
except Exception as e:
    print(f"Something went wrong: {e}")
\`\`\`

## else and finally

\`\`\`python
try:
    number = int("42")
except ValueError:
    print("Invalid number")
else:
    print("Conversion succeeded:", number)
finally:
    print("This always runs, error or not")
\`\`\`

- \`else\` runs only if no exception occurred.
- \`finally\` always runs — great for cleanup like closing files or connections.

## Raising Your Own Exceptions

\`\`\`python
def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount
\`\`\`

Good error handling makes programs more robust and user-friendly.`,
    challenges: [
      {
        question: "Which block catches an error so the program doesn't crash?",
        type: "multiple_choice",
        options: ["except", "catch", "error", "rescue"],
        correctAnswer: "except",
        explanation: "Python uses `try`/`except` blocks to catch and handle exceptions.",
      },
      {
        question: "What exception is raised by `10 / 0`?",
        type: "multiple_choice",
        options: ["ZeroDivisionError", "ValueError", "TypeError", "KeyError"],
        correctAnswer: "ZeroDivisionError",
        explanation: "Dividing by zero raises a ZeroDivisionError in Python.",
      },
      {
        question: "Which block always executes, whether or not an exception occurred?",
        type: "multiple_choice",
        options: ["finally", "else", "except", "try"],
        correctAnswer: "finally",
        explanation: "`finally` runs no matter what — useful for cleanup code.",
      },
      {
        question: "Fill in the blank: the ___ keyword lets you manually trigger an exception.",
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "raise",
        explanation: "`raise SomeError(\"message\")` manually triggers an exception.",
      },
      {
        question: "When does the `else` block in a try/except run?",
        type: "multiple_choice",
        options: [
          "Only if no exception was raised in the try block",
          "Only if an exception was raised",
          "Always, before finally",
          "Never, it's optional and unused",
        ],
        correctAnswer: "Only if no exception was raised in the try block",
        explanation: "`else` executes only when the try block completes successfully.",
      },
    ],
  },
  {
    title: "Object Oriented Programming (Classes and Objects)",
    description: "Model real-world things with classes, objects, attributes, and methods.",
    order: 12,
    difficulty: "advanced",
    content: `Object-Oriented Programming (OOP) lets you bundle related data (attributes) and behavior (methods) together into a single blueprint called a class.

## Defining a Class

\`\`\`python
class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"{self.name} says Woof!"
\`\`\`

\`__init__\` is the constructor — it runs automatically when you create a new object.

## Creating Objects (Instances)

\`\`\`python
my_dog = Dog("Rex", 3)
print(my_dog.name)   # Rex
print(my_dog.bark())  # Rex says Woof!
\`\`\`

## Attributes and Methods

- **Attributes** are variables that belong to an object (e.g. \`self.name\`).
- **Methods** are functions that belong to a class and can access/modify its attributes.

## Inheritance

A class can inherit from another class to reuse and extend behavior:

\`\`\`python
class Puppy(Dog):
    def play(self):
        return f"{self.name} is playing!"

puppy = Puppy("Buddy", 1)
print(puppy.bark())  # Buddy says Woof! (inherited)
print(puppy.play())  # Buddy is playing!
\`\`\`

## Why Use OOP?

OOP helps organize larger programs by grouping related data and behavior together, making code more reusable, modular, and easier to reason about — especially as programs grow.`,
    challenges: [
      {
        question: "Which special method acts as a class's constructor in Python?",
        type: "multiple_choice",
        options: ["__init__", "__new__", "__start__", "__main__"],
        correctAnswer: "__init__",
        explanation: "`__init__` runs automatically whenever a new object is created from a class.",
      },
      {
        question: "What keyword is used to define a class in Python?",
        type: "fill_in_the_blank",
        options: [],
        correctAnswer: "class",
        explanation: "The `class` keyword begins a class definition.",
      },
      {
        question: "What does `self` refer to inside a class method?",
        type: "multiple_choice",
        options: [
          "The current instance of the object",
          "The class itself, not an instance",
          "A global variable",
          "The parent class",
        ],
        correctAnswer: "The current instance of the object",
        explanation: "`self` lets a method access the attributes and other methods of the specific object it was called on.",
      },
      {
        question: "What is it called when one class reuses and extends another class's behavior?",
        type: "multiple_choice",
        options: ["Inheritance", "Encapsulation", "Iteration", "Recursion"],
        correctAnswer: "Inheritance",
        explanation: "Inheritance lets a subclass reuse and extend the attributes/methods of a parent class.",
      },
      {
        question: "Given `class Dog: def __init__(self, name): self.name = name`, what does `Dog(\"Rex\").name` return?",
        type: "multiple_choice",
        options: ["Rex", "Dog", "self", "Error"],
        correctAnswer: "Rex",
        explanation: "The constructor sets `self.name` to the argument passed in, here \"Rex\".",
      },
    ],
  },
];

async function main() {
  for (const lesson of lessons) {
    const [existing] = await db
      .select({ id: lessonsTable.id })
      .from(lessonsTable)
      .where(eq(lessonsTable.order, lesson.order));

    if (existing) {
      console.log(`Skipping "${lesson.title}" (order ${lesson.order}) — already exists`);
      continue;
    }

    const [inserted] = await db
      .insert(lessonsTable)
      .values({
        title: lesson.title,
        description: lesson.description,
        order: lesson.order,
        difficulty: lesson.difficulty,
        content: lesson.content,
      })
      .returning({ id: lessonsTable.id });

    console.log(`Inserted lesson "${lesson.title}" with id ${inserted.id}`);

    for (const challenge of lesson.challenges) {
      await db.insert(challengesTable).values({
        lessonId: inserted.id,
        question: challenge.question,
        type: challenge.type,
        options: challenge.options,
        correctAnswer: challenge.correctAnswer,
        explanation: challenge.explanation,
      });
    }
    console.log(`  -> Inserted ${lesson.challenges.length} challenges`);
  }

  await pool.end();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
