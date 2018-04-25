"use strict";

const Joi = require("joi");
const Controller = require("core/Controller");

const EmailService = require("middleware/EmailService");

class FeedbackController extends Controller {
  constructor() {
    super();

    this.route("feedback", {
      method: "POST",
      path: "/api/feedback",

      handler: this.feedbackHandler,
      validate: {
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        subject: Joi.string().required(),
        body: Joi.string().required()
      }
    });
  }

  feedbackHandler(request, reply) {
    //make test@test.com an emal for testing purposes
    if (request.payload.email === "test@test.com") {
      reply(true).code(200);
    } else {
      EmailService.sendFeedbackEmail(request.payload);
      reply(true).code(200);
    }
  }
}

module.exports = new FeedbackController();
