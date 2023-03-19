import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from "constructs";

export class MyCustomLambdaConstruct extends NodejsFunction {
  constructor(
    scope: Construct,
    id: string,
    props?: NodejsFunctionProps
  ) {
    super(scope, id, {
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      entry: "examples/cdk-stack/src/handlers.ts",
      ...props,
    });
  }

  addSQSEventSource(queue: IQueue) {
    this.addEventSource(new SqsEventSource(queue));
  }
}
