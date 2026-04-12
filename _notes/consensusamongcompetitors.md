---
layout: article
title: Consensus among Competitors
slug: consensusamongcompetitors
display_date: 9/16/25
---

The standard way of creating business software is to create a program that represents a specific way of doing things. This is either some sort of average of all expected ways of doing things, or, in an "opinionated" piece of software, this is what the producer of the software thinks is the correct way of doing things.

Then, when a needed deviation either arises or is predicted, a piece of configuration is added to the software. The customers in Georgia need such-and-such for compliance. The CTO insists they need a way to require a second sign-off for anything over $75. We expect users will hate this feature so we will have a setting to turn it off.

Each setting is a promise to the customer or the users who like to do things that way that they will continue to be able to do things their way. And if the software is being paid for, these are difficult promises to break. Settings accrete and deprecation is rare.

The various customers of a software application, who are sometimes direct competitors, become housemates, bickering about the dishes and arguing over which features should be implemented and how. The developer becomes a mediator, searching for a consensus or, failing that, capitulating: "we'll do both". This results from the simple fact that the various customers of a business application need to use what is fundamentally the same piece of software. The reason for this is also simple: the software business only works if you can sell the same piece of software to many different customers.

Consensus-building is an arduous but noble chore when it comes to civil governance. You cannot say yes to everyone who has an opinion about whether the new apartment should go up or where to put the new middle school. But this is a strange role for a software company to play.

If the ideal is consensus, to discover the one way that all customers will love, and configuration, to implement and ship both ways of doing things, is a compromise, there is another option: do it custom for the customer. This total surrender to the customer is avoided if at all possible. On this the business side and the software side agree. Business doesn't like it because custom work undermines the golden premise of the software business that software has no marginal cost. Developers hate it because they derive pleasure from developing abstractions which are supposed to have so correctly understood the problem space that they make it simple to harmoniously accommodate all reasonable requests.

---

I think we will see in the next few years, as the reality of nearly-free code authoring settles in, an expectation that software should first serve the needs of the user and only afterwards serve the needs of the business or the developer's taste. The last mile will become the only mile. Business software will trend in its design towards the source of business value, each customer's specific needs. It's going to become very hard to say no.

Custom solutions present maintenance problems but they have the benefit of ensuring that the software that gets written will actually be used. And they are not multiplicative; the potential upside for this mode of software development is that the various solutions do not have to live in the same space. As configuration options increase, the complexity of the software increases exponentially. We'll see whether 500 custom implementations are simpler to maintain than a single implementation with 500 settings.
