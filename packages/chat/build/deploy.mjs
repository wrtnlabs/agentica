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
      process.exit(-1);
    }
    else { clear(); }
  },
);
