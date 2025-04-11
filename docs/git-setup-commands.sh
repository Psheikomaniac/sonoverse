# Initialisiere das Repository
git init

# Füge alle Dateien hinzu und erstelle den ersten Commit
git add .
git commit -m "chore: initial commit with project documentation"

# Benenne den Hauptbranch in main um
git branch -M main

# Erstelle den develop-Branch von main
git checkout -b develop

# Jetzt kannst du mit der Entwicklung auf Feature-Branches beginnen
# Beispiel:
# git checkout -b feature/project-setup