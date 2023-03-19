import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Resources } from "../resources/resources";

export class TestStackStack extends Stack {
  /**
   * Create AWS resources
   */
  resources = new Resources(this);

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * Grant access
     */
    this.resources.lambda.selectSome('storeOrderCompleted', 'storeOrderReceived')
      .forEach((lambdaFn) => this.resources.dynamo.for('orderHistory').grantReadWriteData(lambdaFn));
    
    this.resources.lambda.selectSome('orderCompletedPushNotification', 'orderReceivedPushNotification')
      .forEach((lambdaFn) => {
        this.resources.dynamo.for('orderHistory').grantReadData(lambdaFn);
        this.resources.imports.for('pushNotificationTopic').grantPublish(lambdaFn);
      });

    /**
     * Set subscriptions
     */
    this.resources.sqs.for('orderCompletedPushNotification').subscribeToSNSTopic(this.resources.imports.select('orderCompletedTopic'));
    this.resources.sqs.for('storeOrderCompleted').subscribeToSNSTopic(this.resources.imports.select('orderCompletedTopic'));

    this.resources.sqs.for('orderReceivedPushNotification').subscribeToSNSTopic(this.resources.imports.select('orderReceivedTopic'));
    this.resources.sqs.for('storeOrderReceived').subscribeToSNSTopic(this.resources.imports.select('orderReceivedTopic'));

    /** 
     * Set event sources
    */
    this.resources.lambda.for('orderCompletedPushNotification').addSQSEventSource(this.resources.sqs.select('orderCompletedPushNotification'));
    this.resources.lambda.for('orderReceivedPushNotification').addSQSEventSource(this.resources.sqs.select('orderReceivedPushNotification'));
    this.resources.lambda.for('storeOrderCompleted').addSQSEventSource(this.resources.sqs.select('storeOrderCompleted'));
    this.resources.lambda.for('storeOrderReceived').addSQSEventSource(this.resources.sqs.select('storeOrderReceived'));

    /**
     * Add environment variables
     */
    this.resources.lambda.all()
      .addEnvironment("TABLE_NAME", this.resources.dynamo.select('orderHistory').tableName);
    this.resources.lambda.for('orderCompletedPushNotification', 'orderReceivedPushNotification')
      .addEnvironment('TOPIC_NAME', this.resources.imports.select('pushNotificationTopic').topicName);
  }
}
