import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as TestStack from "../lib/test-stack-stack";

test("Compiles stack", () => {
  const app = new cdk.App();
  const stack = new TestStack.TestStackStack(app, "MyTestStack");
  const template = Template.fromStack(stack);
  template.resourceCountIs("AWS::Lambda::Function", 5);
});
