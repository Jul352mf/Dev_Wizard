CONTEXT: This prompt was sent as a response to the review.


### 1. Scope and Phasing

Unified project management and dev server control) and deferring bells and whistles like VM spawning and gamified experiences to later versions.

### 2. Existing Tools Survey

Fill in survey here after GPT agent finished his work

### 3. Security Design Clarity

Fill in security strategy here after GPT agent finished his work

### 4. User Experience Design

Instead of multiple sidebars lets do a menu toggle of the currently selected page that reveals the subpages. This way we don’t need multiple navbars. Make sure the design is easy to understand and come up with a plan for it before starting to build it. 

### 5. Integration Strategy

Starting standalone app in Monorepo and integrating later to minimize disruption. We will prompt the copilot cloud run agent to start with the current dev branch of the jagi repo so this is okay. We just need to tell him that he needs to create a new standalone app in /apps.

### 6. Documentation and Decision Logs

We need solid documentation practices or decision logs. For a project this complex, every architectural and security choice should be recorded with rationale.  Without explicit documentation, institutional knowledge may get lost and later contributors will struggle to understand why certain approaches were taken.



The github cloud agent works in a linux sandbox so it will probably be hard for him to test powershell scripts/commands sooo we could use bash instead? or is there another good way to make it OS agnostic? If not we do linux and windows and make it configurable which OS is used in the profile creation form and its settings. Most likely the commands will fail since they haven't been tested on windows but debugging them shouldn't be to hard especially when all the commands and scripts used are saved in the dev_wizard folder. 

Okay now do the following tasks: 
1. Systematic survey of what’s available 
2. Come up with a great security design clarity and subsequent strategy
3. Define a crisp MVP leveraging the best existing tools you found.
4. Create all artifacts and docs needed to start building this project PRD, architecture, roadmap and sprints etc. for it to create this MVP in full. Focus on explaining what and how to do it and don't generate code tell it why, how and what code to generate. 
5. Do everything remaining on the todo list / roadmap you can do 
6. Generate a prompt for Git Hub copilot to start this project. All the previously generated artifacts will be provided in the directory "docs/Dev_Wizard". 
7. Give me all the files in a zip download. 
 
Do you have any questions before you start?