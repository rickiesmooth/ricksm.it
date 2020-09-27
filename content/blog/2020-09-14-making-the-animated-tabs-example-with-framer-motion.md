---
layout: blog
title: Recreating the Animated Tabs example with Framer Motion
date: 2020-09-14T13:19:00.368Z
---
For a while now, I've kept a close eye on Framer. It's a prototyping tool (based in Amsterdam) and is one of the startups that is trying to make the design handoff easier and bring development closer to design and vice versa.

Over on their website they have this [beautiful pattern library](https://www.framer.com/examples/), so I was hoping to _not_ get my hands dirty and copy and paste some of those examples in the project I was working on. Unfortunately I couldn't find any drop in examples but luckily there was an example of something that came pretty close - the image carousel which I'll tweak a bit to fit my use case and learn more about framer motion.


Lets have a look at the code of the image carousel component

```javascript
const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

export const Example = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // We only have 3 images, but we paginate them absolutely (ie 1, 2, 3, 4, 5...) and
  // then wrap that within 0-2 to find our image ID in the array below. By passing an
  // absolute page index as the `motion` component's `key` prop, `AnimatePresence` will
  // detect it as an entirely new image. So you can infinitely paginate as few as 1 images.
  const imageIndex = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={page}
          src={images[imageIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 200 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
        />
      </AnimatePresence>
      <div className="next" onClick={() => paginate(1)}>
        {"‣"}
      </div>
      <div className="prev" onClick={() => paginate(-1)}>
        {"‣"}
      </div>
    </>
  );
};
```

This is great! Exactly what I need, I only need to add the tab indicator, tweak the pagination behaviour a bit and loop over its children. So lets have a look at what we see here:

* `variants` - Variants are a declarative way to orchestrate complex animations throughout a component tree. By providing multiple components with a variants object with visual states of the same name, they can all be animated in sync by the switch of a single animate prop.
* `AnimatePresence` - Animate components when they're removed from the React tree.

* `motion.img` - motion component's flexible animate property.


With a few small tweaks, we have something that comes pretty close:
<iframe src="https://codesandbox.io/embed/framer-motion-image-gallery-forked-7h9kq?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Framer Motion: Image gallery (forked)"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## CSS tweaks
Position relative, width

## it's an animated shared layout
Activity indicator, Animate layout changes across, and between, multiple components.
layoutId="underline"

## ↔️ 🔤 setPage([i, i - page]);
Direction