#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { TestStackStack } from "../lib/test-stack-stack";

const app = new cdk.App();
new TestStackStack(app, "TestStackStack");
