import { ITopic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class MyCustomSQSConstruct extends Queue {
  subscribeToSNSTopic(topic: ITopic) {
    topic.addSubscription(new SqsSubscription(this))
  }
}