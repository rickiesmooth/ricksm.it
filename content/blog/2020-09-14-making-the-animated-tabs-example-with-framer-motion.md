---
layout: blog
title: Recreating the Animated Tabs example with framer motion
date: 2020-09-14T13:19:00.368Z
---
For a while now, I've kept a close eye on Framer. It's a prototyping tool (based in Amsterdam) and is one of the startups that is trying to make the design handoff easier and bring development closer to design and vice versa.

Over on their website they have this [beautiful pattern library](https://www.framer.com/examples/), so I was hoping to _not_ get my hands dirty and copy and paste some of those examples in the project I was working on. Unfortunately I couldn't find any drop in examples but luckily there was an example of something that came pretty close - the image carousel which I'll tweak a bit to fit my use case and learn more about framer motion in the process.


Start with image carousel, see how far we get.

```javascript
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

This is great! Exactly what I need, I only need to add the tab indicator, tweak the pagination behaviour a bit and loop over its children.