const stripeAPI = require('../stripe');

// when payment finished 
const webHookHandlers = {
  // when checkout  completed 
  'checkout.session.completed': (data) => {
    console.log('Checkout completed successfully', data);
    // other business logic
  },
   // when payment went through  
  'payment_intent.succeeded': (data) => {
    console.log('Payment succeeded', data);
  },
  'payment_intent.payment_failed': (data) => {
    console.log('Payment Failed', data);
  }
}

// basically a logger 
function webhook(req, res) {
  const sig = req.headers['stripe-signature'];
  // transaction event 
  let event;

  try {
    // rawBody is the whole data about what purchased, buyer address, total $ etc junk 
    event = stripeAPI.webhooks.constructEvent(
      req['rawBody'], sig, process.env.WEB_HOOK_SECRET); // just a secret code for the web hook logger 
  } catch(error) {
    return res.status(400).send(`Webhook error ${error.message}`);
  }
  // this handler process each case scenario of payment successed etc 
  if (webHookHandlers[event.type]) {
    webHookHandlers[event.type](event.data.object);
  }
}

module.exports = webhook;
