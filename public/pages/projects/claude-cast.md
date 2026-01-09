# Cast

**A minimal yet powerful terminal dashboard for managing all your Claw'ds.**

[GitHub](https://github.com/aparente/claude-session-manager)

---

## Using computers got less fun for a while

The other day I posted about how the recent Claude Code updates enabled me to reduce the cognitive overhead caused by context switching between GUIs. As I've progressed in my career, I've spent less of my time in python and bash and more of my time suffering through a cacophony of browsers, office apps, and knowledge management apps like Notion. Each tool is __fine__ on it's own, but a lot of friction comes from manually navigating between them. I'm spending a lot more time in the terminal because Claude Code + Opus 4.5 can do *so many* things, and find myself actively frustrated if I have to switch away from it.

https://x.com/draparente/status/2006114167611339062?s=20 !claude embed this twitter link

!claude figure out how to smooth the transition between ideas here - I want to introduce two different projects described/their motivation below 

But juggling multiple projects meant I kept going back to my computer just to check if Claude needed permission or input, and wondered if there was a way to have Claude notify me remotely - *not* through a screen. Popup notifications zap attention. I wanted something I would notice, not 

In one shot I had Claude communicating to me ambiently in morse code through my Hue lights; all I had to do was press the button on my bridge. A few prompts later, I had a fully customizable ambient alerting plugin. I included a "volitional" mode where claude can choose how it uses light to communicate with you, because why not. Go here to read how that works, how Claude sets a vibe while encouraging me to leave my desk, and what ensued when my partner and I let our Claw'ds pick the lamps they want. 

!claude link to the post about ambient-alerts in the sentence above

My preferred setup is simple; a small pitcher light turns magenta when Claude needs permission. The light change is noticeable while blending into most Hue scenes we oscillate through. 

But I had a new problem. I'd see the alert, come back to my desk, and have to toggle through the many active and zombie sessions to see which one needed my attention.  

Today I came across Geoffrey Litt's demo of managing Claude sessions in notion. Definitely cool, especially since it can work on mobile. But I'd rather stay in a terminal and keep my to-do's in local markdown.  I saw David Siegel's terminal UX video  and got intrigued.

https://x.com/dvdsgl/status/2008685488107139313?s=20 !claude embed this twitter link


---

## Why it exists

I kept losing sessions. Not literally — they were still running. But I'd context-switch to another project, forget that one session was waiting for my approval, and come back an hour later to find it had been sitting there the whole time. Wasted cycles on both sides.

The deeper issue is attention fragmentation. When you're working with AI as a collaborator rather than a tool, you end up with parallel workstreams. That's powerful, but only if you can actually track them. Otherwise you're just accumulating tabs you'll never get back to.

I wanted something that would surface what needed attention without demanding it. Not notifications that interrupt. Just... awareness. A dashboard I could glance at. Peripheral visibility into all the sessions running in the background.

It's the same philosophy as ambient-alerts — information that's *available*, not *demanding*.

---

## What I learned

This project pushed me to think about terminal UX more seriously. Building with React/Ink (React for the terminal) was a revelation — you can treat the terminal like a DOM, with components and state and all the patterns I know from web development. But the constraints are different. No mouse. Limited colors. Every character matters.

The hook system turned out to be surprisingly elegant. Rather than trying to inspect Claude Code's internals or poll for state, the hooks just... tell you what's happening. Session started. Tool used. Input needed. It's event-driven in the cleanest sense.

I also learned that playfulness in developer tools isn't frivolous. The status verbs rotate — "Chilling", "Lounging", "Cooking", "Scheming" — and it makes the dashboard feel alive. Sessions get project-aware emojis based on their names. There's a little crab that wanders around when no sessions are active. None of this is necessary. All of it makes it better.

---

*Built with Claude. January 2025.*
