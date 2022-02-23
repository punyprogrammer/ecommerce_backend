const router = require("express").Router();
// const stripe = require("stripe")(process.env.STRIPE_KEY);
const KEY ='sk_test_51EZ5rqGv1KwaSbc9NNHEdbPNvF6tSHTuc2u1YL1EPkh500jdTsV0W3uNGaIttE6g1slS2JSbxg2ISbCV7lokcalI00lR57ZIEN'
const stripe = require("stripe")(KEY);

router.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = router;
