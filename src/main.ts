import { App } from "cdktf";
import { MyStack } from "./stacks/my-stack";

const app = new App();

new MyStack(app, "cdktf-gcp-functionv2-dev");

app.synth();
