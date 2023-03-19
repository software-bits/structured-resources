# Example cdk-stack

Simple CDK stack to demonstrate `structured-resources`.

Imagine a service that is responsible for sending push notifications on order creation and order completion.
- On order creation; `Your order is being processed and expected to be ready in X minutes.`
- On order completion; `Your order has been completed, Y minutes faster/slower than expected.`

In order to keep track of the expected completion time all creation and completion events are stored in a Dynamo table.

Here is what the architecture looks like:
![Example Architecture](/examples/cdk-stack/documentation/example-architecture.png)

## Resources
Resources are created in `/resources/resources.ts`.

### Imported from other stack
- vpc
- order-received-topic
- order-completed-topic
- push-notification-topic

### SQS
- order-received-push-notification-queue
- store-order-received-queue
- store-order-completed-queue
- order-completed-push-notification-queue

### Lambda
- order-received-push-notification-lambda
- store-order-received-lambda
- store-order-completed-lambda
- order-completed-push-notification-lambda

### Dynamo
- order-history-table