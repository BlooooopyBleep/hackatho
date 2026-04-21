#!/usr/bin/env python3
# ===================================================
#  STORY BOX — RASPBERRY PI THERMAL PRINTER
# ===================================================
#
#  Press a button, get a random story printed!
#
#  HOW TO USE:
#    1. Put your stories in stories.json
#    2. Plug in your USB controller and thermal printer
#    3. Run:  python3 story_box.py
#
#  TO UPDATE STORIES:
#    Edit stories.json with your new stories, then
#    restart the script. You can export your Google
#    Sheet stories into the JSON format manually.
#
# ===================================================

import pygame
import subprocess
import json
import random
import os
import time

# ===================================================
#  SETTINGS — Change these to match your setup!
# ===================================================

# Your thermal printer name (check with: lpstat -p)
PRINTER_NAME = "80Series2"

# Button numbers on your USB controller
# Run the script and press buttons to see which
# numbers they are — it prints "Button X pressed!"
BUTTON_1 = 0    # First category (e.g. "short" stories)
BUTTON_2 = 1    # Second category (e.g. "medium" stories)
BUTTON_3 = 2    # Surprise — picks from ALL stories

# What category each button filters by
# These must match the "length" field in stories.json
BUTTON_1_FILTER = "short"
BUTTON_2_FILTER = "medium"

# ===================================================
#  LOAD STORIES FROM JSON FILE
# ===================================================

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STORIES_PATH = os.path.join(SCRIPT_DIR, "stories.json")


def load_stories():
    """Load stories from stories.json."""
    with open(STORIES_PATH, "r") as f:
        return json.load(f)


# ===================================================
#  PRINT A STORY ON THE THERMAL PRINTER
# ===================================================

def print_story(story, count):
    """Format a story and send it to the thermal printer."""
    divider = "- " * 16

    text = "\n\n\n"
    text += divider + "\n"
    text += "  Story Box\n"
    text += divider + "\n"
    text += "\n"
    text += "  " + story["title"] + "\n"
    text += "  by " + story["author"] + "\n"
    text += "\n"
    text += story["story"] + "\n"
    text += "\n"
    text += divider + "\n"
    text += "  Story #" + str(count) + "\n"
    text += divider + "\n"
    text += "\n\n\n"

    # Write to a temp file, then send to printer
    path = "/tmp/storybox_print.txt"
    with open(path, "w") as f:
        f.write(text)

    subprocess.run(["lp", "-d", PRINTER_NAME, path])
    print("  Printed: \"" + story["title"] + "\" (#" + str(count) + ")")


# ===================================================
#  MAIN
# ===================================================

def main():
    print("=" * 40)
    print("  STORY BOX")
    print("=" * 40)
    print()

    # Load stories from JSON
    stories = load_stories()
    print("Loaded " + str(len(stories)) + " stories from stories.json")
    print()

    # Set up pygame for button input (no display needed)
    os.environ["SDL_VIDEODRIVER"] = "dummy"
    pygame.display.init()
    pygame.joystick.init()

    # Wait for a controller to be plugged in
    print("Looking for controller...")
    while pygame.joystick.get_count() == 0:
        print("  No controller found. Plug in USB controller...")
        time.sleep(3)
        pygame.joystick.quit()
        pygame.joystick.init()

    joystick = pygame.joystick.Joystick(0)
    joystick.init()
    print("Controller: " + joystick.get_name())
    print()
    print("Ready! Press a button to print a story.")
    print("Press Ctrl+C to quit.")
    print()

    story_count = 0

    try:
        while True:
            time.sleep(0.1)

            for event in pygame.event.get():
                if event.type == pygame.JOYBUTTONDOWN:
                    print("Button " + str(event.button) + " pressed!")

                    # Pick stories based on which button
                    if event.button == BUTTON_1:
                        pool = [s for s in stories if s.get("length") == BUTTON_1_FILTER]
                    elif event.button == BUTTON_2:
                        pool = [s for s in stories if s.get("length") == BUTTON_2_FILTER]
                    elif event.button == BUTTON_3:
                        pool = list(stories)
                    else:
                        print("  (Button " + str(event.button) + " is not mapped to anything)")
                        continue

                    # If the filter returned nothing, use all stories
                    if not pool:
                        pool = list(stories)

                    story = random.choice(pool)
                    story_count += 1
                    print_story(story, story_count)

    except KeyboardInterrupt:
        print("\nShutting down Story Box...")
        pygame.quit()


if __name__ == "__main__":
    main()
