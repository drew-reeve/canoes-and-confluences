# Canoes and Confluences

Plain HTML/CSS site. No build step.

## Photos to add (images/)
- hero.jpg: wide river or speaking shot, 2000px+ wide (home hero)
- laurie-portrait.jpg: vertical portrait (About page)
- Lessons page photo slot: classroom or hands-on activity

## Placeholders to replace
Search for `[` to find every bracketed placeholder: last name, bio, events, program lengths, video caption.

## Video
In index.html, swap the placeholder div for the YouTube iframe (instructions in the comment).

## Forms (Netlify)
Two forms are wired up: `booking` (contact.html) and `newsletter` (home page).
After deploying: Netlify dashboard > Forms > enable form detection, then
Site configuration > Notifications > Emails and webhooks > add an email notification for each form.

## Deploy
Push this folder to GitHub > Netlify "Import from GitHub" > leave build settings blank.
