---
layout: post
title: Refactoring with accessibility in mind
date: 2021-02-07T14:47:20.362Z
---
For the last couple of months, I've been working on refactoring a core piece of wetransfer.com. The transfer window for Pro users. Currently the Pro features are a bit hidden, and with a new design we wanted to highlight all the extra functionality you get as a paying customer (password protected passwords, extended transfer expiry dates etc.). Changing the transfer window was a big deal, because it's a core piece of functionality and has been largely untouched for years! This resulted in a quit complex component and I decided to do a complete rewrite (in TypeScript), and start from scratch with accessibility in mind. 

<div class="video-container">
    <video autoPlay muted loop src="/assets/video/demo.webm" width="100%"></video>
</div>

The component might seem like it has a lot going on, but when you break it down, it's pretty simple. We have a container component (`TransferWindowPro`) that manages most of the state and is connected with Redux, switches between the expanded and collapsed UI. The expanded UI is used during the configuration of the transfer, and the collapsed UI is used to display different uploading states. When the window expands we transform the `scale` of the SVG to animate the layout of the file list, and it appears as if the configuration component slides out of the files list. All these transitions are triggered as components are added and removed from the DOM, with the use of a prop and `react-transition-group`.

## accessibility improvements 

From the beginning we wanted everything to be fully keyboard accessible and have clear focus states which sometimes wasn't optimal from a design point of view (e.g. chrome doesn't remove the outline after a click, the standard outline doesn't adhere to rounded borders). So to solve these issues we decided to use `:focus-visible` to provide a different focus indicator based on the user’s input modality (mouse vs. keyboard). Because we need to support IE11 we also had to add the polyfill and a postCSS plugin so we can start using it today. For the rounded outline Josh Cameau had a great tip:

<!-- <StaticTweet id="1356713502954635274" /> -->

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">🔥 Focus outlines are important for accessibility, but they can&#39;t be rounded. Simulate &#39;em with box-shadow!<br><br>This neat trick uses the semi-obscure “spread” property:<br><br>.btn {<br> box-shadow: <br> 0px 0px 0px 2px <a href="https://twitter.com/hashtag/2960C5?src=hash&amp;ref_src=twsrc%5Etfw">#2960C5</a>,<br> 0px 0px 0px 3px <a href="https://twitter.com/hashtag/FFFFFF?src=hash&amp;ref_src=twsrc%5Etfw">#FFFFFF</a>;<br>}<br><br>Demo: <a href="https://t.co/NvY0qIEkPV">https://t.co/NvY0qIEkPV</a> <a href="https://t.co/naE019qEcS">pic.twitter.com/naE019qEcS</a></p>&mdash; Josh W. Comeau (@JoshWComeau) <a href="https://twitter.com/JoshWComeau/status/1356713502954635274?ref_src=twsrc%5Etfw">February 2, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

While I was writing these components, I wrote my unit tests with `react-testing-library`, which helps you to write your components in an accessible way:

> One of the guiding principles of the Testing Library APIs is that they should enable you to test your app the way your users use it, including through accessibility interfaces like screen readers.

So while I was testing my code I used `*ByRole` selectors a lot, and found multiple accessibility improvements while I was developing and when I first went through the new transfer window VoiceOver over enabled, the text gave an ok representation what was on the screen.

In the transfer window we Reach UI (an accessible foundation for React components) where we can, and this helps making something like an [accessibility complex](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/listbox-combo.html) component like a combobox, very easy. It was really cool to hear the VoiceOver highlighting that there are multiple items in the list.

I did run into some issues with the switch component I made, where the screenreader did not read out the label when you focussed. And when I came across the aria [switch role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Switch_role), I rewrote that a bit and was able to describe the switches correctly.

my tips:
<Callout list={[
    `write tests with react-testing-libary and follow their tips for good accessibility.`,
    `use something like reach-ui for more complex accessibility patterns`,
    `Use VoiceOver for mac to check your component.`,
    `use focus-outline and box-shadow for nice focus states.`
]} />

## the results 
TBC