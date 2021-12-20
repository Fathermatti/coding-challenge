# Weld's coding-challenge

This solution fulfills the following use cases

- Configure a message protocol between the two services. You can get inspiration from the [nestjs docs.](https://docs.nestjs.com/microservices/basics) Choose which ever you want but tell us why in your answer.
- Create an endpoint on **data-streams** that tells **worker** to start fetching data on an interval (every 5 minutes).
- Setup an [http module](https://docs.nestjs.com/techniques/http-module) that **worker** can use to communicate with the external API.
- Send the data and store the results on **data-streams** using internal communication protocol.
- Make an endpoint on **data-streams** that can fetch the data stored on **data-streams**. Use whatever storage you see fit but tell us why you chose it.
- Make an endpoint on **data-streams** that can stop the data fetching on **worker**.

### Design

The app **data-streams** is responsible for managing jobs fetching data and exposing it. It does this through REST inspired endpoints.

The app **worker** is responsible for fetching news articles from [https://newsapi.org](https://newsapi.org) and return them to **data-streams**.


### Flow

1. A [NestJS scheduler](https://docs.nestjs.com/techniques/task-scheduling) hits an endpoint in **data-streams** every minute which checks for jobs ready to be triggered, and sends an event to the **worker** for each one. This is done instead of running a process inside a controller continously, to keep each controller action shortlived and simple. Events are used instead of request-response to make the system more resilient. A publish-subscribe system might be useful here.
2. Once the **worker** retrieves the data, it sends the articles back as events, same as above. A persistent event system might be useful here.
3. Back in **data-streams**, data in events is retrieved and stored in-memory for the sake of simplicity in this demo. 


### Going forward

This app does not use persistance, and in order to work between deployments the following would need to be persisted:

* Schedules would need to be persisted, e.g. in a NoSQL database like MongoDB
* Articles in **data-streams** would need to be persisted, e.g. in a NoSQL database
* Events between the services could be sent over fitting infrastructure e.g. RabbitMQ and/or Kafka.

Deployment to production would also require more testing, logging and handling of secrets like API keys.


## Start:

Run data-streams with:
```
yarn start
```

And the worker with
```
yarn start worker
```
