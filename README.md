# Tech Blog

## User Story

```md
AS A developer who writes about tech
I WANT a CMS-style blog site
SO THAT I can publish articles, blog posts, and my thoughts and opinions
```

## Acceptance Criteria

```md
GIVEN a CMS-style blog site
WHEN I visit the site for the first time
THEN I am presented with the homepage, which includes existing blog posts if any have been posted; navigation links for the homepage and the dashboard; and the option to log in
WHEN I click on the homepage option
THEN I am taken to the homepage
WHEN I click on any other links in the navigation
THEN I am prompted to either sign up or sign in
WHEN I choose to sign up
THEN I am prompted to create a username and password
WHEN I click on the sign-up button
THEN my user credentials are saved and I am logged into the site
WHEN I revisit the site at a later time and choose to sign in
THEN I am prompted to enter my username and password
WHEN I am signed in to the site
THEN I see navigation links for the homepage, the dashboard, and the option to log out
WHEN I click on the homepage option in the navigation
THEN I am taken to the homepage and presented with existing blog posts that include the post title and the date created
WHEN I click on an existing blog post
THEN I am presented with the post title, contents, post creator’s username, and date created for that post and have the option to leave a comment
WHEN I enter a comment and click on the submit button while signed in
THEN the comment is saved and the post is updated to display the comment, the comment creator’s username, and the date created
WHEN I click on the dashboard option in the navigation
THEN I am taken to the dashboard and presented with any blog posts I have already created and the option to add a new blog post
WHEN I click on the button to add a new blog post
THEN I am prompted to enter both a title and contents for my blog post
WHEN I click on the button to create a new blog post
THEN the title and contents of my post are saved and I am taken back to an updated dashboard with my new blog post
WHEN I click on one of my existing posts in the dashboard
THEN I am able to delete or update my post and taken back to an updated dashboard
WHEN I click on the logout option in the navigation
THEN I am signed out of the site
WHEN I am idle on the site for more than a set time
THEN I am able to view comments but I am prompted to log in again before I can add, update, or delete comments
```

## My Comments

1. I tried to limit the effort I put into the layout and styling, and concentrate on the actual functionality.  So there are definitely some parts that need work.  Like, the header's layout is inconsistent because all the pieces are just placed in there.  And in some places the colors are inconsistent are are still using Bootstrap's colors.  But there were still things I was interested in that I worked on.  For example, I know there's some way to add an ellipsis for text that overflows the *height* of its container, but it's not as simple as the setting for text overflowing the width.  I was going to just leave it, but then I had the idea of adding a div that was absolutely positioned, just above the max height.  Though, it does show up if a post is exactly three rows tall.

2. I figure that it is much more trouble to allow users to format their text posts, since you need to add in much more sanititizing and validation, etc.  Or maybe there's a plug-in for having a block interpreted as markdown.  So my example posts do have some html in them, because it seemed weird otherwise.

3. There's definitely a lot of repeated code in my handlebars files, and I am sure there is a much more efficient way to do it.  I'm still getting used to the handlebars system, so I focused on getting it functional first.