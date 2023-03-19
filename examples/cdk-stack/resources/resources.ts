import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { StructuredResources } from "../../../services/structured-resources";
import { MyCustomLambdaConstruct } from "../constructs/my-custom-lambda-construct";
import { MyCustomSQSConstruct } from '../constructs/my-custom-sqs-construct';

export class Resources {
  constructor(private readonly scope: Construct) {}

  public imports = new StructuredResources({
    vpc: Vpc.fromVpcAttributes(this.scope, "ImportedVPC", {
      vpcId: "vpc-idxxxxxxxxx",
      availabilityZones: ["eu-west-1"],
      privateSubnetIds: ["subnet-0xxxxxxxxxxxxxxx", "subnet-1xxxxxxxxxxxxxxx"],
    }),
    orderReceivedTopic: Topic.fromTopicArn(
      this.scope,
      "order-received-topic",
      "arn:aws:sns:eu-west-1:444455556666:OrderReceivedTopic"
    ),
    orderCompletedTopic: Topic.fromTopicArn(
      this.scope,
      "order-completed-topic",
      "arn:aws:sns:eu-west-1:444455556666:OrderCompletedTopic"
    ),
    pushNotificationTopic: Topic.fromTopicArn(
      this.scope,
      "push-notification-topic",
      "arn:aws:sns:eu-west-1:444455556666:PushNotificationTopic"
    ),
  });

  public lambda = new StructuredResources({
    orderReceivedPushNotification: new MyCustomLambdaConstruct(this.scope, "order-received-push-notification-lambda", {
      handler: "orderReceivedPushNotification",
      vpc: this.imports.select("vpc"),
    }),
    storeOrderReceived: new MyCustomLambdaConstruct(this.scope, "store-order-received-lambda", {
      handler: "storeOrderReceived",
      vpc: this.imports.select("vpc"),
    }),
    storeOrderCompleted: new MyCustomLambdaConstruct(this.scope, "store-order-completed-lambda", {
      handler: "storeOrderCompleted",
      vpc: this.imports.select("vpc"),
    }),
    orderCompletedPushNotification: new MyCustomLambdaConstruct(this.scope, "order-completed-push-notification-lambda", {
      handler: "orderCompletedPushNotification",
      vpc: this.imports.select("vpc"),
    }),
  });

  public sqs = new StructuredResources({
    orderReceivedPushNotification: new MyCustomSQSConstruct(this.scope, 'order-received-push-notification-queue', {}),
    storeOrderReceived: new MyCustomSQSConstruct(this.scope, 'store-order-received-queue', {}),
    storeOrderCompleted: new MyCustomSQSConstruct(this.scope, 'store-order-completed-queue', {}),
    orderCompletedPushNotification: new MyCustomSQSConstruct(this.scope, 'order-completed-push-notification-queue', {}),
  })

  public dynamo = new StructuredResources({
    orderHistory: new Table(this.scope, "order-history-table", {
      partitionKey: { name: "id", type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
    }),
  });
}
