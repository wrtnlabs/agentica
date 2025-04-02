import deploy from "gh-pages";

deploy.publish(
  "dist",
  {
    branch: "gh-pages",
    dotfiles: true,
  },
  (err) => {
    if (err) {
      console.log(err);
      // eslint-disable-next-line node/prefer-global/process
      process.exit(-1);
    }
    // eslint-disable-next-line no-undef
    else { clear(); }
  },
);
