const router = require("express").Router();
const { User } = require("../../models");

router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.userID = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.userID = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  console.log("logout post");
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
      alert("You're logged out")
    });
  }
});

// router.post('/logout', (req, res) => {
// if (req.session.logged_in) {
//   req.session.destroy(() => {
//     res.status(204).end();

//     });

//   }else {
//     res.status(404).end();
//   }
// });
//   router.get('/logout', (req, res) => {
//     if (req.session.logged_in) {
//         req.session.destroy(() => {
//           res.status(204).end();
//           alert('you logged out')

//         });

//       }else {
//         res.status(404).end();
//       }

// });

module.exports = router;
