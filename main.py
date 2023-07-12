import cdktf
from stacks.functionv2_stack import FunctionV2Stack

app = cdktf.App()

FunctionV2Stack(
    app,
    "FunctionV2Stack",
)

app.synth()
