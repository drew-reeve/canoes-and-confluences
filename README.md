# Canoes and Confluences

Plain HTML/CSS site. No build step.

## Photos (images/)
Resized to 1600px max, compressed, and stripped of location metadata.
To swap one, replace the file with the same name, or update the src in the HTML.

## Pending content
- Testimonials: index.html has a hidden "What people say" section. Fill in the quotes, then delete the word `hidden` from its <section> tag.
- Instagram and YouTube: add links to the footer list (class "footer-links") on every page.
- "Why Canoes and Confluences" (about.html) is interim copy, marked with a comment.

## Placeholders to replace
Search for `[` to find every bracketed placeholder: last name, bio, events, program lengths, video caption.

## Video
In index.html, swap the placeholder div for the YouTube iframe (instructions in the comment).

## Site structure (single landing page)
index.html holds everything: Where she teaches, What she teaches, About, Contact.
Old page URLs (/presentations.html, /about.html, etc.) redirect via _redirects.
There is one form, "contact". In Netlify notifications, use "Any form".

## Forms and email

Four forms: booking, question, lesson-request, newsletter. Each email subject is built
from the form contents (script.js), e.g.
"Booking request: Crossing the Bitterroots | Jane Smith, Kamiah Elementary | late March".

### Level 1: Netlify notifications (works now, no extra accounts)
Project configuration > Notifications > Emails and webhooks > Form submission notifications
> Add notification > Email notification. Pick "Any form", send to canoesandconfluences@gmail.com.
Every submission is also saved in the Netlify Forms tab and can be exported as CSV.

### Level 2: formatted emails + automatic confirmations (optional)
netlify/functions/submission-created.mjs sends a branded email with Reply-To set to the
person who wrote in, and an optional "we got your request" email to them.
1. Create a free account at resend.com and add the domain canoesandconfluences.com.
2. Resend lists a few DNS records. Add them in Netlify: Domains > canoesandconfluences.com > DNS settings.
3. In Netlify, Project configuration > Environment variables, add:
   RESEND_API_KEY, FROM_EMAIL (e.g. Canoes and Confluences <hello@canoesandconfluences.com>),
   NOTIFY_TO (canoesandconfluences@gmail.com), SEND_CONFIRMATIONS (true)
4. Redeploy. Then turn off the Level 1 email notification so Laurie doesn't get two emails.
Until those variables exist, the function does nothing.

## Deploy
Push this folder to GitHub > Netlify "Import from GitHub" > leave build settings blank.
